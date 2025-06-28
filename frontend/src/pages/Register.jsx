import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import ClipLoader from "react-spinners/ClipLoader";

import backGround from "../assets/loginback.jpg";
import logo from "../assets/logo.png";
import googlelogo from '../assets/google logo.svg';
import '../style/Register.css';

const Register = () => {
  const {login}=useAuth();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    MobileNo: '',
    otp: ''
  });

  const [errors, setErrors] = useState({});

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();



      const res = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: idToken,
          email: user.email,
          username: user.displayName  
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to login.');

      login(data.user)
      navigate("/");
    } catch (error) {
      console.error('Google login error:', error);
      alert('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = ['MobileNo', 'otp'].includes(name) ? value.replace(/\D/g, '') : value;
    setUserData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  const validateInputs = () => {
    const { username, email, MobileNo } = userData;
    const newErrors = {};
    if (!/^[A-Za-z]{4,16}$/.test(username)) newErrors.username = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;
    if (!/^[6-9]\d{9}$/.test(MobileNo)) newErrors.MobileNo = true;
    return newErrors;
  };

  const handleSendOtp = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

      setIsOTPSent(true);
      setTimer(30);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsOTPSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (userData.otp.length !== 6) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, otp: userData.otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      await registerUser();
    } catch (err) {
      alert(err.message);
    }
  };

  const registerUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      login(data.user)
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="imageContainer">
        <img className="welcome-img" src={backGround} alt="Welcome" />
      </div>

      <div className="infoContainer">
        <div className="logoContainer">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="inputcontainer">
          <p className="headingText">Register your account</p>

          <button id="googleLog" onClick={loginWithGoogle}>
            <img className="googleLogo" src={googlelogo} alt="Google" />
            Sign Up with Google
          </button>

          {loading && (
             <div className="fullpage-loader-overlay">
      <ClipLoader color="#36D7B7" size={80} />
    </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="loginForm">
            <label htmlFor="username">Username</label>
            <input
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className={errors.username ? 'input-error' : ''}
            />

            <label htmlFor="email">Email</label>
            <div className="email-input-group">
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={errors.email ? 'input-error' : ''}
              />
              <button type="button" onClick={handleSendOtp} disabled={isOTPSent}>
                {isOTPSent ? `Resend OTP in ${timer}s` : 'Send OTP'}
              </button>
            </div>

            <label htmlFor="MobileNo">Mobile No.</label>
            <input
              name="MobileNo"
              value={userData.MobileNo}
              onChange={handleChange}
              placeholder="Eg. 9876543210"
              maxLength={10}
              required
              className={errors.mobileNo ? 'input-error' : ''}
            />

            <label htmlFor="otp">OTP</label>
            <input
              name="otp"
              value={userData.otp}
              onChange={handleChange}
              placeholder="Enter 6 Digit OTP"
              maxLength={6}
              required
              className={errors.otp ? 'input-error' : ''}
            />

            <button type="button" onClick={handleVerifyOtp} disabled={userData.otp.length !== 6}>
              {loading ? 'Verifying...' : 'Register'}
            </button>
          </form>

          <div className="LogIn">
            <p>
              Already have an account?{' '}
              <NavLink to="/login" id="loginBtn">Login</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
