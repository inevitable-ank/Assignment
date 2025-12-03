
import { useState } from "react"

interface NavigationProps {
  user: { id: string; username: string; email: string } | null
}

export default function Navigation({ user }: NavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    window.location.href = href
  }

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
        <div className="relative">
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
            <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-2xl overflow-hidden animate-slideInRight">
              <a
                href="/dashboard/profile"
                onClick={(e) => handleLinkClick(e, "/dashboard/profile")}
                className="block px-4 py-3 hover:bg-muted/50 text-foreground transition-colors border-b border-white/10"
              >
                Profile Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
