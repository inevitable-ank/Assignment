

import type React from "react"

import { useState } from "react"

interface ParsedTask {
  title: string
  dueDate?: Date
  priority?: "low" | "medium" | "high"
  description?: string
}

interface NaturalLanguageParserProps {
  onTaskParsed: (task: ParsedTask) => void
  isLoading?: boolean
}

export default function NaturalLanguageParser({ onTaskParsed, isLoading }: NaturalLanguageParserProps) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<ParsedTask | null>(null)

  const parseTaskText = (text: string): ParsedTask => {
    const priorityKeywords = {
      high: ["urgent", "asap", "critical", "important", "high priority"],
      medium: ["medium", "normal", "standard"],
      low: ["low", "whenever", "someday", "backlog"],
    }

    const datePatterns = {
      today: /today|this evening|tonight/i,
      tomorrow: /tomorrow/i,
      nextWeek: /next week|next monday/i,
      nextMonth: /next month/i,
      specificDate: /(\d{1,2})\/(\d{1,2})|(\w+)\s+(\d{1,2})/i,
    }

    const task: ParsedTask = { title: text }
    let priority: "low" | "medium" | "high" | null = null

    // Extract priority
    for (const [level, keywords] of Object.entries(priorityKeywords)) {
      if (keywords.some((kw) => text.toLowerCase().includes(kw))) {
        priority = level as "low" | "medium" | "high"
        break
      }
    }

    // Extract due date
    const now = new Date()
    if (datePatterns.today.test(text)) {
      task.dueDate = now
    } else if (datePatterns.tomorrow.test(text)) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      task.dueDate = tomorrow
    } else if (datePatterns.nextWeek.test(text)) {
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      task.dueDate = nextWeek
    } else if (datePatterns.nextMonth.test(text)) {
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      task.dueDate = nextMonth
    }

    if (priority) task.priority = priority

    return task
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    if (value.trim()) {
      setSuggestions(parseTaskText(value))
    } else {
      setSuggestions(null)
    }
  }

  const handleAddTask = () => {
    if (suggestions) {
      onTaskParsed(suggestions)
      setInput("")
      setSuggestions(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a task... e.g., 'Meet Amy tomorrow 4pm urgent'"
          className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
        />
        <svg
          className="absolute right-3 top-3.5 w-5 h-5 text-primary/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {suggestions && input.trim() && (
        <div className="glass rounded-lg p-4 space-y-3 animate-slideInRight">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Task Preview:</p>
            <div className="bg-muted/50 rounded p-3 space-y-1">
              <p className="text-foreground font-medium">{suggestions.title}</p>
              {suggestions.dueDate && (
                <p className="text-xs text-primary">
                  Due:{" "}
                  {suggestions.dueDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
              {suggestions.priority && (
                <p
                  className={`text-xs font-semibold ${suggestions.priority === "high" ? "text-red-500" : suggestions.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}
                >
                  Priority: {suggestions.priority.toUpperCase()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleAddTask}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground font-semibold transition-smooth disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Task"}
          </button>
        </div>
      )}
    </div>
  )
}
