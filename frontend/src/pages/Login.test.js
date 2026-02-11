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
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByText('Email is required.')).toBeInTheDocument();
  expect(screen.getByText('Password is required.')).toBeInTheDocument();
});

test('shows api error on invalid credentials', async () => {
  useAuth.mockReturnValue({
    login: jest.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' })
  });
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText(/email/i), 'user@example.com');
  await user.type(screen.getByLabelText(/password/i), 'Password1!');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
});
