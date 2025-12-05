import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsDashboard from '../../components/dashboard/analytics-dashboard';

describe('AnalyticsDashboard', () => {
  const mockTasks = [
    {
      id: '1',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      priority: 'high' as const,
      dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
    },
    {
      id: '2',
      status: 'in-progress' as const,
      createdAt: new Date().toISOString(),
      priority: 'medium' as const,
    },
    {
      id: '3',
      status: 'completed' as const,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      priority: 'low' as const,
    },
    {
      id: '4',
      status: 'completed' as const,
      createdAt: new Date().toISOString(), // Today
    },
  ];

  it('should render analytics dashboard', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText(/Track your productivity and progress/i)).toBeInTheDocument();
  });

  it('should display correct task counts', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    expect(screen.getByText('4')).toBeInTheDocument(); // Total Tasks
    expect(screen.getByText('2')).toBeInTheDocument(); // Completed
    expect(screen.getByText('1')).toBeInTheDocument(); // In Progress
    expect(screen.getByText('1')).toBeInTheDocument(); // To Do
  });

  it('should calculate completion rate correctly', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    // 2 completed out of 4 total = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should display high priority count', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    expect(screen.getByText('1')).toBeInTheDocument(); // High Priority
  });

  it('should display overdue count', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    expect(screen.getByText('1')).toBeInTheDocument(); // Overdue (task 1 is overdue)
  });

  it('should display created today count', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    // Tasks 2 and 4 were created today
    expect(screen.getAllByText('2')).toBeTruthy();
  });

  it('should handle empty tasks array', () => {
    render(<AnalyticsDashboard tasks={[]} />);

    expect(screen.getByText('0')).toBeInTheDocument(); // Total Tasks
    expect(screen.getByText('0%')).toBeInTheDocument(); // Completion Rate
  });

  it('should display all stat cards', () => {
    render(<AnalyticsDashboard tasks={mockTasks} />);

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Created Today')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('should display progress bar', () => {
    const { container } = render(<AnalyticsDashboard tasks={mockTasks} />);

    const progressBar = container.querySelector('.bg-gradient-to-r.from-primary.to-accent');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not count completed tasks as overdue', () => {
    const tasksWithCompletedOverdue = [
      {
        id: '1',
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday but completed
      },
    ];

    render(<AnalyticsDashboard tasks={tasksWithCompletedOverdue} />);

    expect(screen.getByText('0')).toBeInTheDocument(); // Overdue should be 0
  });
});

