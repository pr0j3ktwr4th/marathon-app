
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Marathon App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Track your training, monitor your progress, and get ready for race day!
        </Typography>
        <Button variant="contained" color="primary" size="large" href="#">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

