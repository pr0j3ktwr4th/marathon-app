import React from 'react';
import { Box } from '@mui/material';
import sojuLogoYellow from './images/SojuLogo.png';

const SojuLogo = () => (
  <Box
    component="img"
    src={sojuLogoYellow}
    alt="Soju Logo"
    sx={{ 
      width: 'auto',
      height: { 
        xs: '60px',
        sm: '60px',
        md: '100px'
      },
      transition: 'height 0.2s ease',
    }}
  />
);

export default SojuLogo;
