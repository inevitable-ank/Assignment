
import { useState } from "react"
import TaskCard from "./task-card"

interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskList({ tasks, isLoading, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-8">
        <div className="glass rounded-2xl p-12 text-center animate-slideInRight">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
          <p className="text-foreground/60">Create your first task to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-4 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onEdit={() => setEditingId(task.id)}
          onCancel={() => setEditingId(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  )
}
