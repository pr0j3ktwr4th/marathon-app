import React from 'react';

import sojuLogoYellow from './images/SojuLogo.png';

const SojuLogo = ({ style }) => (
  <img
    src={sojuLogoYellow}
    alt="Soju Logo"
  style={{ width: 72, height: 96, objectFit: 'contain', ...style }}
  />
);

export default SojuLogo;
