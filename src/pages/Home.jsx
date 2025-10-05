
import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import sojuHeroImage from '../assets/images/sojuHeroImage.png';

// Korea Standard Time (KST) is UTC+9
// Always count down to 2025-10-15 00:00:00 KST (which is 2025-10-14 15:00:00 UTC)
// October 15th, 2025 (Registration Deadline)
const targetDate = new Date(Date.UTC(2025, 9, 14, 15, 0, 0)); // Months are 0-indexed

const TimeBlock = ({ value, label }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mx: { xs: 1, sm: 2 },
    }}
  >
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        p: { xs: 1, sm: 2 },
        minWidth: { xs: '60px', sm: '80px' },
        textAlign: 'center',
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2.5rem' },
          fontWeight: 900,
          color: '#3FAF5D',
          display: 'block',
        }}
      >
        {value}
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          color: '#1C4C89',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Box>
    </Box>
  </Box>
);

const Home = () => {
  const navigate = useNavigate();
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
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7,
          },
        }}
      >
        <img src={sojuHeroImage} alt="Soju Run background" />
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        {/* Stylized Page title (SOJU / MARATHON / SOJU RUN SERIES) */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ lineHeight: 1, mb: 1 }}>
            <Box component="div" sx={{ color: '#FFD700', fontWeight: 900, fontSize: 'clamp(2.5rem, 10vw, 6.75rem)', letterSpacing: '0.06em' }}>SOJU</Box>
            <Box component="div" sx={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(2.75rem, 12vw, 7rem)', letterSpacing: '0.02em', mt: { xs: 0.5, sm: 0 } }}>MARATHON</Box>
            <Box component="div" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: 'clamp(0.8rem, 2.2vw, 1rem)', mt: { xs: 0.5, sm: 0.5 }, letterSpacing: '0.18em' }}>SOJU RUN SERIES</Box>
          </Box>
        </Box>
        {/* Countdown Timer */}
        <Box 
          sx={{ 
            mb: { xs: 4, sm: 6 },
            mx: 'auto',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: { xs: 3, sm: 4 },
              flexWrap: 'nowrap',
            }}
          >
            <TimeBlock value={timeLeft.days} label="days" />
            <TimeBlock value={timeLeft.hours} label="hours" />
            <TimeBlock value={timeLeft.minutes} label="minutes" />
            <TimeBlock value={timeLeft.seconds} label="seconds" />
          </Box>

          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                color: '#fff',
                px: { xs: 4, sm: 6 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 700,
                borderRadius: '999px',
                width: { xs: '90%', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(90deg, #3FAF5D 20%, #1C4C89 120%)',
                },
              }}
            >
              REGISTER NOW
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

