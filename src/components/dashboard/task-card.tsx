
import { useState, type CSSProperties } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskCardProps {
  task: Task
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  style?: CSSProperties
}

export default function TaskCard({ task, isEditing, onEdit, onCancel, onUpdate, onDelete, style }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: task.title, description: task.description },
  })

  const onSubmit = (data: TaskFormData) => {
    onUpdate(task.id, { title: data.title, description: data.description })
    onCancel()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (isEditing) {
    return (
      <div className="glass rounded-xl p-6 animate-scaleIn" style={style}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("title")}
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}

          <textarea
            {...register("description")}
            placeholder="Add description..."
            className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div
      className={`glass rounded-xl p-6 group hover:bg-white/15 dark:hover:bg-white/8 transition-smooth cursor-pointer transform hover:scale-105 hover:shadow-lg ${
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        ...style,
        transitionDuration: isDeleting ? "300ms" : "300ms",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onUpdate(task.id, { status: task.status === "completed" ? "pending" : "completed" })}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-smooth ${
                task.status === "completed" ? "bg-primary border-primary" : "border-primary/30 hover:border-primary"
              }`}
            >
              {task.status === "completed" && (
                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <h3
              className={`text-lg font-semibold ${task.status === "completed" ? "line-through text-foreground/50" : "text-foreground"}`}
            >
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              }`}
            >
              {task.status}
            </span>
          </div>
          {task.description && (
            <p className={`ml-9 text-foreground/60 ${task.status === "completed" ? "line-through" : ""}`}>
              {task.description}
            </p>
          )}
          <p className="ml-9 text-xs text-foreground/40 mt-2">{formatDate(task.createdAt)}</p>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
