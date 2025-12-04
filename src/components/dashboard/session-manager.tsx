

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

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    } else if (device.includes("Windows") || device.includes("MacBook") || device.includes("Linux")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  }

  return (
    <div className="space-y-6 animate-slideInRight">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Active Sessions</h3>
                <p className="text-sm text-foreground/70 font-medium mt-0.5">Manage your device connections</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-card px-4 py-2 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-md">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground leading-tight">{user?.username}</p>
              <p className="text-xs text-foreground/60">{sessions.length} {sessions.length === 1 ? 'device' : 'devices'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`bg-card border-2 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all group ${
              session.current 
                ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent" 
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Device Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                session.current 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted text-foreground/60"
              }`}>
                {getDeviceIcon(session.device)}
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-semibold text-foreground text-[15px]">{session.device}</h4>
                  {session.current && (
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-green-500/20 text-green-600 dark:text-green-400 rounded-full uppercase tracking-wide border border-green-500/30">
                      Current Session
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{session.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      Last active: {session.lastActive.toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revoke Button */}
              {!session.current && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 font-semibold border border-destructive/30 hover:border-destructive/50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
        </div>

        {/* Right Sidebar - Security Info & Actions */}
        <div className="space-y-6">
          {/* Security Tips Card */}
          <div className="bg-card border-2 border-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-foreground">Security Tips</h4>
            </div>
            <ul className="space-y-3">
              {[
                { icon: "🔐", text: "Always sign out on shared devices" },
                { icon: "⚠️", text: "Review active sessions regularly" },
                { icon: "🚫", text: "Revoke unknown devices immediately" },
                { icon: "✨", text: "Use strong, unique passwords" }
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/75">
                  <span className="text-lg mt-0.5">{tip.icon}</span>
                  <span className="leading-relaxed">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Session Stats Card */}
          <div className="bg-card border-2 border-border rounded-xl p-5 shadow-lg">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Session Overview
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-foreground/70 font-medium">Total Devices</span>
                <span className="text-lg font-bold text-foreground">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-sm text-foreground/70 font-medium">Active Now</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {sessions.filter(s => s.current).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-foreground/70 font-medium">Other Sessions</span>
                <span className="text-lg font-bold text-foreground">
                  {sessions.filter(s => !s.current).length}
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out All Button */}
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-5 shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Danger Zone</h4>
                <p className="text-xs text-foreground/70 mb-3">Sign out from all other devices</p>
              </div>
            </div>
            <button className="w-full px-4 py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold transition-all hover:shadow-lg hover:shadow-destructive/30 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
