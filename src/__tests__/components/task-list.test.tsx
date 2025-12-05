import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../../components/dashboard/task-list';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'completed' as const,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ];

  const mockOnUpdateTask = vi.fn();
  const mockOnDeleteTask = vi.fn();

  it('should render task list', () => {
    render(
      <TaskList
        tasks={mockTasks}
        isLoading={false}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={true}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={false}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it('should call onUpdateTask when task status is changed', async () => {
    const user = userEvent.setup();
    render(
      <TaskList
        tasks={mockTasks}
        isLoading={false}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    // Find and click the status button for the first task
    // The checkbox button doesn't have an accessible name, so find it by position
    const taskTitle = screen.getByText('Task 1');
    const card = taskTitle.closest('.bg-card');
    const buttons = card?.querySelectorAll('button');
    const checkbox = buttons?.[0]; // First button is the status checkbox
    expect(checkbox).toBeDefined();
    if (checkbox) {
      await user.click(checkbox);
      expect(mockOnUpdateTask).toHaveBeenCalled();
    }
  });

  it('should call onDeleteTask when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskList
        tasks={mockTasks}
        isLoading={false}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    // Find delete button by title attribute
    const deleteButtons = screen.getAllByTitle(/delete task/i);
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
      // Wait for the async delete operation
      await waitFor(() => {
        expect(mockOnDeleteTask).toHaveBeenCalledWith('1');
      }, { timeout: 2000 });
    }
  });
});


