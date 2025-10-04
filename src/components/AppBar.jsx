import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import SojuLogo from '../assets/SojuLogo';


const navLinks = [
	{ label: 'ABOUT', path: '/about' },
	{ label: 'COURSE', path: '/course' },
	{ label: 'RESULTS', path: '/results' },
];

const MyAppBar = React.forwardRef((props, ref) => {
	const navigate = useNavigate();
	const location = useLocation();
	// Find the current tab index based on the path
		const isHome = location.pathname === '/';

			return (
				<Box sx={{ flexGrow: 1 }} ref={ref}>
					<AppBar
						position={isHome ? "fixed" : "sticky"}
						elevation={0}
						sx={{
							background: isHome 
								? 'transparent' 
								: 'linear-gradient(90deg, rgba(63,175,93,0.95) 0%, rgba(28,76,137,0.95) 100%)',
							color: '#fff',
							boxShadow: 'none',
							width: '100vw',
							top: 0,
							left: 0,
							backdropFilter: isHome ? 'none' : 'blur(10px)',
							transition: 'all 0.3s ease',
						}}
					>
						<Toolbar sx={{ backgroundColor: 'transparent', color: 'inherit', px: { xs: 4, md: 12 }, py: 3 }}>
						{/* Logo and title */}
						<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
										<Box sx={{ mr: 0.5, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}> 
											<SojuLogo style={{ marginRight: 4 }} />
												<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
													<Typography 
														variant="h5" 
														sx={{ fontWeight: 900, letterSpacing: 3, fontSize: 32, lineHeight: 1, color: '#fff' }}>
														SOJU
													</Typography>
													<Typography 
														variant="subtitle1" 
														sx={{ fontWeight: 700, letterSpacing: 4, fontSize: 18, color: '#fff', opacity: 0.9 }}>
														RUN SERIES
													</Typography>
												</Box>
							</Box>
						</Box>
						{/* Centered nav links */}
						<Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'center', gap: 4 }}>
							{navLinks.map(link => (
								<Typography
									key={link.path}
									variant="button"
									sx={{
										color: '#fff',
										fontWeight: 700,
										letterSpacing: 2,
										mx: 2,
										cursor: 'pointer',
										fontSize: 16,
										opacity: location.pathname.startsWith(link.path) ? 1 : 0.8,
										borderBottom: location.pathname.startsWith(link.path) ? '2px solid #fff' : 'none',
										transition: 'opacity 0.2s',
										'&:hover': { opacity: 1 },
									}}
									onClick={() => navigate(link.path)}
								>
									{link.label}
								</Typography>
							))}
						</Box>
						{/* CTA Button */}
						<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="contained"
								onClick={() => navigate('/register')}
								sx={{
									background: 'linear-gradient(90deg, #2ecc71 0%, #159957 100%)',
									color: '#fff',
									borderRadius: 999,
									fontWeight: 700,
									px: 4,
									py: 1.2,
									fontSize: 18,
									boxShadow: 'none',
									textTransform: 'none',
									letterSpacing: 1,
									'&:hover': {
										background: 'linear-gradient(90deg, #159957 0%, #2ecc71 100%)',
										boxShadow: 'none',
									},
								}}
							>
								TAKE PART
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>

		);
	});

export default MyAppBar;
