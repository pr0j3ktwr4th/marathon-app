import React, { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Container, Paper, Typography, ToggleButton, ToggleButtonGroup, useTheme, useMediaQuery, IconButton, Tooltip, Button } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import halfGpx from '../assets/halfmarathon.gpx';
import fullGpx from '../assets/full marathon.gpx';

const getContainerStyle = (isMobile) => ({
  width: '100%',
  height: isMobile ? '300px' : '600px',
  borderRadius: isMobile ? '8px' : '12px',
  overflow: 'hidden'
});

// Example center coordinates (you can adjust these to your actual location)
const center = {
  lat: 37.5665,
  lng: 126.9780
};

// Full marathon water point (marathon halfway / water point)
const FULL_WATER_POINT = { lat: 36.97409898, lng: 126.99722975 };

// Example route coordinates for both full and half marathon
const fullMarathonPath = [
  // Example coordinates - replace with actual route coordinates
  { lat: 37.5665, lng: 126.9780 },
  { lat: 37.5700, lng: 126.9800 },
  { lat: 37.5750, lng: 126.9850 },
  // Add more coordinates to complete the full marathon route
];

// will be populated by parsing the GPX file
let halfMarathonPath = [
  { lat: 37.5665, lng: 126.9780 },
  { lat: 37.5700, lng: 126.9800 },
];

const CoursePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDistance, setSelectedDistance] = useState('full');
  const [map, setMap] = useState(null);
  const [parsedHalfPath, setParsedHalfPath] = useState(null);
  const [parsedFullPath, setParsedFullPath] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [halfwayPoint, setHalfwayPoint] = useState(null);
  const [hoverMarkers, setHoverMarkers] = useState({ start: false, end: false, half: false });
  const [openInfo, setOpenInfo] = useState({ start: false, end: false, half: false });
  const mapWrapperRef = useRef(null);
  const [descWidth, setDescWidth] = useState(null);
  const containerStyle = getContainerStyle(isMobile);

  // safe shim for accessing the google maps namespace only when available
  const gmaps = (typeof window !== 'undefined' && window.google && window.google.maps) ? window.google.maps : null;

  const fitToRoute = useCallback(() => {
    if (!map || !gmaps) return;
    const path = selectedDistance === 'full'
      ? (parsedFullPath && parsedFullPath.length ? parsedFullPath : fullMarathonPath)
      : (parsedHalfPath && parsedHalfPath.length ? parsedHalfPath : halfMarathonPath);
    if (!path || !path.length) return;
    const bounds = new gmaps.LatLngBounds();
    path.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
    map.fitBounds(bounds);
  }, [map, gmaps, selectedDistance, parsedHalfPath, parsedFullPath]);


  // Strava link for the full marathon route
  const stravaFullRoute = 'https://www.strava.com/routes/3409735240127946974';
  // Strava link for the half marathon route
  const stravaHalfRoute = 'https://www.strava.com/routes/3409735128908525794';

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleDistanceChange = (event, newDistance) => {
    if (newDistance !== null) {
      setSelectedDistance(newDistance);
    }
  };

  // Parse GPX for half marathon when component mounts (namespace-safe, dedupe consecutive points)
  useEffect(() => {
    let mounted = true;
    async function loadGpx() {
      try {
        const res = await fetch(halfGpx);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');

        // namespace-aware selection: try getElementsByTagNameNS then fallback
        let trkpts = [];
        try {
          trkpts = Array.from(xml.getElementsByTagNameNS('*', 'trkpt'));
        } catch (e) {
          trkpts = Array.from(xml.getElementsByTagName('trkpt'));
        }
        let rtepts = [];
        try {
          rtepts = Array.from(xml.getElementsByTagNameNS('*', 'rtept'));
        } catch (e) {
          rtepts = Array.from(xml.getElementsByTagName('rtept'));
        }

        const rawPoints = (trkpts.length ? trkpts : rtepts).map((pt) => {
          // Some GPX files use lon attribute name or long; handle defensively
          const latAttr = pt.getAttribute('lat');
          const lonAttr = pt.getAttribute('lon') || pt.getAttribute('long') || pt.getAttribute('lng');
          return {
            lat: parseFloat(latAttr),
            lng: parseFloat(lonAttr),
          };
        }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));

        // Dedupe consecutive identical points (GPS noise) while preserving order
        const points = [];
        let last = null;
        for (const p of rawPoints) {
          if (!last || Math.abs(p.lat - last.lat) > 1e-7 || Math.abs(p.lng - last.lng) > 1e-7) {
            points.push(p);
            last = p;
          }
        }

        // helper: haversine distance in meters
        const haversine = (a, b) => {
          const toRad = x => x * Math.PI / 180;
          const R = 6371000; // meters
          const dLat = toRad(b.lat - a.lat);
          const dLon = toRad(b.lng - a.lng);
          const lat1 = toRad(a.lat);
          const lat2 = toRad(b.lat);
          const sinDlat = Math.sin(dLat/2);
          const sinDlon = Math.sin(dLon/2);
          const aa = sinDlat*sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon*sinDlon;
          const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
          return R * c;
        };

        // remove isolated spikes: if a point is far from prev and next, and prev->next is short, skip it
        const cleaned = [];
        const threshold = 200; // meters - spike threshold
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (i === 0 || i === points.length - 1) {
            cleaned.push(p);
            continue;
          }
          const prev = points[i-1];
          const next = points[i+1];
          const dPrev = haversine(prev, p);
          const dNext = haversine(p, next);
          const dSkip = haversine(prev, next);
          if (dPrev > threshold && dNext > threshold && dSkip < threshold) {
            // spike detected, skip p
            continue;
          }
          cleaned.push(p);
        }

        if (mounted && points && points.length) {
          // always use cleaned path internally to remove obvious spikes
          setParsedHalfPath(cleaned);
          // compute halfway point: find nearest GPX point to provided halfway coord
          try {
            const target = { lat: 36.97706996, lng: 126.98827 };
            let best = null;
            let bestD = Infinity;
            const toRad = x => x * Math.PI / 180;
            const haversine = (a, b) => {
              const R = 6371000;
              const dLat = toRad(b.lat - a.lat);
              const dLon = toRad(b.lng - a.lng);
              const lat1 = toRad(a.lat);
              const lat2 = toRad(b.lat);
              const sinDlat = Math.sin(dLat/2);
              const sinDlon = Math.sin(dLon/2);
              const aa = sinDlat*sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon*sinDlon;
              const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
              return R * c;
            };
            cleaned.forEach(p => {
              const d = haversine(p, target);
              if (d < bestD) { bestD = d; best = p; }
            });
            if (best) {
              setHalfwayPoint(best);
              // do not auto-open or animate markers; users can click markers to open InfoWindows
            }
          } catch (e) {
            // ignore
          }
          // if map already loaded, fit bounds
          if (map && points && points.length && gmaps) {
            const bounds = new gmaps.LatLngBounds();
            cleaned.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
            map.fitBounds(bounds);
          }
        }
      } catch (err) {
        // parsing failed, leave default path
        console.warn('Failed to load GPX:', err);
      }
    }

    loadGpx();
    return () => { mounted = false; };
  }, [map, gmaps]);

  // Parse GPX for full marathon (same logic as half GPX parsing)
  useEffect(() => {
    let mounted = true;
    async function loadFull() {
      try {
        const res = await fetch(fullGpx);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');

        let trkpts = [];
        try { trkpts = Array.from(xml.getElementsByTagNameNS('*', 'trkpt')); } catch (e) { trkpts = Array.from(xml.getElementsByTagName('trkpt')); }
        let rtepts = [];
        try { rtepts = Array.from(xml.getElementsByTagNameNS('*', 'rtept')); } catch (e) { rtepts = Array.from(xml.getElementsByTagName('rtept')); }

        const rawPoints = (trkpts.length ? trkpts : rtepts).map((pt) => {
          const latAttr = pt.getAttribute('lat');
          const lonAttr = pt.getAttribute('lon') || pt.getAttribute('long') || pt.getAttribute('lng');
          return { lat: parseFloat(latAttr), lng: parseFloat(lonAttr) };
        }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));

        const points = [];
        let last = null;
        for (const p of rawPoints) {
          if (!last || Math.abs(p.lat - last.lat) > 1e-7 || Math.abs(p.lng - last.lng) > 1e-7) {
            points.push(p);
            last = p;
          }
        }

        const haversine = (a, b) => {
          const toRad = x => x * Math.PI / 180;
          const R = 6371000;
          const dLat = toRad(b.lat - a.lat);
          const dLon = toRad(b.lng - a.lng);
          const lat1 = toRad(a.lat);
          const lat2 = toRad(b.lat);
          const sinDlat = Math.sin(dLat/2);
          const sinDlon = Math.sin(dLon/2);
          const aa = sinDlat*sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon*sinDlon;
          const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
          return R * c;
        };

        const cleaned = [];
        const threshold = 200;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (i === 0 || i === points.length - 1) { cleaned.push(p); continue; }
          const prev = points[i-1];
          const next = points[i+1];
          const dPrev = haversine(prev, p);
          const dNext = haversine(p, next);
          const dSkip = haversine(prev, next);
          if (dPrev > threshold && dNext > threshold && dSkip < threshold) { continue; }
          cleaned.push(p);
        }

        if (mounted && points && points.length) {
          setParsedFullPath(cleaned);
          // if map loaded, fit bounds when full is selected
          // don't auto-fit here; separate effect will react to selectedDistance changes
        }
      } catch (err) {
        console.warn('Failed to load full GPX:', err);
      }
    }

    loadFull();
    return () => { mounted = false; };
  }, [map, gmaps]);

  // When the user selects the full route, fit to parsedFullPath (or fallback) once available
  useEffect(() => {
    if (selectedDistance !== 'full' || !map || !gmaps) return;
    const path = parsedFullPath && parsedFullPath.length ? parsedFullPath : fullMarathonPath;
    if (!path || !path.length) return;
    const bounds = new gmaps.LatLngBounds();
    path.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
    map.fitBounds(bounds);
  }, [selectedDistance, parsedFullPath, map, gmaps]);

  // fit map to parsed path when user switches to half and map exists
  useEffect(() => {
    if (selectedDistance === 'half' && parsedHalfPath && parsedHalfPath.length && map && gmaps) {
      const bounds = new gmaps.LatLngBounds();
      parsedHalfPath.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds);
    }
  }, [selectedDistance, parsedHalfPath, map, gmaps]);

  // parsedHalfPath is derived and cleaned automatically after GPX load

  // when parsed path first becomes available we don't auto-open or animate markers anymore;
  // users can click markers to open InfoWindows. Keep this effect for future hooks or analytics.
  useEffect(() => {
    if (!parsedHalfPath || parsedHalfPath.length < 2) return;
    // no auto-bounce or auto-open: markers remain idle until clicked
    return;
  }, [parsedHalfPath, halfwayPoint]);

  // measure the map container width and keep it in state so the description card can match it
  useEffect(() => {
    function measure() {
      try {
        const w = mapWrapperRef.current ? mapWrapperRef.current.clientWidth : null;
        setDescWidth(w);
      } catch (e) {
        // ignore
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mapWrapperRef]);

  const baseMapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true
  };

  // (darkStyles removed - default/roadmap styling preferred)

  // Do not apply the dark theme for the full marathon; use default/roadmap styling
  const mapOptions = {
    ...baseMapOptions,
    styles: undefined,
    mapTypeId: mapType === 'satellite' ? 'satellite' : 'roadmap'
  };

  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  return (
    <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f5f5f5' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3.75rem' },
              background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: { xs: 1.2, sm: 1.167 }
            }}
          >
            COURSE MAP
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary', 
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Explore the full and half marathon routes
          </Typography>

          <ToggleButtonGroup
            value={selectedDistance}
            exclusive
            onChange={handleDistanceChange}
            aria-label="course distance"
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ 
              mb: 4,
              width: isMobile ? '100%' : 'auto',
              '& .MuiToggleButton-root': {
                width: isMobile ? '100%' : 'auto'
              }
            }}
          >
            <ToggleButton 
              value="full" 
              aria-label="full marathon"
              sx={{
                px: { xs: 2, sm: 4 },
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  }
                }
              }}
            >
              Full Marathon
            </ToggleButton>
            <ToggleButton 
              value="half" 
              aria-label="half marathon"
              sx={{
                px: { xs: 2, sm: 4 },
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  }
                }
              }}
            >
              Half Marathon
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={mapType}
              exclusive
              onChange={(e, v) => { if (v) setMapType(v); }}
              aria-label="map type"
            >
              <ToggleButton value="roadmap" aria-label="roadmap">Roadmap</ToggleButton>
              <ToggleButton value="satellite" aria-label="satellite">Satellite</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box ref={mapWrapperRef} sx={{ position: 'relative' }}>
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            {googleApiKey ? (
              <LoadScript googleMapsApiKey={googleApiKey}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={mapOptions}
                >
                  {/* Full and Half polylines (only the selected one is visible) */}
                  {selectedDistance === 'full' ? (
                    <Polyline
                      path={(parsedFullPath && parsedFullPath.length) ? parsedFullPath : fullMarathonPath}
                      options={{ strokeColor: '#3FAF5D', strokeOpacity: 1, strokeWeight: 4 }}
                    />
                  ) : (
                    <Polyline
                      path={(parsedHalfPath && parsedHalfPath.length) ? parsedHalfPath : halfMarathonPath}
                      options={{ strokeColor: '#1C4C89', strokeOpacity: 1, strokeWeight: 4 }}
                    />
                  )}

                  {/* Start / End markers and halfway/water marker for selected route */}
                  {(() => {
                    const path = selectedDistance === 'full' ? ((parsedFullPath && parsedFullPath.length) ? parsedFullPath : fullMarathonPath) : ((parsedHalfPath && parsedHalfPath.length) ? parsedHalfPath : halfMarathonPath);
                      const start = path[0];
                      const end = path[path.length - 1];
                      // For the full marathon, use the provided marathon water point as the yellow marker
                      const halfOrWater = selectedDistance === 'full' ? FULL_WATER_POINT : halfwayPoint;
                      return (
                        <>
                          <Marker
                            position={start}
                            onMouseOver={() => setHoverMarkers(h => ({ ...h, start: true }))}
                            onMouseOut={() => setHoverMarkers(h => ({ ...h, start: false }))}
                            icon={gmaps ? { path: gmaps.SymbolPath.CIRCLE, scale: hoverMarkers.start ? 10 : 8, fillColor: '#1C6FD6', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 } : undefined}
                            onClick={() => setOpenInfo(prev => ({ ...prev, start: true }))}
                          />
                          {openInfo.start && (
                            <InfoWindow position={start} onCloseClick={() => setOpenInfo(prev => ({ ...prev, start: false }))}>
                              <Box sx={{ p: 1 }}>
                                <Typography variant="subtitle2">Start</Typography>
                                <Typography variant="body2">Race Start Line</Typography>
                              </Box>
                            </InfoWindow>
                          )}

                          <Marker
                            position={end}
                            onMouseOver={() => setHoverMarkers(h => ({ ...h, end: true }))}
                            onMouseOut={() => setHoverMarkers(h => ({ ...h, end: false }))}
                            icon={gmaps ? { path: gmaps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: hoverMarkers.end ? 7 : 6, fillColor: '#3FAF5D', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 } : undefined}
                            onClick={() => setOpenInfo(prev => ({ ...prev, end: true }))}
                          />
                          {openInfo.end && (
                            <InfoWindow position={end} onCloseClick={() => setOpenInfo(prev => ({ ...prev, end: false }))}>
                              <Box sx={{ p: 1 }}>
                                <Typography variant="subtitle2">Finish</Typography>
                                <Typography variant="body2">Finish Line</Typography>
                              </Box>
                            </InfoWindow>
                          )}

                          {/* Halfway / water marker (yellow) - only for full marathon (half uses finish water) */}
                          {(selectedDistance === 'full' && halfOrWater) && (
                            <>
                              <Marker
                                position={halfOrWater}
                                onMouseOver={() => setHoverMarkers(h => ({ ...h, half: true }))}
                                onMouseOut={() => setHoverMarkers(h => ({ ...h, half: false }))}
                                icon={gmaps ? { path: gmaps.SymbolPath.CIRCLE, scale: hoverMarkers.half ? 8 : 6, fillColor: '#FFD700', fillOpacity: 1, strokeColor: '#333', strokeWeight: 2 } : undefined}
                                onClick={() => setOpenInfo(prev => ({ ...prev, half: true }))}
                              />
                              {openInfo.half && (
                                <InfoWindow position={halfOrWater} onCloseClick={() => setOpenInfo(prev => ({ ...prev, half: false }))}>
                                  <Box sx={{ p: 1 }}>
                                    <Typography variant="subtitle2">{selectedDistance === 'full' ? 'Water Point' : 'Halfway Point'}</Typography>
                                    <Typography variant="body2">{selectedDistance === 'full' ? 'Marathon water point' : 'Approx. Halfway'}</Typography>
                                  </Box>
                                </InfoWindow>
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}
                </GoogleMap>
                {/* Fit-to-route control */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 100, display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Fit route">
                    <IconButton onClick={fitToRoute} size="small" sx={{ bgcolor: 'white', boxShadow: 1 }}>
                      <MyLocationIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    component="a"
                    href={selectedDistance === 'full' ? stravaFullRoute : stravaHalfRoute}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ ml: 1, bgcolor: 'white', boxShadow: 1 }}
                    endIcon={<OpenInNewIcon />}
                  >
                    {selectedDistance === 'full' ? 'Strava (Full)' : 'Strava (Half)'}
                  </Button>
                </Box>
              </LoadScript>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Map unavailable</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Google Maps API key is not configured. To enable the interactive map, set
                  <Box component="code" sx={{ display: 'inline-block', mx: 1 }}>REACT_APP_GOOGLE_MAPS_API_KEY</Box>
                  in your <Box component="code" sx={{ display: 'inline-block', mx: 1 }}>.env</Box> file and restart the dev server.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>


        {/* Course Details Section */}
        <Box sx={{ 
          mt: { xs: 4, sm: 6 }, 
          display: 'grid', 
          gap: { xs: 3, sm: 4 }, 
          gridTemplateColumns: { xs: '1fr', md: '1fr' }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              // subtle border to separate from map
              border: '1px solid rgba(0,0,0,0.06)',
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: descWidth ? `${descWidth}px` : { xs: '100%', md: '1100px' },
              mx: 'auto',
              boxShadow: '0 6px 18px rgba(20,20,20,0.08)'
            }}
          >
              {/* top marker legend removed; in-card legend remains below */}
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
              Course Description
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, fontSize: '1.02rem' }}>
              The Half Marathon is made of two loops of the half-marathon circuit — runners complete the loop twice and finish at the official Finish Line (green arrow on the map). The map is indicative and may not be exact. Obey traffic signals and take extra care at crossings.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.95rem' }}>
              Elevation summary: Max ~18 m, typical grade ~3%. Total ascent ~290 m, total descent ~290 m.
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 700 }}>
              Marker legend:
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'default', minWidth: 140, '&:hover > div': { transform: 'scale(1.2)', filter: 'brightness(1.15)' } }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1C6FD6', border: '2px solid #fff', transition: 'transform 150ms ease, filter 150ms ease' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>Start: blue circle</Typography>
              </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 200 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFD700', border: '2px solid #333' }} />
                  <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>
                    Halfway / water point: yellow circle — Full marathon water point at 36.97409898, 126.99722975. Half marathon runners should use the Finish Line water station.
                  </Typography>
                </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 180 }}>
                <Box sx={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid #3FAF5D', transform: 'rotate(180deg)', boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>Finish: green arrow (single water station at finish)</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 700 }}>
              Important safety & support notes:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 0, color: 'text.secondary' }}>
              <Typography component="li" sx={{ mb: 1, fontSize: '0.95rem' }}>
                There is only one water station at the Finish Line (green arrow). Carry personal hydration and snacks for the course.
              </Typography>
              <Typography component="li" sx={{ mb: 1, fontSize: '0.95rem' }}>
                No medical support points on-course. Carry a mobile phone and personal first-aid supplies.
              </Typography>
              <Typography component="li" sx={{ mb: 1, fontSize: '0.95rem' }}>
                The map is guidance only — obey traffic controls and use caution at road crossings.
              </Typography>
              <Typography component="li" sx={{ fontSize: '0.95rem' }}>
                Be aware of traffic and other users on the route; run defensively.
              </Typography>
            </Box>
          </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CoursePage;