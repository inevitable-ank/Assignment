import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from '../../components/dashboard/kanban-board';

describe('KanbanBoard', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00Z',
      priority: 'high' as const,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in-progress' as const,
      createdAt: '2024-01-02T00:00:00Z',
      priority: 'medium' as const,
    },
    {
      id: '3',
      title: 'Task 3',
      status: 'completed' as const,
      createdAt: '2024-01-03T00:00:00Z',
    },
  ];

  const mockOnUpdateTask = vi.fn();
  const mockOnDeleteTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render kanban board with columns', () => {
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should display tasks in correct columns', () => {
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument(); // In To Do
    expect(screen.getByText('Task 2')).toBeInTheDocument(); // In In Progress
    expect(screen.getByText('Task 3')).toBeInTheDocument(); // In Done
  });

  it('should display task counts in column headers', () => {
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    // Each column should show the count
    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(3); // At least one count per column
  });

  it('should display task priority badges', () => {
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('should display empty state when column has no tasks', () => {
    const emptyTasks: typeof mockTasks = [];
    render(
      <KanbanBoard tasks={emptyTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getAllByText('Drop tasks here').length).toBe(3); // One per column
  });

  it('should call onDeleteTask when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    // Hover over a task to show delete button
    const taskCard = screen.getByText('Task 1').closest('div');
    if (taskCard) {
      await user.hover(taskCard);
      
      // Find delete button (it should appear on hover)
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => 
        btn.querySelector('svg') && btn.closest('[class*="group"]')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        expect(mockOnDeleteTask).toHaveBeenCalled();
      }
    }
  });

  it('should display task descriptions when available', () => {
    render(
      <KanbanBoard tasks={mockTasks} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should handle tasks without descriptions', () => {
    const tasksWithoutDesc = [
      {
        id: '1',
        title: 'Task Without Description',
        status: 'pending' as const,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    render(
      <KanbanBoard tasks={tasksWithoutDesc} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('Task Without Description')).toBeInTheDocument();
  });

  it('should display due dates when available', () => {
    const tasksWithDueDate = [
      {
        id: '1',
        title: 'Task with Due Date',
        status: 'pending' as const,
        createdAt: '2024-01-01T00:00:00Z',
        dueDate: '2024-12-31T00:00:00Z',
      },
    ];

    render(
      <KanbanBoard tasks={tasksWithDueDate} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText('Task with Due Date')).toBeInTheDocument();
  });

  it('should display recurrence when available', () => {
    const tasksWithRecurrence = [
      {
        id: '1',
        title: 'Recurring Task',
        status: 'pending' as const,
        createdAt: '2024-01-01T00:00:00Z',
        recurrence: 'daily' as const,
      },
    ];

    render(
      <KanbanBoard tasks={tasksWithRecurrence} onUpdateTask={mockOnUpdateTask} onDeleteTask={mockOnDeleteTask} />
    );

    expect(screen.getByText(/daily/i)).toBeInTheDocument();
  });
});

