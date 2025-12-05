import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '../../components/navigation';

// Mock window.location
const mockLocation = {
  href: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

describe('Navigation', () => {
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
  };

  it('should render navigation with user info', () => {
    render(<Navigation user={mockUser} />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render navigation without user', () => {
    render(<Navigation user={null} />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('should toggle profile dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation user={mockUser} />);

    const profileButton = screen.getByText('testuser').closest('button');
    expect(profileButton).toBeInTheDocument();

    if (profileButton) {
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    }
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Navigation user={mockUser} />
        <div>Outside Element</div>
      </div>
    );

    const profileButton = screen.getByText('testuser').closest('button');
    if (profileButton) {
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      });

      const outsideElement = screen.getByText('Outside Element');
      await user.click(outsideElement);

      await waitFor(() => {
        expect(screen.queryByText('Profile Settings')).not.toBeInTheDocument();
      });
    }
  });

  it('should handle logout', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(<Navigation user={mockUser} />);

    const profileButton = screen.getByText('testuser').closest('button');
    if (profileButton) {
      await user.click(profileButton);

      await waitFor(() => {
        const logoutButton = screen.getByText('Sign Out');
        expect(logoutButton).toBeInTheDocument();
      });

      const logoutButton = screen.getByText('Sign Out');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
      });
    }
  });

  it('should navigate to dashboard when logo is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation user={mockUser} />);

    const logoLink = screen.getByText('TaskFlow').closest('a');
    expect(logoLink).toBeInTheDocument();

    if (logoLink) {
      await user.click(logoLink);
      // The navigation should be prevented and handled by handleLinkClick
      expect(mockLocation.href).toBe('/dashboard');
    }
  });

  it('should display user initial in avatar', () => {
    render(<Navigation user={mockUser} />);

    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
  });

  it('should handle user with empty username', () => {
    const userWithEmptyUsername = { ...mockUser, username: '' };
    render(<Navigation user={userWithEmptyUsername} />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });
});

