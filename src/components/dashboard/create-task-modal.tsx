
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]).optional(),
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

interface CreateTaskModalProps {
  onClose: () => void
  onCreate: (title: string, description: string, priority?: string, recurrence?: string) => void
}

export default function CreateTaskModal({ onClose, onCreate }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  })

  const onSubmit = async (data: CreateTaskFormData) => {
    setIsSubmitting(true)
    try {
      onCreate(data.title, data.description || "", data.priority, data.recurrence)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeInUp" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border-2 border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-8 space-y-6 animate-scaleIn">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Create New Task</h2>
            <p className="text-foreground/70">Add a new task to your list</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                {...register("title")}
                type="text"
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Description (optional)</label>
              <textarea
                {...register("description")}
                placeholder="Add more details..."
                className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                rows={4}
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
            </div>

            {/* Priority and Recurrence */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Priority</label>
                <select
                  {...register("priority")}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Recurrence</label>
                <select
                  {...register("recurrence")}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-lg border-2 border-border hover:border-primary text-foreground font-semibold transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
