import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../../auth/register';

// Mock the API config
vi.mock('../../config/api', () => ({
  getApiUrl: vi.fn((endpoint: string) => `http://localhost:4000${endpoint}`),
  API_ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
    },
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should show validation error for short username', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'ab');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(passwordInput, 'short');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInputs = screen.getAllByPlaceholderText('••••••••');
    const confirmPasswordInput = confirmPasswordInputs[1]; // Second one is confirmPassword
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'DifferentPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
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

    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInputs = screen.getAllByPlaceholderText('••••••••');
    const confirmPasswordInput = confirmPasswordInputs[1]; // Second one is confirmPassword
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
          }),
        })
      );
    });
  });

  it('should display error message on registration failure', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already in use' }),
    });

    global.fetch = mockFetch;

    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    // Use getAllByLabelText and filter for input element (not button)
    const confirmPasswordElements = screen.getAllByLabelText(/confirm password/i);
    const confirmPasswordInput = confirmPasswordElements.find(
      (el) => el.tagName === 'INPUT'
    ) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const passwordToggleButton = passwordInput.parentElement?.querySelector('button');

    expect(passwordInput.type).toBe('password');

    if (passwordToggleButton) {
      await user.click(passwordToggleButton);
      expect(passwordInput.type).toBe('text');

      await user.click(passwordToggleButton);
      expect(passwordInput.type).toBe('password');
    }
  });

  it('should toggle confirm password visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const confirmPasswordInput = passwordInputs[1] as HTMLInputElement;
    const confirmPasswordToggleButton = confirmPasswordInput.parentElement?.querySelector('button');

    expect(confirmPasswordInput.type).toBe('password');

    if (confirmPasswordToggleButton) {
      await user.click(confirmPasswordToggleButton);
      expect(confirmPasswordInput.type).toBe('text');

      await user.click(confirmPasswordToggleButton);
      expect(confirmPasswordInput.type).toBe('password');
    }
  });
});


