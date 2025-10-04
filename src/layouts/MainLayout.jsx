


import React from 'react';
import MyAppBar from '../components/AppBar';
import { Outlet, useLocation } from 'react-router-dom';
import { AppBarHeightProvider, useAppBarHeight } from '../components/AppBarHeightContext';


const MainLayoutInner = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const appBarHeight = useAppBarHeight();
  return (
    <>
      {/* AppBar is rendered by AppBarHeightProvider with ref */}
      {isHome ? (
        <Outlet />
      ) : (
        <div style={{ paddingTop: appBarHeight }}>
          <Outlet />
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
