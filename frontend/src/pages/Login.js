import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const validate = () => {
    const errors = {};
    const emailTrimmed = formData.email.trim();

    if (!emailTrimmed) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(emailTrimmed)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
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
    const result = await login(formData.email.trim(), formData.password);
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
        <h2 className="auth-title">Welcome Back</h2>
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control ${formErrors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {formErrors.password && <div className="form-error">{formErrors.password}</div>}
          </div>

          <div className="auth-helper">
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
