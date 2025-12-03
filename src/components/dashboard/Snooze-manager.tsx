

import { useState } from "react"

interface Task {
  id: string
  title: string
  snoozedUntil?: Date
}

interface SnoozeManagerProps {
  tasks: Task[]
  onSnoozeTask: (id: string, until: Date) => void
}

export default function SnoozeManager({ tasks, onSnoozeTask }: SnoozeManagerProps) {
  const [openSnoozeId, setOpenSnoozeId] = useState<string | null>(null)

  const snoozeOptions = [
    { label: "5 minutes", minutes: 5 },
    { label: "1 hour", minutes: 60 },
    {
      label: "Tomorrow 9am",
      custom: () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9, 0, 0, 0)
        return tomorrow
      },
    },
    {
      label: "Next Monday",
      custom: () => {
        const monday = new Date()
        const day = monday.getDay()
        const daysToMonday = (8 - day) % 7 || 7
        monday.setDate(monday.getDate() + daysToMonday)
        monday.setHours(9, 0, 0, 0)
        return monday
      },
    },
  ]

  const handleSnooze = (taskId: string, minutes?: number, customDate?: Date) => {
    const now = new Date()
    const until = customDate || new Date(now.getTime() + (minutes || 5) * 60000)
    onSnoozeTask(taskId, until)
    setOpenSnoozeId(null)
  }

  const snoozedTasks = tasks.filter((t) => t.snoozedUntil)

  if (snoozedTasks.length === 0) return null

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="font-bold text-foreground">Snoozed Tasks</h3>
        <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
          {snoozedTasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {snoozedTasks.map((task) => (
          <div key={task.id} className="glass rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{task.title}</p>
              <p className="text-xs text-foreground/60">Snoozed until {task.snoozedUntil?.toLocaleString()}</p>
            </div>
            <button className="text-primary hover:text-primary/80 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
