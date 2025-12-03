

import { useState } from "react"

interface Session {
  id: string
  device: string
  location: string
  lastActive: Date
  current: boolean
}

interface SessionManagerProps {
  user: { username: string; email: string } | null
}

export default function SessionManager({ user }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome on MacBook Pro",
      location: "San Francisco, CA",
      lastActive: new Date(),
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      lastActive: new Date(Date.now() - 3600000),
      current: false,
    },
    {
      id: "3",
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: new Date(Date.now() - 86400000),
      current: false,
    },
  ])

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4 animate-slideInRight">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground text-lg">Active Sessions</h3>
          <p className="text-sm text-foreground/60">{sessions.length} device(s) connected</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`glass rounded-lg p-4 flex items-start justify-between group hover:bg-white/15 dark:hover:bg-white/8 transition-smooth ${
              session.current ? "border-2 border-primary/50" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20m0 0l-.75 3M9 20a6 6 0 1112 0m0 0l.75 3M21 20l.75-3m0 0L21 17"
                  />
                </svg>
                <p className="font-semibold text-foreground">{session.device}</p>
                {session.current && (
                  <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60 mb-1">{session.location}</p>
              <p className="text-xs text-foreground/40">Last active: {session.lastActive.toLocaleString()}</p>
            </div>

            {!session.current && (
              <button
                onClick={() => handleRevokeSession(session.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg text-sm text-destructive hover:bg-destructive/10 font-semibold"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 px-4 rounded-lg border-2 border-destructive/30 text-destructive font-semibold hover:bg-destructive/10 transition-colors">
        Sign Out All Devices
      </button>
    </div>
  )
}
