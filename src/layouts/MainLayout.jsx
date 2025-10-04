


import React from 'react';
import MyAppBar from '../components/AppBar';
import { Outlet, useLocation } from 'react-router-dom';
import { AppBarHeightProvider } from '../components/AppBarHeightContext';


const MainLayoutInner = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  // const appBarHeight = useAppBarHeight();
  return (
    <>
      {/* AppBar is rendered by AppBarHeightProvider with ref */}
      {isHome ? (
        <div style={{ position: 'relative' }}>
          <Outlet />
        </div>
      ) : (
        <div style={{ 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          boxSizing: 'border-box'
        }}>
          <div style={{ padding: '20px' }}>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

const MainLayout = () => (
  <AppBarHeightProvider>
    {ref => (
      <>
        <MyAppBar ref={ref} />
        <MainLayoutInner />
      </>
    )}
  </AppBarHeightProvider>
);

export default MainLayout;
