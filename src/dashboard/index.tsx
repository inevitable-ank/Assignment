
import { useEffect, useState } from "react"
import TaskHeader from "@/components/dashboard/task-header"
import TaskList from "@/components/dashboard/task-list"
import CreateTaskModal from "@/components/dashboard/create-task-modal"
import Navigation from "@/components/navigation"
import KanbanBoard from "@/components/dashboard/kanban-board"
import NaturalLanguageParser from "@/components/dashboard/natural-language-parser"
import AnalyticsDashboard from "@/components/dashboard/analytics-dashboard"
import SessionManager from "@/components/dashboard/session-manager"

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

interface User {
  id: string
  username: string
  email: string
}

type ViewType = "list" | "kanban" | "analytics" | "sessions"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [view, setView] = useState<ViewType>("kanban")
  const [isParsingTask, setIsParsingTask] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      window.location.href = "/auth/login"
      return
    }

    setUser(JSON.parse(userData))
    fetchTasks(token)
  }, [])

  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (title: string, description: string, priority?: string, recurrence?: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status: "pending",
          priority: priority || "medium",
          recurrence: recurrence || "none",
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([newTask, ...tasks])
        setIsCreateModalOpen(false)
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleNaturalLanguageParse = async (parsedTask: any) => {
    setIsParsingTask(true)
    try {
      await handleCreateTask(parsedTask.title, parsedTask.description || "", parsedTask.priority, parsedTask.recurrence)
    } finally {
      setIsParsingTask(false)
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-foreground/60">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-fadeInUp">
          <TaskHeader
            taskCount={tasks.length}
            completedCount={tasks.filter((t) => t.status === "completed").length}
            onCreateTask={() => setIsCreateModalOpen(true)}
          />

          <div className="mt-8 flex gap-2 flex-wrap">
            {(["list", "kanban", "analytics", "sessions"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  view === v
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "glass text-foreground hover:bg-muted/50"
                }`}
              >
                {v === "list" && "List"}
                {v === "kanban" && "Kanban"}
                {v === "analytics" && "Analytics"}
                {v === "sessions" && "Sessions"}
              </button>
            ))}
          </div>

          <div className="mt-8 glass rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4">Quick Add Task</h3>
            <NaturalLanguageParser onTaskParsed={handleNaturalLanguageParse} isLoading={isParsingTask} />
          </div>

          {view === "list" && (
            <>
              <div className="mt-8 flex gap-3 flex-wrap">
                {(["all", "pending", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                      filter === status
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        : "glass text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {status} {status !== "all" && `(${tasks.filter((t) => t.status === status).length})`}
                  </button>
                ))}
              </div>
              <TaskList
                tasks={filteredTasks}
                isLoading={isLoading}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </>
          )}

          {view === "kanban" && (
            <div className="mt-8">
              <KanbanBoard tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
            </div>
          )}

          {view === "analytics" && (
            <div className="mt-8">
              <AnalyticsDashboard tasks={tasks} />
            </div>
          )}

          {view === "sessions" && (
            <div className="mt-8 max-w-2xl">
              <SessionManager user={user} />
            </div>
          )}
        </div>
      </main>

      {isCreateModalOpen && <CreateTaskModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateTask} />}
    </div>
  )
}
