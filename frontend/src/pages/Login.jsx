import React, { useState } from 'react';
import { useAuth } from "../context/authContext";
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate, NavLink } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

import logo from '../assets/logo.png';
import loginImage from '../assets/loginback.jpg';
import googleLogo from '../assets/google logo.svg';
import '../style/Login.css';

const Login = () => {
  const {login}=useAuth()
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: '',
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
          name: user.displayName,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      console.log(data);
      login(data.user)

      navigate('/');
    } catch (error) {
      console.log(error)
      console.error('Google login error:', error);
      alert('Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === 'otp' ? value.replace(/\D/g, '') : value;
    setUserData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setErrors({ email: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP sending failed.');

      setOtpSent(true);
      setTimer(30);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setOtpSent(false);
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
      const res = await fetch('http://localhost:5000/api/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed.');
      console.log(data)

      login(data.user)

      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer text-black">
      <div className="imageContainer">
        <img className="welcome-img" src={loginImage} alt="Login" />
      </div>

      <div className="infoContainer">
        <div className="logoContainer">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="inputcontainer">
          <p className="headingText">Login to your account</p>

          <button id="googleLog" onClick={loginWithGoogle}>
            <img className="googleLogo" src={googleLogo} alt="Google" />
            Login with Google
          </button>

          {loading && (
            <div className="fullpage-loader-overlay">
              <ClipLoader color="#36D7B7" size={80} />
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="loginForm">
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
              <button type="button" onClick={handleSendOtp} disabled={otpSent}>
                {otpSent ? `Resend OTP in ${timer}s` : 'Send OTP'}
              </button>
            </div>

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
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>

          <div className="LogIn">
            <p>
              Don't have an account?{' '}
              <NavLink to="/register" id="loginBtn">Register</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
