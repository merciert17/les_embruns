import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AccessGate from "./components/AccessGate";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import AboutCarousel from "./components/AboutCarousel";
import MenuSection from "./components/MenuSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { PageLoader } from "./components/LoadingSpinner";
import { restaurantApi } from "./services/api";

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState({ is_locked: true });
  const [adminSession, setAdminSession] = useState(null);

  useEffect(() => {
    checkInitialAccess();
  }, []);

  const checkInitialAccess = async () => {
    try {
      // Récupérer les paramètres du site
      const settingsResponse = await restaurantApi.getSiteSettings();
      setSiteSettings(settingsResponse);

      // Si le site n'est pas verrouillé, accès direct
      if (!settingsResponse.is_locked) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Sinon vérifier la session existante
      const sessionId = localStorage.getItem('restaurant_session');
      if (sessionId) {
        const response = await restaurantApi.checkSession(sessionId);
        if (response.hasAccess) {
          setHasAccess(true);
        } else {
          localStorage.removeItem('restaurant_session');
        }
      }
    } catch (error) {
      console.error('Error checking initial access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleAdminLogin = (sessionId) => {
    setAdminSession(sessionId);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    localStorage.removeItem('admin_session');
  };

  // Main Site Component
  const MainSite = () => (
    <div className="App page-enter page-enter-active">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <AboutCarousel/>
        <MenuSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );

  // Admin Panel Component
  const AdminPanel = () => {
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
      const checkAdminSession = async () => {
        const storedSession = localStorage.getItem('admin_session');
        if (storedSession) {
          try {
            const response = await restaurantApi.checkAdminSession(storedSession);
            if (response.hasAccess) {
              setAdminSession(storedSession);
            } else {
              localStorage.removeItem('admin_session');
            }
          } catch (error) {
            localStorage.removeItem('admin_session');
          }
        }
        setAdminLoading(false);
      };

      checkAdminSession();
    }, []);

    if (adminLoading) {
      return <PageLoader />;
    }

    if (adminSession) {
      return <AdminDashboard sessionId={adminSession} onLogout={handleAdminLogout} />;
    }

    return <AdminLogin onLoginSuccess={handleAdminLogin} />;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Route principale */}
        <Route 
          path="/" 
          element={
            (!siteSettings.is_locked || hasAccess) ? (
              <MainSite />
            ) : (
              <AccessGate onAccessGranted={handleAccessGranted} />
            )
          } 
        />
        
        {/* Route admin */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;