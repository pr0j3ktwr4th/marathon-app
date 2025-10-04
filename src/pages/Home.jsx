
import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import sojuHeroImage from '../assets/images/sojuHeroImage.png';

// Korea Standard Time (KST) is UTC+9
// Always count down to 2025-10-15 00:00:00 KST (which is 2025-10-14 15:00:00 UTC)
const targetDate = new Date(Date.UTC(2025, 9, 14, 15, 0, 0)); // Months are 0-indexed

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${sojuHeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 0,
      }}
    >
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <span style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: 2,
          color: '#fff',
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          display: 'block',
        }}>
          SOJU <span style={{ color: '#ffe066' }}>MARATHON</span>
        </span>
        <span style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: 10,
          color: '#fff',
          opacity: 0.95,
          display: 'block',
          marginTop: 12,
        }}>
          SOJU RUN SERIES
        </span>
      </Box>
      <Button 
        variant="contained" 
        color="secondary" 
        size="large" 
        href="/register"
        sx={{
          fontSize: 20,
          fontWeight: 700,
          px: 4,
          py: 1.2,
          borderRadius: 999,
          background: 'linear-gradient(90deg, #2ecc71 0%, #159957 100%)',
          textTransform: 'uppercase',
          letterSpacing: 2,
          boxShadow: 'none',
          minWidth: 180,
          '&:hover': {
            background: 'linear-gradient(90deg, #159957 0%, #2ecc71 100%)',
            boxShadow: 'none',
          },
        }}
      >
        REGISTER
      </Button>
      <Box sx={{ mt: 4, p: 2, background: 'rgba(0,0,0,0.5)', borderRadius: 2, color: '#fff', minWidth: 220, textAlign: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 600 }}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
        <div>until signup deadline!</div>
      </Box>
    </Box>
  );
};

export default Home;

