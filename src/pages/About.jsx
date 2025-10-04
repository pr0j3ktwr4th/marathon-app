import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import fullMarathonMedal from '../assets/images/fullMarathonMedal.png';
import halfMarathonMedal from '../assets/images/halfmarathonmedal.png';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';

const AboutPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, rgba(46,204,113,0.95) 0%, rgba(21,153,87,0.95) 100%)',
        color: 'white',
        py: 12,
        mb: 8,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
        }
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900, 
              mb: 3,
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            SOJU MARATHON 2025
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 300, letterSpacing: '0.02em' }}>
            A community run, not a race. Join us November 9th, 2025.
          </Typography>
        </Container>
      </Box>

      {/* Event Details */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center'
              }}>
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                <Typography sx={{ fontWeight: 500 }}>
                  Full Marathon: 07:30 AM<br />
                  Half Marathon: 08:00 AM
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center'
              }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                <Typography sx={{ fontWeight: 500 }}>
                  Location: TBD
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center'
              }}>
                <Typography sx={{ fontWeight: 500, textAlign: 'center' }}>
                  Support stations at strategic points
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Registration Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2ecc71 0%, #159957 100%)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          CHOOSE YOUR CHALLENGE
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          <Grid item xs={12} sm={10} md={6} lg={5}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h3" sx={{ mb: 2, fontWeight: 700 }}>
                  Full Marathon
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                  42.2 km
                </Typography>
                <Box sx={{ mb: 4, p: 2 }}>
                  <Box
                    component="img"
                    src={fullMarathonMedal}
                    alt="Full Marathon Medal"
                    onClick={() => handleOpenModal(fullMarathonMedal)}
                    sx={{
                      width: 180,
                      height: 'auto',
                      margin: '0 auto',
                      display: 'block',
                      filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                      transition: 'transform 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>
                  $40
                </Typography>
                <Button 
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2ecc71 0%, #159957 100%)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #159957 0%, #2ecc71 100%)',
                    }
                  }}
                >
                  Register Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={10} md={6} lg={5}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h3" sx={{ mb: 2, fontWeight: 700 }}>
                  Half Marathon
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                  21.1 km
                </Typography>
                <Box sx={{ mb: 4, p: 2 }}>
                  <Box
                    component="img"
                    src={halfMarathonMedal}
                    alt="Half Marathon Medal"
                    onClick={() => handleOpenModal(halfMarathonMedal)}
                    sx={{
                      width: 180,
                      height: 'auto',
                      margin: '0 auto',
                      display: 'block',
                      filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                      transition: 'transform 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>
                  $25
                </Typography>
                <Button 
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2ecc71 0%, #159957 100%)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #159957 0%, #2ecc71 100%)',
                    }
                  }}
                >
                  Register Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Disclaimer */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 249, 196, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 238, 88, 0.2)'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
          }}>
            <WarningIcon sx={{ color: 'warning.main', fontSize: 28 }} />
            <Typography sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              This is not an official race. By registering, you acknowledge participation is at your own risk. 
              The organizers accept no responsibility for injuries, accidents, or death. Medical preparation is the
              responsibility of each runner.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Image Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="medal-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: -40,
              top: -40,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.4)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.6)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selectedImage}
            alt="Medal Large View"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: 24,
              p: 2,
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default AboutPage;