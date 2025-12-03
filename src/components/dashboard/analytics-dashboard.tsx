
import { useMemo } from "react"

interface Task {
  id: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
  priority?: "low" | "medium" | "high"
  dueDate?: string
}

interface AnalyticsDashboardProps {
  tasks: Task[]
}

export default function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const metrics = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const pending = tasks.filter((t) => t.status === "pending").length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const highPriority = tasks.filter((t) => t.priority === "high").length
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === "completed") return false
      return new Date(t.dueDate) < new Date()
    }).length

    const createdToday = tasks.filter((t) => {
      const today = new Date().toDateString()
      return new Date(t.createdAt).toDateString() === today
    }).length

    return { total, completed, inProgress, pending, completionRate, highPriority, overdue, createdToday }
  }, [tasks])

  const StatCard = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => (
    <div className="glass rounded-xl p-4 space-y-2 hover:bg-white/15 dark:hover:bg-white/8 transition-smooth">
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-xs text-foreground/60">{label}</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-4">Analytics</h2>
      </div>

      {/* Completion Progress */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Overall Completion</h3>
          <span className="text-lg font-bold gradient-text">{metrics.completionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${metrics.completionRate}%` }}
          />
        </div>
        <div className="text-xs text-foreground/60">
          {metrics.completed} of {metrics.total} tasks completed
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={metrics.total} icon="📋" color="text-primary" />
        <StatCard label="Completed" value={metrics.completed} icon="✓" color="text-green-500" />
        <StatCard label="In Progress" value={metrics.inProgress} icon="⚡" color="text-blue-500" />
        <StatCard label="To Do" value={metrics.pending} icon="📝" color="text-yellow-500" />
        <StatCard label="High Priority" value={metrics.highPriority} icon="🔥" color="text-red-500" />
        <StatCard label="Overdue" value={metrics.overdue} icon="⏰" color="text-destructive" />
        <StatCard label="Created Today" value={metrics.createdToday} icon="✨" color="text-accent" />
        <StatCard label="Completion Rate" value={metrics.completionRate} icon="📈" color="text-primary" />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "To Do", count: metrics.pending, color: "from-blue-500 to-blue-600" },
          { title: "In Progress", count: metrics.inProgress, color: "from-purple-500 to-purple-600" },
          { title: "Done", count: metrics.completed, color: "from-green-500 to-green-600" },
        ].map((status) => (
          <div key={status.title} className={`glass rounded-xl p-4 bg-gradient-to-br ${status.color} bg-opacity-10`}>
            <p className="text-sm text-foreground/60 mb-2">{status.title}</p>
            <p className="text-3xl font-bold text-foreground">{status.count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
