

import { useState, type DragEvent } from "react"

interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
  priority?: "low" | "medium" | "high"
  dueDate?: string
  recurrence?: "none" | "daily" | "weekly" | "monthly"
}

interface KanbanBoardProps {
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function KanbanBoard({ tasks, onUpdateTask, onDeleteTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const columns = [
    { id: "pending", title: "To Do", color: "from-blue-500 to-blue-600" },
    { id: "in-progress", title: "In Progress", color: "from-purple-500 to-purple-600" },
    { id: "completed", title: "Done", color: "from-green-500 to-green-600" },
  ]

  const handleDragStart = (task: Task) => setDraggedTask(task)

  const handleDragOver = (e: DragEvent) => e.preventDefault()

  const handleDrop = (columnId: string) => {
    if (draggedTask && draggedTask.status !== columnId) {
      onUpdateTask(draggedTask.id, { status: columnId as any })
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status: string) => tasks.filter((task) => task.status === status)

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="grid grid-cols-3 gap-4 min-w-max">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className="w-96 glass rounded-2xl p-4 min-h-96 flex flex-col space-y-3 hover:bg-white/15 dark:hover:bg-white/8 transition-smooth"
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
              <h3 className="font-bold text-foreground">{column.title}</h3>
              <span className="ml-auto px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="flex items-center justify-center h-32 text-foreground/40 text-sm rounded-lg border-2 border-dashed border-border">
                  Drop tasks here
                </div>
              ) : (
                getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="glass rounded-lg p-3 cursor-move hover:shadow-lg transition-smooth transform hover:scale-105 group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground">{task.title}</h4>
                          {task.priority && (
                            <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-primary mt-2">{new Date(task.dueDate).toLocaleDateString()}</p>
                        )}
                        {task.recurrence && task.recurrence !== "none" && (
                          <div className="mt-2 inline-block px-2 py-1 rounded text-xs bg-accent/20 text-accent font-semibold capitalize">
                            {task.recurrence}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
