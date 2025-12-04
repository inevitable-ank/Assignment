
import { useMemo, type ReactNode } from "react"

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

  const StatCard = ({ 
    label, 
    value, 
    icon, 
    color, 
    bgColor 
  }: { 
    label: string; 
    value: number; 
    icon: ReactNode; 
    color: string; 
    bgColor: string 
  }) => (
    <div className={`${bgColor} border border-border rounded-xl p-5 space-y-3 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div className={`${color} p-3 rounded-lg bg-white/10 dark:bg-black/20`}>
          {icon}
        </div>
        <span className={`text-3xl font-bold ${color} tracking-tight`}>{value}</span>
      </div>
      <p className="text-[13px] font-semibold text-foreground/80 leading-tight">{label}</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-4 tracking-tight">Analytics</h2>
        <p className="text-foreground/70 text-base">Track your productivity and progress</p>
      </div>

      {/* Completion Progress */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-base">Overall Completion</h3>
          <span className="text-xl font-bold gradient-text">{metrics.completionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${metrics.completionRate}%` }}
          />
        </div>
        <div className="text-sm text-foreground/70 font-medium">
          {metrics.completed} of {metrics.total} tasks completed
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Tasks" 
          value={metrics.total} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          color="text-blue-600 dark:text-blue-400" 
          bgColor="bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard 
          label="Completed" 
          value={metrics.completed} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="text-green-600 dark:text-green-400" 
          bgColor="bg-green-50 dark:bg-green-950/30"
        />
        <StatCard 
          label="In Progress" 
          value={metrics.inProgress} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="text-purple-600 dark:text-purple-400" 
          bgColor="bg-purple-50 dark:bg-purple-950/30"
        />
        <StatCard 
          label="To Do" 
          value={metrics.pending} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="text-amber-600 dark:text-amber-400" 
          bgColor="bg-amber-50 dark:bg-amber-950/30"
        />
        <StatCard 
          label="High Priority" 
          value={metrics.highPriority} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          color="text-red-600 dark:text-red-400" 
          bgColor="bg-red-50 dark:bg-red-950/30"
        />
        <StatCard 
          label="Overdue" 
          value={metrics.overdue} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="text-orange-600 dark:text-orange-400" 
          bgColor="bg-orange-50 dark:bg-orange-950/30"
        />
        <StatCard 
          label="Created Today" 
          value={metrics.createdToday} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          color="text-cyan-600 dark:text-cyan-400" 
          bgColor="bg-cyan-50 dark:bg-cyan-950/30"
        />
        <StatCard 
          label="Completion Rate" 
          value={metrics.completionRate} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="text-indigo-600 dark:text-indigo-400" 
          bgColor="bg-indigo-50 dark:bg-indigo-950/30"
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground/70">To Do</p>
          </div>
          <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{metrics.pending}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-2 border-purple-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground/70">In Progress</p>
          </div>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{metrics.inProgress}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-2 border-green-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground/70">Done</p>
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{metrics.completed}</p>
        </div>
      </div>
    </div>
  )
}
