

import { useState, useEffect } from "react"
import { getApiUrl, API_ENDPOINTS, handleApiResponse } from "@/config/api"

interface Session {
  id: string
  device: string
  browser?: string
  os?: string
  ipAddress?: string
  location?: string
  lastActive: string
  createdAt: string
  current: boolean
}

interface SessionManagerProps {
  user: { username: string; email: string } | null
}

export default function SessionManager({ user }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRevoking, setIsRevoking] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setIsLoading(true)
      const response = await fetch(getApiUrl(API_ENDPOINTS.SESSIONS.LIST), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      await handleApiResponse(response)

      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      } else {
        setError("Failed to load sessions")
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err)
      if (err instanceof Error && err.message !== 'Session revoked') {
        setError("Failed to load sessions")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeSession = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    const session = sessions.find(s => s.id === id)
    if (!session) return

    if (!confirm(`Are you sure you want to revoke the session from "${session.device}"? This will sign out that device.`)) {
      return
    }

    try {
      setIsRevoking(id)
      const response = await fetch(getApiUrl(API_ENDPOINTS.SESSIONS.REVOKE(id)), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== id))
        setError("") // Clear any previous errors
      } else {
        setError("Failed to revoke session")
      }
    } catch (err) {
      console.error("Failed to revoke session:", err)
      setError("Failed to revoke session")
    } finally {
      setIsRevoking(null)
    }
  }

  const handleRevokeAllSessions = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const otherSessionsCount = sessions.filter(s => !s.current).length
    
    if (otherSessionsCount === 0) {
      alert("You don't have any other active sessions to revoke. This is your only active session.")
      return
    }

    if (!confirm(`Are you sure you want to sign out from all ${otherSessionsCount} other device${otherSessionsCount > 1 ? 's' : ''}? Your current session will remain active.`)) {
      return
    }

    try {
      setIsRevokingAll(true)
      const response = await fetch(getApiUrl(API_ENDPOINTS.SESSIONS.REVOKE_ALL), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        await fetchSessions() // Refresh the list
        alert(`Successfully signed out from ${data.count} other device${data.count > 1 ? 's' : ''}.`)
      } else {
        setError("Failed to revoke sessions")
      }
    } catch (err) {
      console.error("Failed to revoke all sessions:", err)
      setError("Failed to revoke sessions")
    } finally {
      setIsRevokingAll(false)
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slideInRight">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

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
        {sessions.filter(s => !s.current).length === 0 && (
          <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">No Other Active Sessions</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">You're only signed in on this device. Other sessions will appear here when you sign in from different devices or browsers.</p>
            </div>
          </div>
        )}
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
                  {session.ipAddress && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="font-medium">{session.ipAddress}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      Last active: {new Date(session.lastActive).toLocaleString('en-US', { 
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
                  disabled={isRevoking === session.id}
                  className="opacity-0 group-hover:opacity-100 transition-all px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 font-semibold border border-destructive/30 hover:border-destructive/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRevoking === session.id ? (
                    <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
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
                <p className="text-xs text-foreground/70 mb-3">Sign out from all other devices. Your current session will remain active.</p>
              </div>
            </div>
            <button 
              onClick={handleRevokeAllSessions}
              disabled={isRevokingAll || sessions.filter(s => !s.current).length === 0}
              className="w-full px-4 py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold transition-all hover:shadow-lg hover:shadow-destructive/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRevokingAll ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out All Other Devices {sessions.filter(s => !s.current).length > 0 && `(${sessions.filter(s => !s.current).length})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
