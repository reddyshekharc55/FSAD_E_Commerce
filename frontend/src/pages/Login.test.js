import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

test('validates required fields', async () => {
  useAuth.mockReturnValue({ login: jest.fn() });
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByText('Email is required.')).toBeInTheDocument();
  expect(screen.getByText('Password is required.')).toBeInTheDocument();
});

test('shows api error on invalid credentials', async () => {
  useAuth.mockReturnValue({
    login: jest.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' })
  });
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
});
