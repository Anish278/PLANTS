import React from 'react';
import Navbar from '../../Component/Navbar/Navbar.jsx';
import Footer from '../../Component/Footer/Footer.jsx';
import CookieConsent from '../CookieConsent/CookieConsent.jsx';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-app-layout">
      <Navbar />
      <div className="layout-content-wrapper">
        <main className="main-content-area">
          {children}
        </main>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default MainLayout;
