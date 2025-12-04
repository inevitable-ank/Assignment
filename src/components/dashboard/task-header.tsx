

interface TaskHeaderProps {
  taskCount: number
  completedCount: number
  onCreateTask: () => void
}

export default function TaskHeader({ taskCount, completedCount, onCreateTask }: TaskHeaderProps) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInUp">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">My Tasks</h1>
        <p className="text-base text-foreground/70 font-medium">
          {completedCount} of {taskCount} tasks completed
        </p>
      </div>
      <button
        onClick={onCreateTask}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 text-[15px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </button>
    </div>
  )
}
