import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import cashAppQR from '../assets/images/cashApp.jpeg';
import venmoQR from '../assets/images/Venmo.jpeg';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if no state (direct URL access)
  if (!location.state?.email || !location.state?.raceType) {
    return <Navigate to="/register" replace />;
  }

  const { email, raceType } = location.state;
  const fee = raceType === 'Full Marathon' ? '$55' : '$50';

  return (
    <Box sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 0 }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            borderRadius: { xs: 2, sm: 3 },
            border: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: { xs: 60, sm: 80 }, 
              color: '#3FAF5D',
              mb: { xs: 2, sm: 3 }
            }} 
          />
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '2rem', sm: '3.75rem' },
              lineHeight: { xs: 1.2, sm: 1.167 },
              background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Registration Complete!
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'error.main',
              fontWeight: 500,
              mb: 2
            }}
          >
            Please note: No refunds will be processed for this race under any circumstances.
          </Typography>

          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Complete Your Registration by October 15th, 2025
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Race Day: November 9th, 2025
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Amount: {fee}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Scan either QR code below to pay via CashApp or Venmo
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 4 }} justifyContent="center">
              <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#00D632' }}>
                  CashApp
                </Typography>
                <Box
                  component="img"
                  src={cashAppQR}
                  alt="CashApp QR Code"
                  sx={{
                    width: '100%',
                    maxWidth: {
                      xs: '200px',  // for extra-small screens
                      sm: '220px',  // for small screens
                      md: '250px'   // for medium and up screens
                    },
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" component="a" href="https://cash.app/$Terry1748" target="_blank" rel="noopener noreferrer">Pay with Cash App ($Terry1748)</Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#008CFF' }}>
                  Venmo
                </Typography>
                <Box
                  component="img"
                  src={venmoQR}
                  alt="Venmo QR Code"
                  sx={{
                    width: '100%',
                    maxWidth: {
                      xs: '200px',  // for extra-small screens
                      sm: '220px',  // for small screens
                      md: '250px'   // for medium and up screens
                    },
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" component="a" href="https://venmo.com/Terry-Phillips-43" target="_blank" rel="noopener noreferrer">Pay with Venmo (Terry-Phillips-43)</Button>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                When paying, please include the registrant email <Box component="code" sx={{ mx: 1 }}>{email}</Box> in the payment note so we can match your payment to the registration.
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              After payment, you will receive a confirmation email with your runner number and additional details.
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Thank you for starting your registration for the Soju Marathon 2025. We've sent an initial 
            email with payment instructions to complete your registration.
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Next Steps:
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 2, sm: 3 }, 
              mb: { xs: 3, sm: 4 },
              px: { xs: 1, sm: 0 }
            }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  1. Initial Email (Just Sent)
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Payment instructions with QR codes for CashApp/Venmo
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Your registration details
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Amount due: {fee}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  2. Confirmation Email (After Payment)
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Your unique runner number
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Event day schedule
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Course map and details
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  • Important safety information
                </Typography>
              </Box>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: 'rgba(63,175,93,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(63,175,93,0.2)',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Please check {email} for the payment instructions. Your registration will be confirmed once payment is received.
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1.5, sm: 2 }, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            '& .MuiButton-root': {
              width: { xs: '100%', sm: 'auto' }
            }
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/course')}
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1C4C89 0%, #3FAF5D 100%)',
                },
              }}
            >
              View Course Map
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                px: 4,
                borderColor: '#3FAF5D',
                color: '#3FAF5D',
                '&:hover': {
                  borderColor: '#1C4C89',
                  color: '#1C4C89',
                },
              }}
            >
              Return Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationSuccess;