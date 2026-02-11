import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

test('validates required fields', async () => {
  useAuth.mockReturnValue({ register: jest.fn() });
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /register/i }));

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
  expect(screen.getByText('Email is required.')).toBeInTheDocument();
  expect(screen.getByText('Phone is required.')).toBeInTheDocument();
  expect(screen.getByText('Address is required.')).toBeInTheDocument();
  expect(screen.getByText('Password is required.')).toBeInTheDocument();
  expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
});

test('validates password mismatch', async () => {
  useAuth.mockReturnValue({ register: jest.fn() });
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText(/full name/i), 'Asha Patel');
  await userEvent.type(screen.getByLabelText(/email/i), 'asha@example.com');
  await userEvent.type(screen.getByLabelText(/phone/i), '5551112222');
  await userEvent.type(screen.getByLabelText(/address/i), '22 Main St');
  await userEvent.type(screen.getByLabelText(/^password$/i), 'Password1!');
  await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password2!');

  await userEvent.click(screen.getByRole('button', { name: /register/i }));

  expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
});
