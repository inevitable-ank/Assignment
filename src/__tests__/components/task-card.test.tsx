import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../../components/dashboard/task-card';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending' as const,
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task card with task details', () => {
    render(
      <TaskCard
        task={mockTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('should render completed task with strikethrough', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    render(
      <TaskCard
        task={completedTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
  });

  it('should show edit form when isEditing is true', () => {
    render(
      <TaskCard
        task={mockTask}
        isEditing={true}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={true}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onUpdate when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={true}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const titleInput = screen.getByDisplayValue('Test Task');
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', {
        title: 'Updated Task',
        description: 'Test Description',
      });
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={true}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const titleInput = screen.getByDisplayValue('Test Task');
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.clear(titleInput);
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  it('should toggle task status when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // The checkbox button doesn't have an accessible name, so find it by position
    // It's the first button in the task card, before the title
    const taskTitle = screen.getByText('Test Task');
    const card = taskTitle.closest('.bg-card');
    const buttons = card?.querySelectorAll('button');
    const checkbox = buttons?.[0]; // First button is the status checkbox
    expect(checkbox).toBeDefined();
    if (checkbox) {
      await user.click(checkbox);
    }

    expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'completed' });
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle(/delete task/i);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    }, { timeout: 1000 });
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle(/edit task/i);
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should format date correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Check that date is rendered (format may vary by locale)
    const dateElement = screen.getByText(/Jan|January/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('should handle task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(
      <TaskCard
        task={taskWithoutDescription}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});


