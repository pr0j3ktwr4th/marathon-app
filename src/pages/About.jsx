import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Modal,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import fullMarathonMedal from '../assets/images/fullMarathonMedal.png';
import halfMarathonMedal from '../assets/images/halfmarathonmedal.png';

const RaceCard = ({ title, distance, price, medal, features, type, onMedalClick }) => {
  const navigate = useNavigate();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        width: '100%',
        height: '100%',
        minHeight: '600px',
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="img"
        src={medal}
        alt={`${title} Medal`}
        onClick={() => onMedalClick(medal, title)}
        sx={{
          width: '100%',
          maxWidth: 200,
          height: 'auto',
          mx: 'auto',
          mb: 3,
          cursor: 'pointer',
          transition: 'opacity 0.2s ease-in-out',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          mb: 1,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: 'center',
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {distance} • ${price}
      </Typography>

      <Box sx={{ mb: 4, flexGrow: 1 }}>
        {features.map((feature, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '"•"',
                color: '#3FAF5D',
                fontWeight: 'bold',
                marginRight: 1,
              },
            }}
          >
            {feature}
          </Typography>
        ))}
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/register', { state: { raceType: type } })}
        sx={{
          py: 2,
          width: '100%',
          background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
          color: '#fff',
          fontWeight: 700,
          '&:hover': {
            background: 'linear-gradient(90deg, #1C4C89 0%, #3FAF5D 100%)',
          },
        }}
      >
        REGISTER NOW
      </Button>
    </Paper>
  );
};

const MedalModal = ({ open, handleClose, medalImage, title }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="medal-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: 3,
          p: 3,
          outline: 'none'
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700
          }}
        >
          {title} Medal
        </Typography>
        <Box
          component="img"
          src={medalImage}
          alt={`${title} Medal`}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 'calc(90vh - 100px)',
            objectFit: 'contain'
          }}
        />
      </Box>
    </Modal>
  );
};

const About = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState({ image: '', title: '' });

  const handleMedalClick = (medal, title) => {
    setSelectedMedal({ image: medal, title });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, sm: 6 }, textAlign: 'center' }}>
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
              lineHeight: { xs: 1.2, sm: 1.167 },
            }}
          >
            CHOOSE YOUR CHALLENGE
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: { xs: 3, sm: 4 },
              maxWidth: 800,
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            Whether you're aiming for a full marathon achievement or taking on the half marathon challenge,
            we've got the perfect race for you.
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={4} 
          alignItems="stretch"
          sx={{ 
            mb: { xs: 4, sm: 6 },
            justifyContent: 'center',
            maxWidth: '1000px', // reduced from 1200px
            mx: 'auto'
          }}>
          <Grid 
            item 
            xs={12} 
            sm={6}  // changed from md={6} to sm={6}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              '& > *': {
                width: '100% !important',
                maxWidth: '460px !important'
              }
            }}>
            <RaceCard
              title="FULL MARATHON"
              distance="42.2 KM"
              price="55"
              medal={fullMarathonMedal}
              type="full"
              onMedalClick={handleMedalClick}
              features={[
                "Complete 42.2km course through scenic routes",
                "Premium finisher's medal",
                "Exclusive event t-shirt (design coming soon)",
                "Premium finisher's medal",
                "Digital race timing",
                "Post-race celebration",
                "Event photography"
              ]}
            />
          </Grid>
          <Grid 
            item 
            xs={12} 
            sm={6}  // changed from md={6} to sm={6}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              '& > *': {
                width: '100% !important',
                maxWidth: '460px !important'
              }
            }}>
            <RaceCard
              title="HALF MARATHON"
              distance="21.1 KM"
              price="50"
              medal={halfMarathonMedal}
              type="half"
              onMedalClick={handleMedalClick}
              features={[
                "21.1km course with great views (two loops)",
                "Exclusive finisher's medal",
                "Exclusive event t-shirt (design coming soon)",
                "Digital race timing",
                "Post-race celebration",
                "Event photography"
              ]}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid rgba(63,175,93,0.2)',
            background: 'rgba(63,175,93,0.05)',
            width: '100%',
            maxWidth: { xs: '100%', md: '960px' },
            mx: 'auto'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Important Information
          </Typography>
          <Box component="div" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            <Typography sx={{ mb: 1 }}>
              Race Day: <strong>November 9th, 2025 (Sunday)</strong>
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Registration Deadline: <strong>October 15th, 2025</strong>
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Start Times: <strong>Full Marathon — 7:30 AM</strong> | <strong>Half Marathon — 8:00 AM</strong>
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Location: <strong>Pyeongtaek, South Korea</strong> (exact start/finish coordinates to be announced)
            </Typography>
            
            <Typography sx={{ mb: 1, color: 'text.secondary', fontSize: '0.9rem' }}>
              Note: most participants are military and portions of the course run on base property.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Support: There is only one water station located at the Finish Line (green point). Runners should carry their own hydration and any personal first-aid supplies. Both the Full and Half Marathons will have their own separate routes.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Safety & responsibility: No course marshals, road guards, or official markings will be provided. Runners are responsible for their own safety, must obey traffic and local laws when crossing roads, and should plan accordingly.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Verification: No official course markings will be placed; participants must complete their designated distance and provide proof of completion. We highly recommend using Strava or another GPS app for verification.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Age: Participants must be 18 years or older. Minors are not permitted.
            </Typography>
            <Typography sx={{ mb: 0 }}>
              Elevation summary: Maximum elevation ~18 m, typical grade up to ~3%. Total ascent ~290 m, total descent ~290 m.
            </Typography>
          </Box>
        </Paper>
        </Box>
      </Container>

      <MedalModal
        open={modalOpen}
        handleClose={handleModalClose}
        medalImage={selectedMedal.image}
        title={selectedMedal.title}
      />
    </Box>
  );
};

export default About;
