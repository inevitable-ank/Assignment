import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTaskModal from '../../components/dashboard/create-task-modal';

describe('CreateTaskModal', () => {
  const mockOnCreate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with form', () => {
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recurrence/i)).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const backdrop = document.querySelector('.fixed.inset-0.bg-black');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith(
        'Test Task',
        'Test Description',
        undefined,
        undefined
      );
    });
  });

  it('should submit form with priority and recurrence', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const titleInput = screen.getByLabelText(/title/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    const recurrenceSelect = screen.getByLabelText(/recurrence/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.selectOptions(prioritySelect, 'high');
    await user.selectOptions(recurrenceSelect, 'daily');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith(
        'Test Task',
        '',
        'high',
        'daily'
      );
    });
  });

  it('should show validation error for title exceeding max length', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const titleInput = screen.getByLabelText(/title/i);
    const longTitle = 'a'.repeat(101);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, longTitle);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be less than 100 characters/i)).toBeInTheDocument();
    });

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('should show validation error for description exceeding max length', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const longDescription = 'a'.repeat(501);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, longDescription);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description must be less than 500 characters/i)).toBeInTheDocument();
    });

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup();
    const slowOnCreate = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CreateTaskModal onClose={mockOnClose} onCreate={slowOnCreate} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });
});


