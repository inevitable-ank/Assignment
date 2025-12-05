import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NaturalLanguageParser from '../../components/dashboard/natural-language-parser';

describe('NaturalLanguageParser', () => {
  const mockOnTaskParsed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field', () => {
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    expect(screen.getByPlaceholderText(/type a task/i)).toBeInTheDocument();
  });

  it('should parse task with high priority keyword', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'Complete report urgent');

    await waitFor(() => {
      expect(screen.getByText('Task Preview:')).toBeInTheDocument();
      expect(screen.getByText(/complete report urgent/i)).toBeInTheDocument();
      expect(screen.getByText(/priority: high/i)).toBeInTheDocument();
    });
  });

  it('should parse task with tomorrow date', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'Meet with team tomorrow');

    await waitFor(() => {
      expect(screen.getByText(/meet with team tomorrow/i)).toBeInTheDocument();
      expect(screen.getByText(/due:/i)).toBeInTheDocument();
    });
  });

  it('should parse task with today date', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'Finish project today');

    await waitFor(() => {
      expect(screen.getByText(/finish project today/i)).toBeInTheDocument();
      expect(screen.getByText(/due:/i)).toBeInTheDocument();
    });
  });

  it('should call onTaskParsed when Add Task is clicked', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'New task');

    await waitFor(() => {
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(mockOnTaskParsed).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New task',
        })
      );
    });
  });

  it('should clear input after adding task', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i) as HTMLInputElement;
    await user.type(input, 'Test task');

    await waitFor(() => {
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should not show preview for empty input', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, '   '); // Only spaces

    await waitFor(() => {
      expect(screen.queryByText('Task Preview:')).not.toBeInTheDocument();
    });
  });

  it('should disable button when isLoading is true', () => {
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} isLoading={true} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    expect(input).toBeInTheDocument();
  });

  it('should parse medium priority', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'Review code medium priority');

    await waitFor(() => {
      expect(screen.getByText(/priority: medium/i)).toBeInTheDocument();
    });
  });

  it('should parse low priority', async () => {
    const user = userEvent.setup();
    render(<NaturalLanguageParser onTaskParsed={mockOnTaskParsed} />);

    const input = screen.getByPlaceholderText(/type a task/i);
    await user.type(input, 'Clean up backlog low');

    await waitFor(() => {
      expect(screen.getByText(/priority: low/i)).toBeInTheDocument();
    });
  });
});

