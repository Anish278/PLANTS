import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLeaf, FaSeedling, FaArrowRight, FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const plantImages = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80',
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '',
    gender: '', dateOfBirth: '', contactNumber: '', terms: false
  });
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showPwd, setShowPwd] = useState({ password: false, confirmPassword: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Auto-play slider
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % plantImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }));
    if (errors.dateOfBirth) setErrors(prev => { const n = { ...prev }; delete n.dateOfBirth; return n; });
  };

  const validateForm = () => {
    const e = {};
    if (!formData.firstName) e.firstName = 'First name required';
    if (!formData.lastName) e.lastName = 'Last name required';
    if (!formData.gender) e.gender = 'Gender select karo';
    if (!formData.dateOfBirth) {
      e.dateOfBirth = 'Date of birth required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 13) e.dateOfBirth = 'Minimum age 13 years hai';
    }
    if (!formData.contactNumber || !/^[0-9]{10}$/.test(formData.contactNumber)) {
      e.contactNumber = 'Valid 10-digit number daalo';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email daalo';
    if (!formData.password || formData.password.length < 6) e.password = 'Min 6 characters chahiye';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords match nahi kar rahe';
    if (!formData.terms) e.terms = 'Terms accept karo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await signup({
        firstName: formData.firstName, lastName: formData.lastName,
        email: formData.email, password: formData.password,
        gender: formData.gender, dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber
      });
      navigate('/login');
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = 'Ye email pehle se registered hai. Login karo ya dusra email use karo.';
      else if (error.code === 'auth/weak-password') msg = 'Password aur strong banao (min 6 chars).';
      else if (error.code === 'auth/invalid-email') msg = 'Valid email address daalo.';
      setErrors({ submit: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="pv-login-root" style={{ justifyContent: 'center', fontSize: '1rem', color: '#143324' }}>Loading...</div>;

  return (
    <div className="pv-login-root">
      {/* ── Left Panel ── */}
      <div className="pv-login-left">
        <div className="pv-slider">
          {plantImages.map((img, i) => (
            <img key={i} src={img} alt="plant"
              className={`pv-slide${i === sliderIndex ? ' pv-slide-active' : ''}`} />
          ))}
          <div className="pv-slide-overlay" />

          {/* Brand */}
          <div className="pv-brand">
            <div className="pv-brand-icon"><FaSeedling /></div>
            <div>
              <div className="pv-brand-name">PlantVigor</div>
              <div className="pv-brand-tagline">Nature's Best</div>
            </div>
          </div>

          {/* Center text */}
          <div className="pv-slide-text">
            <div className="pv-slide-pill"><FaLeaf size={10} /> Join 12K+ Plant Lovers</div>
            <h2 className="pv-slide-heading">Start Your<br />Green Journey</h2>
            <p className="pv-slide-subtext">Get access to 500+ plant varieties and expert care tips delivered to you.</p>
          </div>

          {/* Dots */}
          <div className="pv-dots">
            {plantImages.map((_, i) => (
              <button key={i} className={`pv-dot${i === sliderIndex ? ' pv-dot-active' : ''}`}
                onClick={() => setSliderIndex(i)} />
            ))}
          </div>

          {/* Stat cards */}
          <div className="pv-stat-card pv-stat-left">
            <div className="pv-stat-num">Free</div>
            <div className="pv-stat-lbl">Delivery Above ₹549</div>
          </div>
          <div className="pv-stat-card pv-stat-right">
            <div className="pv-stat-num">4.9★</div>
            <div className="pv-stat-lbl">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="pv-login-right" style={{ alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '2rem', overflowY: 'auto' }}>
        <div className="pv-form-wrap">

          {/* Mobile logo */}
          <div className="pv-mobile-logo">
            <div className="pv-brand-icon pv-brand-icon-sm"><FaSeedling /></div>
            <span className="pv-mobile-logo-text">PlantVigor</span>
          </div>

          <div className="pv-form-eyebrow"><FaLeaf size={11} /> New Member</div>
          <h1 className="pv-form-title">Create Your<br /><span className="pv-title-accent">Account</span></h1>
          <p className="pv-form-sub">
            Already a member? <Link to="/login" className="pv-signup-link">Login →</Link>
          </p>

          {/* Global error */}
          {errors.submit && (
            <div className="pv-error"><span>⚠</span> {errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className="pv-form" noValidate>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="pv-field-group">
                <label className="pv-label"><FaUser size={9} /> First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder="Anish" className={`pv-input${errors.firstName ? ' pv-input-err' : ''}`} />
                {errors.firstName && <span className="pv-field-err">{errors.firstName}</span>}
              </div>
              <div className="pv-field-group">
                <label className="pv-label">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder="Sharma" className={`pv-input${errors.lastName ? ' pv-input-err' : ''}`} />
                {errors.lastName && <span className="pv-field-err">{errors.lastName}</span>}
              </div>
            </div>

            {/* Gender + DOB */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="pv-field-group">
                <label className="pv-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className={`pv-input${errors.gender ? ' pv-input-err' : ''}`}
                  style={{ cursor: 'pointer' }}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="pv-field-err">{errors.gender}</span>}
              </div>
              <div className="pv-field-group">
                <label className="pv-label">Date of Birth</label>
                <ReactDatePicker
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={handleDateChange}
                  placeholderText="DD-MM-YYYY"
                  dateFormat="dd-MM-yyyy"
                  className={`pv-input${errors.dateOfBirth ? ' pv-input-err' : ''}`}
                  showMonthDropdown showYearDropdown dropdownMode="select"
                  minDate={new Date(1950, 0, 1)}
                  maxDate={new Date(new Date().getFullYear() - 13, 11, 31)}
                  yearDropdownItemNumber={60}
                  onFocus={e => e.target.readOnly = true}
                  onBlur={e => e.target.readOnly = false}
                  autoComplete="off"
                  wrapperClassName="pv-datepicker-wrap"
                />
                {errors.dateOfBirth && <span className="pv-field-err">{errors.dateOfBirth}</span>}
              </div>
            </div>

            {/* Phone */}
            <div className="pv-field-group">
              <label className="pv-label"><FaPhone size={9} /> Phone Number</label>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                placeholder="10-digit mobile number" type="tel"
                className={`pv-input${errors.contactNumber ? ' pv-input-err' : ''}`} />
              {errors.contactNumber && <span className="pv-field-err">{errors.contactNumber}</span>}
            </div>

            {/* Email */}
            <div className="pv-field-group">
              <label className="pv-label"><FaEnvelope size={9} /> Email Address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className={`pv-input${errors.email ? ' pv-input-err' : ''}`} />
              {errors.email && <span className="pv-field-err">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="pv-field-group">
              <label className="pv-label"><FaLock size={9} /> Password</label>
              <div className="pv-input-wrap">
                <input name="password" type={showPwd.password ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`pv-input${errors.password ? ' pv-input-err' : ''}`} />
                <button type="button" className="pv-eye"
                  onClick={() => setShowPwd(p => ({ ...p, password: !p.password }))}>
                  {showPwd.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="pv-field-err">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="pv-field-group">
              <label className="pv-label"><FaLock size={9} /> Confirm Password</label>
              <div className="pv-input-wrap">
                <input name="confirmPassword" type={showPwd.confirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`pv-input${errors.confirmPassword ? ' pv-input-err' : ''}`} />
                <button type="button" className="pv-eye"
                  onClick={() => setShowPwd(p => ({ ...p, confirmPassword: !p.confirmPassword }))}>
                  {showPwd.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="pv-field-err">{errors.confirmPassword}</span>}
            </div>

            {/* Terms */}
            <label className="pv-check">
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange}
                className="pv-checkbox" id="su-terms" />
              <span>I agree to the <Link to="/terms" className="pv-link">Terms &amp; Conditions</Link></span>
            </label>
            {errors.terms && <span className="pv-field-err">{errors.terms}</span>}

            {/* Submit */}
            <button type="submit" className="pv-btn-primary" disabled={isLoading} id="pv-signup-btn">
              {isLoading ? <span className="pv-spinner" /> : <>Create Account <FaArrowRight size={14} /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="pv-divider"><span>or register with</span></div>

          {/* Google */}
          <button type="button" className="pv-btn-google" onClick={handleGoogleSignup}
            disabled={isLoading} id="pv-google-signup-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          {/* Trust */}
          <div className="pv-trust">
            <span>🔒 Secure Signup</span>
            <span>🌱 Free Account</span>
            <span>🚀 Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;