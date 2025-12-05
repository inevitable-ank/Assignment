import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../profile';

// Mock the API config
vi.mock('../config/api', () => ({
  getApiUrl: vi.fn((endpoint: string) => `http://localhost:4000${endpoint}`),
  API_ENDPOINTS: {
    AUTH: {
      PROFILE: '/api/auth/profile',
      UPDATE_PROFILE: '/api/auth/profile',
      CHANGE_PASSWORD: '/api/auth/password',
    },
  },
}));

// Mock window.location
const mockLocation = {
  href: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
  });

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
  };

  it('should redirect to login if no token', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockLocation.href).toBe('/auth/login');
    });
  });

  it('should fetch and display user profile', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
    global.fetch = mockFetch;

    const { container } = render(<ProfilePage />);

    // Should show loading spinner
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should update profile successfully', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { ...mockUser, username: 'newusername' } }),
      });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('testuser')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('testuser');
    const updateButton = screen.getByRole('button', { name: /update profile/i });

    await user.type(usernameInput, 'newusername');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('test@example.com')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('test@example.com');
    const updateButton = screen.getByRole('button', { name: /update profile/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should change password successfully', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Password changed successfully' }),
      });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter current password/i)).toBeInTheDocument();
    });

    const currentPasswordInput = screen.getByPlaceholderText(/enter current password/i);
    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });

    await user.type(currentPasswordInput, 'oldpassword123');
    await user.type(newPasswordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(changePasswordButton);

    await waitFor(() => {
      expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });

    await user.type(newPasswordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'differentpassword123');
    await user.click(changePasswordButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    global.fetch = mockFetch;

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter current password/i)).toBeInTheDocument();
    });

    const currentPasswordInput = screen.getByPlaceholderText(/enter current password/i) as HTMLInputElement;
    expect(currentPasswordInput.type).toBe('password');

    // Find the visibility toggle button
    const toggleButtons = screen.getAllByRole('button');
    const visibilityToggle = toggleButtons.find(btn => 
      btn.closest('.relative')?.querySelector('input[type="password"]')
    );

    if (visibilityToggle) {
      await user.click(visibilityToggle);
      await waitFor(() => {
        expect(currentPasswordInput.type).toBe('text');
      });
    }
  });
});

