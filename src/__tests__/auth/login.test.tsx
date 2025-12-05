import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../auth/login';

// Mock the API config
vi.mock('../../config/api', () => ({
  getApiUrl: vi.fn((endpoint: string) => `http://localhost:4000${endpoint}`),
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
    },
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'mock-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
      }),
    });

    global.fetch = mockFetch;

    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });
  });

  it('should display error message on login failure', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid email or password' }),
    });

    global.fetch = mockFetch;

    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = passwordInput.parentElement?.querySelector('button');

    expect(passwordInput.type).toBe('password');

    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      await user.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    }
  });

  it('should store token and user in localStorage on successful login', async () => {
    const user = userEvent.setup();
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
        user: mockUser,
      }),
    });

    global.fetch = mockFetch;

    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    // Restore window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});


