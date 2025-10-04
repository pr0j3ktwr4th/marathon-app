import React, { createContext, useContext, useRef, useLayoutEffect, useState } from 'react';

const AppBarHeightContext = createContext(64); // default fallback

export const useAppBarHeight = () => useContext(AppBarHeightContext);

export const AppBarHeightProvider = ({ children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(64);

  useLayoutEffect(() => {
    function updateHeight() {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <AppBarHeightContext.Provider value={height}>
      {children(ref)}
    </AppBarHeightContext.Provider>
  );
};
