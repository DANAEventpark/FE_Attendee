import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';

function App() {
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
