import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock window.location
const mockLocation = {
  pathname: '/',
  href: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
  });

  it('should render home page for root path', () => {
    mockLocation.pathname = '/';
    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('should render home page for /home path', () => {
    mockLocation.pathname = '/home';
    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('should render login page for /auth/login path', () => {
    mockLocation.pathname = '/auth/login';
    render(<App />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('should render register page for /auth/register path', () => {
    mockLocation.pathname = '/auth/register';
    render(<App />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('should render dashboard page for /dashboard path', () => {
    mockLocation.pathname = '/dashboard';
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', username: 'test', email: 'test@example.com' }));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [] }),
    });

    global.fetch = mockFetch;

    render(<App />);

    expect(screen.getByText('My Tasks')).toBeInTheDocument();
  });

  it('should render profile page for /dashboard/profile path', () => {
    mockLocation.pathname = '/dashboard/profile';
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', username: 'test', email: 'test@example.com' }));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1', username: 'test', email: 'test@example.com' } }),
    });

    global.fetch = mockFetch;

    render(<App />);

    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('should render home page for unknown path', () => {
    mockLocation.pathname = '/unknown/path';
    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });
});

