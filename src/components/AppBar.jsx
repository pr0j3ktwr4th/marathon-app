import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import SojuLogo from '../assets/SojuLogo';


const navLinks = [
	{ label: 'ABOUT', path: '/about' },
	{ label: 'COURSE', path: '/course' },
	{ label: 'RESULTS', path: '/results' },
];

const MyAppBar = React.forwardRef((props, ref) => {
	const navigate = useNavigate();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
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
						<Toolbar sx={{ backgroundColor: 'transparent', color: 'inherit', px: { xs: 2, sm: 4, md: 12 }, py: { xs: 2, sm: 3 } }}>
						{/* Logo and title */}
						<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
							<Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center',  }} onClick={() => navigate('/')}> 
								<SojuLogo />
								<Box sx={{ display: 'block' }}>
									<Typography 
										variant="h5" 
										sx={{ 
											fontWeight: 900, 
											letterSpacing: { xs: 1.5, sm: 2, md: 3 }, 
											fontSize: { xs: 20, sm: 24, md: 32 }, 
											lineHeight: 1, 
											color: '#fff' 
										}}>
										SOJU
									</Typography>
									<Typography 
										variant="subtitle1" 
										sx={{ 
											display: { xs: 'block', sm: 'block' },
											fontWeight: 700, 
											letterSpacing: { xs: 2, sm: 3, md: 4 }, 
											fontSize: { xs: 12, sm: 14, md: 18 }, 
											color: '#fff', 
											opacity: 0.9,
											whiteSpace: 'nowrap'  // Add this line to prevent wrapping
										}}>
										RUN SERIES
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Desktop nav links */}
						<Box sx={{ flexGrow: 2, display: { xs: 'none', sm: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
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
										whiteSpace: 'nowrap',  // Prevent text wrapping
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

						{/* Mobile menu button */}
						<IconButton
							sx={{ 
								display: { xs: 'flex', md: 'none' },
								ml: 2,
								color: '#fff'
							}}
							onClick={handleDrawerToggle}
							aria-label="open drawer"
						>
							<MenuIcon />
						</IconButton>

						{/* Mobile Drawer */}
						<Drawer
							variant="temporary"
							anchor="right"
							open={mobileOpen}
							onClose={handleDrawerToggle}
							ModalProps={{
								keepMounted: true, // Better mobile performance
							}}
							sx={{
								display: { xs: 'block', md: 'none' },
								'& .MuiDrawer-paper': {
									boxSizing: 'border-box',
									width: 240,
									background: 'linear-gradient(180deg, rgba(63,175,93,0.98) 0%, rgba(28,76,137,0.98) 100%)',
									backdropFilter: 'blur(10px)',
								},
							}}
						>
							<Box sx={{ pt: 6, pb: 2, px: 2 }}>
								<List>
									{navLinks.map((link) => (
										<ListItemButton
											key={link.path}
											onClick={() => {
												navigate(link.path);
												handleDrawerToggle();
											}}
											sx={{
												mb: 1,
												borderRadius: 1,
												backgroundColor: location.pathname.startsWith(link.path) 
													? 'rgba(255,255,255,0.1)' 
													: 'transparent',
												'&:hover': {
													backgroundColor: 'rgba(255,255,255,0.1)',
												},
											}}
										>
											<ListItemText 
												primary={link.label} 
												sx={{
													color: '#fff',
													'& .MuiListItemText-primary': {
														fontWeight: 700,
														letterSpacing: 1,
													},
												}}
											/>
										</ListItemButton>
									))}
									<ListItemButton
										onClick={() => {
											navigate('/register');
											handleDrawerToggle();
										}}
										sx={{
											mt: 2,
											borderRadius: 1,
											background: 'linear-gradient(90deg, #2ecc71 0%, #159957 100%)',
											'&:hover': {
												background: 'linear-gradient(90deg, #159957 0%, #2ecc71 100%)',
											},
										}}
									>
										<ListItemText
											primary="REGISTER"
											sx={{
												color: '#fff',
												'& .MuiListItemText-primary': {
													fontWeight: 700,
													letterSpacing: 1,
												},
											}}
										/>
									</ListItemButton>
								</List>
							</Box>
						</Drawer>

						{/* Desktop CTA Button */}
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
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
									fontSize: 16,
									whiteSpace: 'nowrap',  // Prevent text wrapping
									boxShadow: 'none',
									textTransform: 'none',
									letterSpacing: 1,
									'&:hover': {
										background: 'linear-gradient(90deg, #159957 0%, #2ecc71 100%)',
										boxShadow: 'none',
									},
								}}
							>
								REGISTER
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>

		);
	});

export default MyAppBar;
