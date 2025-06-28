import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './component/Navbar';
import Footer from "./component/Footer";

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import AboutUs from './pages/AboutUs';
import LogIn from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile'

function App() {
  const location = useLocation();

  const hideNavbar = (
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register')
  );
  const showfooter = (location.pathname == '/'||location.pathname=='/about');
  
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      {showfooter && <Footer />}
    </>
  );
}

export default App;
