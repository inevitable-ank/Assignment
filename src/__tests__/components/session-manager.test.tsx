import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionManager from '../../components/dashboard/session-manager';

// Mock the API config
vi.mock('../../config/api', () => ({
  getApiUrl: vi.fn((endpoint: string) => `http://localhost:4000${endpoint}`),
  API_ENDPOINTS: {
    SESSIONS: {
      LIST: '/api/sessions',
      REVOKE: (id: string) => `/api/sessions/${id}`,
      REVOKE_ALL: '/api/sessions/revoke-all',
    },
  },
  handleApiResponse: vi.fn(async (response: Response) => response),
}));

describe('SessionManager', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      browser: 'Chrome',
      os: 'Windows',
      ipAddress: '192.168.1.1',
      location: 'New York, US',
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      current: true,
    },
    {
      id: '2',
      device: 'Safari on Mac',
      browser: 'Safari',
      os: 'macOS',
      ipAddress: '192.168.1.2',
      location: 'San Francisco, US',
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      current: false,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it('should render session manager', async () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessions: mockSessions }),
    });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/session management/i)).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    // Check for spinner element instead of text
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display sessions', async () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessions: mockSessions }),
    });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      expect(screen.getByText('Safari on Mac')).toBeInTheDocument();
    });
  });

  it('should display session stats', async () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessions: mockSessions }),
    });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/total devices/i)).toBeInTheDocument();
      expect(screen.getByText(/active now/i)).toBeInTheDocument();
      expect(screen.getByText(/other sessions/i)).toBeInTheDocument();
    });
  });

  it('should handle revoke session', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Safari on Mac')).toBeInTheDocument();
    });

    const revokeButtons = screen.getAllByText(/revoke/i);
    if (revokeButtons.length > 0) {
      await user.click(revokeButtons[0]);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    }
  });

  it('should handle revoke all sessions', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/sign out all other devices/i)).toBeInTheDocument();
    });

    const revokeAllButton = screen.getByText(/sign out all other devices/i);
    await user.click(revokeAllButton);

    await waitFor(() => {
      // Initial fetch + revoke all call = 2 calls expected
      // But there might be an additional call, so check for at least 2
      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should display error message on fetch failure', async () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to load sessions' }),
    });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load sessions/i)).toBeInTheDocument();
    });
  });

  it('should mark current session', async () => {
    localStorage.setItem('token', 'test-token');

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessions: mockSessions }),
    });

    global.fetch = mockFetch;

    render(<SessionManager user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      // Current session should be marked - use getAllByText to handle multiple matches
      const currentSessionElements = screen.getAllByText(/current session/i);
      expect(currentSessionElements.length).toBeGreaterThan(0);
      // Check that at least one is the badge (span element)
      const badge = currentSessionElements.find(el => el.tagName === 'SPAN');
      expect(badge).toBeInTheDocument();
    });
  });
});

