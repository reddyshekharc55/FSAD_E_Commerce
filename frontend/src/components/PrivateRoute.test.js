import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

test('shows loader when auth is initializing', () => {
  useAuth.mockReturnValue({ isAuthenticated: false, loading: true });

  render(
    <MemoryRouter>
      <PrivateRoute>
        <div>Protected</div>
      </PrivateRoute>
    </MemoryRouter>
  );

  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
});

test('redirects unauthenticated users to login', () => {
  useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <div>Protected</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Login Page')).toBeInTheDocument();
});

test('renders protected content when authenticated', () => {
  useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

  render(
    <MemoryRouter>
      <PrivateRoute>
        <div>Protected</div>
      </PrivateRoute>
    </MemoryRouter>
  );

  expect(screen.getByText('Protected')).toBeInTheDocument();
});
