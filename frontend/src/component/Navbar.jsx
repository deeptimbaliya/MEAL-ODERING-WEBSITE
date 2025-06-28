import React, { useState, useEffect } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import { TfiMenuAlt } from "react-icons/tfi";
import { MdOutlineClose } from "react-icons/md"
import { IoIosCart } from "react-icons/io";

import '../style/Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false)

  const handlelogOut = () => {
    logout()
    navigate('/')
  }
  const toggleSidebar = () => {
    console.log(isOpen)
    setisOpen(!isOpen)
  }
  return (<>
    <div className="mnavbar">
      <nav>
        <button onClick={toggleSidebar} className='menubtn '><TfiMenuAlt /></button>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="sidebar-top">
            <button onClick={toggleSidebar} className="close"><MdOutlineClose className="close" /></button>
            {isLoggedIn && <button
              className='nav-button'
              onClick={handlelogOut}
            >Logout</button>}
          </div>
          <div className="menu-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>Home</NavLink>
            <NavLink to="/menu" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>Menu</NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>Cart</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>About Us</NavLink>
          </div>
        </div>
        <NavLink to="/">
          <img src={logo} alt="Logo" className='nav-logo' />
        </NavLink>
        {isLoggedIn ? (
          <>
            <div className='flex'>
              <NavLink to='cart'  className='cartbtn'><IoIosCart /></NavLink>
              <NavLink to="/profile"><FaRegUserCircle className='profile-button' /></NavLink>
            </div>
          </>
        ) : (
          <>
            <div>
              <NavLink to="/login" className='nav-button'>Login</NavLink>
              <NavLink to="/register" className='nav-button'>Register</NavLink>
            </div>

          </>
        )}

      </nav>
    </div>
    <nav className='navbar'>
      <div className='nav-right'>
        <NavLink to="/">
          <img src={logo} alt="Logo" className='nav-logo' />
        </NavLink>
      </div>

      <div className='nav-center'>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Menu</NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Cart</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink>
      </div>

      {isLoggedIn ? (
        <>
          <button
            className='nav-button'
            onClick={handlelogOut}
          >Logout</button>
          <NavLink to="/profile"><FaRegUserCircle className='profile-button' /></NavLink>
        </>
      ) : (
        <>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Menu</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Cart</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink>
          <NavLink to="/register" className='nav-button'>Register</NavLink>
        </>
      )}
    </nav>
  </>
  );
}

export default Navbar;
