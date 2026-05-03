import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaLeaf, FaSeedling, FaArrowRight } from 'react-icons/fa';
import './Login.css';

const plantImages = [
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
];

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % plantImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.emailOrPhone || !formData.password) {
      setError('Saare fields bharo please!');
      return;
    }
    setIsLoading(true);
    try {
      await login({ email: formData.emailOrPhone, password: formData.password });
    } catch (error) {
      let msg = 'Login fail hua. Dobara try karo.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'Email ya password galat hai.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Valid email daalo.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Bahut zyada attempts. Thodi der baad try karo.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setError(error.message || 'Google login fail hua.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pv-login-root">
      {/* ── Left Panel ── */}
      <div className="pv-login-left">
        {/* Slider */}
        <div className="pv-slider">
          {plantImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="plant"
              className={`pv-slide${i === sliderIndex ? ' pv-slide-active' : ''}`}
            />
          ))}
          {/* Dark overlay */}
          <div className="pv-slide-overlay" />

          {/* Brand badge */}
          <div className="pv-brand">
            <div className="pv-brand-icon">
              <FaSeedling />
            </div>
            <div>
              <div className="pv-brand-name">PlantVigor</div>
              <div className="pv-brand-tagline">Nature's Best</div>
            </div>
          </div>

          {/* Center text */}
          <div className="pv-slide-text">
            <div className="pv-slide-pill"><FaLeaf size={10} /> 100% Natural Plants</div>
            <h2 className="pv-slide-heading">Bring Nature<br />Home Today</h2>
            <p className="pv-slide-subtext">Premium plants, delivered fresh to your doorstep across India.</p>
          </div>

          {/* Dots */}
          <div className="pv-dots">
            {plantImages.map((_, i) => (
              <button
                key={i}
                className={`pv-dot${i === sliderIndex ? ' pv-dot-active' : ''}`}
                onClick={() => setSliderIndex(i)}
              />
            ))}
          </div>

          {/* Floating stat cards */}
          <div className="pv-stat-card pv-stat-left">
            <div className="pv-stat-num">12K+</div>
            <div className="pv-stat-lbl">Happy Plant Parents</div>
          </div>
          <div className="pv-stat-card pv-stat-right">
            <div className="pv-stat-num">500+</div>
            <div className="pv-stat-lbl">Plant Varieties</div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="pv-login-right">
        <div className="pv-form-wrap">

          {/* Top logo (mobile) */}
          <div className="pv-mobile-logo">
            <div className="pv-brand-icon pv-brand-icon-sm"><FaSeedling /></div>
            <span className="pv-mobile-logo-text">PlantVigor</span>
          </div>

          {/* Heading */}
          <div className="pv-form-eyebrow"><FaLeaf size={11} /> Welcome Back</div>
          <h1 className="pv-form-title">Login to Your<br /><span className="pv-title-accent">Garden</span></h1>
          <p className="pv-form-sub">
            New here? <Link to="/signup" className="pv-signup-link">Create an account →</Link>
          </p>

          {/* Error */}
          {error && (
            <div className="pv-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="pv-form">
            {/* Email */}
            <div className="pv-field-group">
              <label className="pv-label">Email Address</label>
              <div className="pv-input-wrap">
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pv-input"
                  required
                  id="pv-email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="pv-field-group">
              <div className="pv-label-row">
                <label className="pv-label">Password</label>
                <Link to="/forgot-password" className="pv-forgot">Forgot password?</Link>
              </div>
              <div className="pv-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pv-input"
                  required
                  id="pv-password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pv-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="pv-check">
              <input type="checkbox" required className="pv-checkbox" id="pv-terms" />
              <span>I agree to the <Link to="/terms" className="pv-link">Terms &amp; Conditions</Link></span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="pv-btn-primary"
              disabled={isLoading}
              id="pv-login-btn"
            >
              {isLoading ? (
                <span className="pv-spinner" />
              ) : (
                <>Login <FaArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="pv-divider"><span>or continue with</span></div>

          {/* Google */}
          <button
            type="button"
            className="pv-btn-google"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            id="pv-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          {/* Bottom trust badges */}
          <div className="pv-trust">
            <span>🔒 Secure Login</span>
            <span>🌱 Plant Community</span>
            <span>🚀 Free Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
