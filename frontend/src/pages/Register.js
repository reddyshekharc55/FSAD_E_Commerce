import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  const validate = () => {
    const errors = {};
    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim();
    const addressTrimmed = formData.address.trim();

    if (!nameTrimmed) {
      errors.name = 'Name is required.';
    }

    if (!emailTrimmed) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(emailTrimmed)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required.';
    }

    if (!addressTrimmed) {
      errors.address = 'Address is required.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Use 8+ characters with upper, lower, number, and symbol.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      address: {
        full: formData.address.trim()
      }
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-control ${formErrors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control ${formErrors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {formErrors.email && <div className="form-error">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              className={`form-control ${formErrors.phone ? 'input-error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              className={`form-control ${formErrors.address ? 'input-error' : ''}`}
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
            />
            {formErrors.address && <div className="form-error">{formErrors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control ${formErrors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {formErrors.password && <div className="form-error">{formErrors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className={`form-control ${formErrors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {formErrors.confirmPassword && (
              <div className="form-error">{formErrors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
