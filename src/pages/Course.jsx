import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { Box, Container, Paper, Typography, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px'
};

// Example center coordinates (you can adjust these to your actual location)
const center = {
  lat: 37.5665,
  lng: 126.9780
};

// Example route coordinates for both full and half marathon
const fullMarathonPath = [
  // Example coordinates - replace with actual route coordinates
  { lat: 37.5665, lng: 126.9780 },
  { lat: 37.5700, lng: 126.9800 },
  { lat: 37.5750, lng: 126.9850 },
  // Add more coordinates to complete the full marathon route
];

const halfMarathonPath = [
  // Example coordinates - replace with actual route coordinates
  { lat: 37.5665, lng: 126.9780 },
  { lat: 37.5700, lng: 126.9800 },
  // Add more coordinates to complete the half marathon route
];

const CoursePage = () => {
  const theme = useTheme();
  const [selectedDistance, setSelectedDistance] = useState('full');
  const [map, setMap] = useState(null);

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

  const mapOptions = {
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#242f3e' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
    ],
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            COURSE MAP
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Explore the full and half marathon routes
          </Typography>

          <ToggleButtonGroup
            value={selectedDistance}
            exclusive
            onChange={handleDistanceChange}
            aria-label="course distance"
            sx={{ mb: 4 }}
          >
            <ToggleButton 
              value="full" 
              aria-label="full marathon"
              sx={{
                px: 4,
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
                px: 4,
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
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={mapOptions}
            >
              <Polyline
                path={selectedDistance === 'full' ? fullMarathonPath : halfMarathonPath}
                options={{
                  strokeColor: selectedDistance === 'full' ? '#3FAF5D' : '#1C4C89',
                  strokeOpacity: 1,
                  strokeWeight: 4,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </Paper>

        {/* Course Details Section */}
        <Box sx={{ mt: 6, display: 'grid', gap: 4, gridTemplateColumns: { md: '1fr 1fr' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.8)',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Course Highlights
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              • Start/Finish line location details
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              • Key landmarks along the route
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              • Elevation changes and terrain information
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.8)',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Support Stations
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              • Water stations every 5km
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              • Medical support points
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              • Energy drink stations
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default CoursePage;