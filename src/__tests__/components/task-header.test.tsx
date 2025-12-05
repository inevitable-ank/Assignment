import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskHeader from '../../components/dashboard/task-header';

describe('TaskHeader', () => {
  const mockOnCreateTask = vi.fn();

  it('should render task header with counts', () => {
    render(
      <TaskHeader
        taskCount={10}
        completedCount={5}
        onCreateTask={mockOnCreateTask}
      />
    );

    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText(/5 of 10 tasks completed/i)).toBeInTheDocument();
  });

  it('should display zero counts correctly', () => {
    render(
      <TaskHeader
        taskCount={0}
        completedCount={0}
        onCreateTask={mockOnCreateTask}
      />
    );

    expect(screen.getByText(/0 of 0 tasks completed/i)).toBeInTheDocument();
  });

  it('should call onCreateTask when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskHeader
        taskCount={5}
        completedCount={2}
        onCreateTask={mockOnCreateTask}
      />
    );

    const createButton = screen.getByRole('button', { name: /new task/i });
    await user.click(createButton);

    expect(mockOnCreateTask).toHaveBeenCalledTimes(1);
  });

  it('should display all tasks completed message', () => {
    render(
      <TaskHeader
        taskCount={10}
        completedCount={10}
        onCreateTask={mockOnCreateTask}
      />
    );

    expect(screen.getByText(/10 of 10 tasks completed/i)).toBeInTheDocument();
  });
});


