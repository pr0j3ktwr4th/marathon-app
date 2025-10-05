import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Box, Container, Paper, Typography, ToggleButton, ToggleButtonGroup, useTheme, useMediaQuery, Button } from '@mui/material';
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

// Example center coordinates
const center = {
  lat: 37.5665,
  lng: 126.9780
};

// Full marathon water point
const FULL_WATER_POINT = { lat: 36.97409898, lng: 126.99722975 };

// Custom Polyline component for the new library
const Polyline = ({ path, strokeColor, strokeWeight = 4 }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length === 0) return;

    const polyline = new window.google.maps.Polyline({
      path: path,
      strokeColor: strokeColor,
      strokeOpacity: 1,
      strokeWeight: strokeWeight,
      map: map
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight]);

  return null;
};

// Custom marker component using AdvancedMarkerElement or fallback to Marker
const CustomMarker = ({ position, icon, onClick, children }) => {
  const map = useMap();
  const [marker, setMarker] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    let newMarker;

    // Try to use AdvancedMarkerElement if available
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      // Create a custom pin element with color
      const pinElement = document.createElement('div');
      pinElement.style.width = '20px';
      pinElement.style.height = '20px';
      pinElement.style.borderRadius = '50%';
      pinElement.style.border = '2px solid white';
      pinElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      pinElement.style.cursor = 'pointer';
      
      // Set color based on icon URL
      if (icon?.url?.includes('blue')) {
        pinElement.style.backgroundColor = '#4285F4';
      } else if (icon?.url?.includes('green')) {
        pinElement.style.backgroundColor = '#34A853';
      } else if (icon?.url?.includes('yellow')) {
        pinElement.style.backgroundColor = '#FBBC04';
      } else {
        pinElement.style.backgroundColor = '#EA4335';
      }

      const { AdvancedMarkerElement } = window.google.maps.marker;
      
      newMarker = new AdvancedMarkerElement({
        position: position,
        map: map,
        content: pinElement
      });

      if (onClick) {
        pinElement.addEventListener('click', onClick);
      }

      markerRef.current = newMarker;
      setMarker(newMarker);

      return () => {
        if (onClick && pinElement) {
          pinElement.removeEventListener('click', onClick);
        }
        newMarker.map = null;
      };
    } else {
      // Fallback to old Marker API
      newMarker = new window.google.maps.Marker({
        position: position,
        map: map,
        icon: icon
      });

      if (onClick) {
        newMarker.addListener('click', onClick);
      }

      markerRef.current = newMarker;
      setMarker(newMarker);

      return () => {
        newMarker.setMap(null);
      };
    }
  }, [map, position, icon, onClick]);

  return children && marker ? children : null;
};

const MapContent = ({ 
  selectedDistance, 
  parsedHalfPath, 
  parsedFullPath, 
  halfwayPoint,
  openInfo,
  setOpenInfo,
  isMobile,
  onMapReady
}) => {
  const map = useMap();

  // Notify parent when map is ready
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Fit bounds when route changes
  useEffect(() => {
    if (!map) return;
    
    let pathToUse = null;
    if (selectedDistance === 'full' && parsedFullPath && parsedFullPath.length) {
      pathToUse = parsedFullPath;
    } else if (selectedDistance === 'half' && parsedHalfPath && parsedHalfPath.length) {
      pathToUse = parsedHalfPath;
    }
    
    if (pathToUse && pathToUse.length) {
      const bounds = new window.google.maps.LatLngBounds();
      pathToUse.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds);
    }
  }, [map, selectedDistance, parsedHalfPath, parsedFullPath]);

  // Determine which path to render
  const routePath = selectedDistance === 'full' ? parsedFullPath : parsedHalfPath;
  const routeColor = selectedDistance === 'full' ? '#3FAF5D' : '#1C4C89';

  if (!routePath || routePath.length === 0) return null;

  const start = routePath[0];
  const end = routePath[routePath.length - 1];
  const halfOrWater = selectedDistance === 'full' ? FULL_WATER_POINT : halfwayPoint;

  return (
    <>
      <Polyline path={routePath} strokeColor={routeColor} />
      
      <CustomMarker
        position={start}
        icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        onClick={() => setOpenInfo(prev => ({ ...prev, start: true }))}
      >
        {openInfo.start && (
          <InfoWindow
            position={start}
            onCloseClick={() => setOpenInfo(prev => ({ ...prev, start: false }))}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2">Start</Typography>
              <Typography variant="body2">Race Start Line</Typography>
            </Box>
          </InfoWindow>
        )}
      </CustomMarker>

      <CustomMarker
        position={end}
        icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
        onClick={() => setOpenInfo(prev => ({ ...prev, end: true }))}
      >
        {openInfo.end && (
          <InfoWindow
            position={end}
            onCloseClick={() => setOpenInfo(prev => ({ ...prev, end: false }))}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2">Finish</Typography>
              <Typography variant="body2">Finish Line</Typography>
            </Box>
          </InfoWindow>
        )}
      </CustomMarker>

      {selectedDistance === 'full' && halfOrWater && (
        <CustomMarker
          position={halfOrWater}
          icon={{ url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" }}
          onClick={() => setOpenInfo(prev => ({ ...prev, half: true }))}
        >
          {openInfo.half && (
            <InfoWindow
              position={halfOrWater}
              onCloseClick={() => setOpenInfo(prev => ({ ...prev, half: false }))}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2">Water Point</Typography>
                <Typography variant="body2">Marathon water point</Typography>
              </Box>
            </InfoWindow>
          )}
        </CustomMarker>
      )}
    </>
  );
};

const CoursePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDistance, setSelectedDistance] = useState('full');
  const [parsedHalfPath, setParsedHalfPath] = useState(null);
  const [parsedFullPath, setParsedFullPath] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [halfwayPoint, setHalfwayPoint] = useState(null);
  const [openInfo, setOpenInfo] = useState({ start: false, end: false, half: false });
  const mapWrapperRef = useRef(null);
  const [descWidth, setDescWidth] = useState(null);
  const containerStyle = getContainerStyle(isMobile);
  const mapInstanceRef = useRef(null);

  const stravaFullRoute = 'https://www.strava.com/routes/3409735240127946974';
  const stravaHalfRoute = 'https://www.strava.com/routes/3409735128908525794';

  // Handle map ready callback
  const handleMapReady = (mapInstance) => {
    mapInstanceRef.current = mapInstance;
  };

  // Center map on route
  const handleCenterMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let pathToUse = null;
    if (selectedDistance === 'full' && parsedFullPath && parsedFullPath.length) {
      pathToUse = parsedFullPath;
    } else if (selectedDistance === 'half' && parsedHalfPath && parsedHalfPath.length) {
      pathToUse = parsedHalfPath;
    }

    if (pathToUse && pathToUse.length) {
      const bounds = new window.google.maps.LatLngBounds();
      pathToUse.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds);
    }
  };

  // Open Strava route in new tab
  const handleOpenStrava = () => {
    const url = selectedDistance === 'full' ? stravaFullRoute : stravaHalfRoute;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDistanceChange = (event, newDistance) => {
    if (newDistance !== null && newDistance !== selectedDistance) {
      setSelectedDistance(newDistance);
      setOpenInfo({ start: false, end: false, half: false });
    }
  };

  // Parse GPX for half marathon
  useEffect(() => {
    if (selectedDistance !== 'half') {
      setParsedHalfPath(null);
      return;
    }
    
    let mounted = true;
    async function loadGpx() {
      try {
        const res = await fetch(halfGpx);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');

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
          const latAttr = pt.getAttribute('lat');
          const lonAttr = pt.getAttribute('lon') || pt.getAttribute('long') || pt.getAttribute('lng');
          return {
            lat: parseFloat(latAttr),
            lng: parseFloat(lonAttr),
          };
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
            continue;
          }
          cleaned.push(p);
        }

        if (mounted && points && points.length) {
          setParsedHalfPath(cleaned);
          
          try {
            const target = { lat: 36.97706996, lng: 126.98827 };
            let best = null;
            let bestD = Infinity;
            cleaned.forEach(p => {
              const d = haversine(p, target);
              if (d < bestD) { bestD = d; best = p; }
            });
            if (best) {
              setHalfwayPoint(best);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Failed to load GPX:', err);
      }
    }

    loadGpx();
    return () => { mounted = false; };
  }, [selectedDistance]);

  // Parse GPX for full marathon
  useEffect(() => {
    if (selectedDistance !== 'full') {
      setParsedFullPath(null);
      return;
    }
    
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
        }
      } catch (err) {
        console.warn('Failed to load full GPX:', err);
      }
    }

    loadFull();
    return () => { mounted = false; };
  }, [selectedDistance]);

  // Measure container width
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
          <Paper elevation={0} sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: '1px solid rgba(0,0,0,0.08)',
            minHeight: isMobile ? '300px' : '600px',
          }}>
            {googleApiKey ? (
              <APIProvider apiKey={googleApiKey} libraries={['marker']}>
                <Map
                  style={containerStyle}
                  defaultCenter={center}
                  defaultZoom={13}
                  mapTypeId={mapType}
                  mapId="DEMO_MAP_ID"
                  disableDefaultUI={false}
                  zoomControl={true}
                  mapTypeControl={false}
                  scaleControl={true}
                  streetViewControl={false}
                  rotateControl={false}
                  fullscreenControl={true}
                >
                  <MapContent
                    selectedDistance={selectedDistance}
                    parsedHalfPath={parsedHalfPath}
                    parsedFullPath={parsedFullPath}
                    halfwayPoint={halfwayPoint}
                    openInfo={openInfo}
                    setOpenInfo={setOpenInfo}
                    isMobile={isMobile}
                    onMapReady={handleMapReady}
                  />
                </Map>
              </APIProvider>
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

        {/* Map Control Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={handleCenterMap}
            sx={{ textTransform: 'none' }}
          >
            Center Map
          </Button>
          
          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={handleOpenStrava}
            sx={{ 
              textTransform: 'none',
              background: 'linear-gradient(90deg, #FC4C02 0%, #E34402 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #E34402 0%, #D13C02 100%)',
              }
            }}
          >
            View on Strava
          </Button>
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
                border: '1px solid rgba(0,0,0,0.06)',
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: descWidth ? `${descWidth}px` : { xs: '100%', md: '1100px' },
                mx: 'auto',
                boxShadow: '0 6px 18px rgba(20,20,20,0.08)'
              }}
            >
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
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'default', minWidth: 140 }}>
                  <Box sx={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: '#4285F4',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }} />
                  <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>Start: blue circle</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 200 }}>
                  <Box sx={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: '#FBBC04',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }} />
                  <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>
                    Water point: yellow circle (Full marathon only)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 180 }}>
                  <Box sx={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: '#34A853',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }} />
                  <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.86rem', sm: '0.95rem' } }}>Finish: green circle</Typography>
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
