
import { useState, useEffect, useRef, type MouseEvent } from "react"

interface NavigationProps {
  user: { id: string; username: string; email: string } | null
}

export default function Navigation({ user }: NavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileOpen])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    window.location.href = href
  }

  return (
    <nav className="sticky top-0 z-[100] glass border-b border-white/10 backdrop-blur-md">
      <div className="w-full px-2 py-2 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/dashboard" 
          onClick={(e) => handleLinkClick(e, "/dashboard")}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">TaskFlow</span>
        </a>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user?.username}</p>
              <p className="text-xs text-foreground/60">{user?.email}</p>
            </div>
            <svg
              className={`w-4 h-4 text-foreground/60 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border-2 border-primary/20 rounded-xl shadow-2xl shadow-black/20 overflow-hidden animate-slideInRight z-[110]">
              <a
                href="/dashboard/profile"
                onClick={(e) => handleLinkClick(e, "/dashboard/profile")}
                className="block px-4 py-3 hover:bg-primary/10 text-foreground transition-colors border-b border-border"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </div>
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors font-semibold"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
