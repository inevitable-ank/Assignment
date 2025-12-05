import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../home';

// Mock window.location
const mockLocation = {
  href: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
  });

  it('should render home page with title', () => {
    render(<Home />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText(/Your modern task management solution/i)).toBeInTheDocument();
  });

  it('should render sign in and create account buttons', () => {
    render(<Home />);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should redirect to dashboard if user is logged in', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', username: 'test', email: 'test@example.com' }));

    render(<Home />);

    await waitFor(() => {
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  it('should navigate to login when sign in button is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    const signInLink = signInButton.closest('a');

    if (signInLink) {
      await user.click(signInLink);
      expect(mockLocation.href).toBe('/auth/login');
    }
  });

  it('should navigate to register when create account button is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const createAccountLink = createAccountButton.closest('a');

    if (createAccountLink) {
      await user.click(createAccountLink);
      expect(mockLocation.href).toBe('/auth/register');
    }
  });

  it('should display feature cards', () => {
    render(<Home />);

    expect(screen.getByText(/secure auth/i)).toBeInTheDocument();
    expect(screen.getByText(/fast & smooth/i)).toBeInTheDocument();
    expect(screen.getByText(/beautiful ui/i)).toBeInTheDocument();
  });

  it('should render welcome message', () => {
    render(<Home />);

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage your tasks with style and efficiency/i)).toBeInTheDocument();
  });
});

