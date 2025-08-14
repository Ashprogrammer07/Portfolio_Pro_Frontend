import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isTransitionPage = ['/', '/about', '/skills', '/projects', '/contact'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Show header only on non-transition pages or make it minimal */}
      {!isTransitionPage && <Header />}
      
      <main className={isTransitionPage ? 'min-h-screen' : ''}>
        {children}
      </main>
      
      {!isTransitionPage && <Footer />}
    </div>
  );
};

export default Layout;
