import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authAPI } from '../services/api';

jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn()
  }
}));

const makeToken = (expSecondsFromNow) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { exp: Math.floor(Date.now() / 1000) + expSecondsFromNow };

  const encode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  return `${encode(header)}.${encode(payload)}.signature`;
};

const setupLocation = () => {
  const original = window.location;
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { href: '' }
  });
  return () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original
    });
  };
};

const Probe = ({ onReady }) => {
  const context = useAuth();
  React.useEffect(() => {
    onReady(context);
  }, [context, onReady]);
  return null;
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('hydrates auth state from valid stored token', async () => {
  const token = makeToken(60);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Asha' }));

  let ctx;
  render(
    <AuthProvider>
      <Probe onReady={(value) => { ctx = value; }} />
    </AuthProvider>
  );

  await waitFor(() => expect(ctx.loading).toBe(false));
  expect(ctx.user?.name).toBe('Asha');
  expect(ctx.isAuthenticated).toBe(true);
});

test('clears expired token on load', async () => {
  const token = makeToken(-60);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ id: 2, name: 'Ishan' }));

  let ctx;
  render(
    <AuthProvider>
      <Probe onReady={(value) => { ctx = value; }} />
    </AuthProvider>
  );

  await waitFor(() => expect(ctx.loading).toBe(false));
  expect(localStorage.getItem('token')).toBeNull();
  expect(ctx.isAuthenticated).toBe(false);
});

test('login persists auth data', async () => {
  const token = makeToken(300);
  authAPI.login.mockResolvedValue({
    data: {
      token,
      user: { id: 3, name: 'Riya' }
    }
  });

  let ctx;
  render(
    <AuthProvider>
      <Probe onReady={(value) => { ctx = value; }} />
    </AuthProvider>
  );

  await waitFor(() => expect(ctx.loading).toBe(false));

  await act(async () => {
    await ctx.login('riya@example.com', 'Password1!');
  });

  expect(localStorage.getItem('token')).toBe(token);
  expect(JSON.parse(localStorage.getItem('user')).name).toBe('Riya');
  expect(ctx.isAuthenticated).toBe(true);
});

test('auto-logout clears token on expiry', async () => {
  jest.useFakeTimers();
  const restoreLocation = setupLocation();
  const token = makeToken(1);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ id: 4, name: 'Nia' }));

  let ctx;
  render(
    <AuthProvider>
      <Probe onReady={(value) => { ctx = value; }} />
    </AuthProvider>
  );

  await waitFor(() => expect(ctx.loading).toBe(false));

  act(() => {
    jest.advanceTimersByTime(1500);
  });

  expect(localStorage.getItem('token')).toBeNull();
  expect(ctx.isAuthenticated).toBe(false);

  restoreLocation();
  jest.useRealTimers();
});
