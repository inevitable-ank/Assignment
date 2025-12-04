

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
    { id: "pending", title: "To Do", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-blue-200 dark:border-blue-800" },
    { id: "in-progress", title: "In Progress", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/30", borderColor: "border-purple-200 dark:border-purple-800" },
    { id: "completed", title: "Done", color: "from-green-500 to-green-600", bgColor: "bg-green-50 dark:bg-green-950/30", borderColor: "border-green-200 dark:border-green-800" },
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
            className={`w-96 ${column.bgColor} border-2 ${column.borderColor} rounded-2xl p-4 min-h-96 flex flex-col space-y-3 shadow-md hover:shadow-xl transition-all`}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-2 pb-3 border-b-2 border-border">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color} shadow-sm`} />
              <h3 className="font-bold text-foreground text-base tracking-tight">{column.title}</h3>
              <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-card border border-border text-foreground shadow-sm">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="flex items-center justify-center h-32 text-foreground/40 text-sm rounded-lg border-2 border-dashed border-border bg-card/50">
                  Drop tasks here
                </div>
              ) : (
                getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-card border-2 border-border rounded-lg p-4 cursor-move hover:shadow-lg hover:border-primary/40 transition-all transform hover:scale-[1.02] group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-[15px] text-foreground leading-tight">{task.title}</h4>
                          {task.priority && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                              task.priority === "high" 
                                ? "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400" 
                                : task.priority === "medium" 
                                ? "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400" 
                                : "bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                            }`}>
                              {task.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-[13px] text-foreground/75 mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-primary font-semibold mt-2">📅 {new Date(task.dueDate).toLocaleDateString()}</p>
                        )}
                        {task.recurrence && task.recurrence !== "none" && (
                          <div className="mt-2 inline-block px-2 py-1 rounded text-[11px] bg-accent/20 text-accent font-bold capitalize border border-accent/30 tracking-wide">
                            🔄 {task.recurrence}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/20 p-1.5 rounded"
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
