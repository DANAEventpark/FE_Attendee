import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';
import api from './services/api';
import useAuthStore from './store/authStore';

function App() {
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (token) {
      // Verify token on app load, interceptor handles 401 by clearing auth and redirecting
      api.get('/auth/me').catch(() => {});
    }
  }, [token]);
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="min-h-screen">
         <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
