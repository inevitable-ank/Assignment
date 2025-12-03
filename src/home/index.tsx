import { useEffect, type MouseEvent } from "react"

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "/dashboard"
    }
  }, [])

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    window.location.href = href
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 animate-scaleIn">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">TaskFlow</h1>
            <p className="text-foreground/70 text-lg">Your modern task management solution</p>
          </div>

          {/* Glass card */}
          <div className="glass rounded-2xl p-8 mb-8 space-y-6 animate-slideInRight">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Welcome Back</h2>
              <p className="text-foreground/60">Manage your tasks with style and efficiency</p>
            </div>

            <div className="space-y-4">
              <a
                href="/auth/login"
                onClick={(e) => handleLinkClick(e, "/auth/login")}
              >
                <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95">
                  Sign In
                </button>
              </a>

              <a
                href="/auth/register"
                onClick={(e) => handleLinkClick(e, "/auth/register")}
              >
                <button className="w-full py-3 px-4 rounded-lg border-2 border-primary/30 hover:border-primary text-primary font-semibold transition-smooth">
                  Create Account
                </button>
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-foreground/50">or continue as guest</span>
              </div>
            </div>

            <button className="w-full py-3 px-4 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-smooth">
              Explore Demo
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-12">
            {[
              { icon: "✓", label: "Secure Auth" },
              { icon: "⚡", label: "Fast & Smooth" },
              { icon: "✨", label: "Beautiful UI" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass rounded-lg p-4 text-center animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="text-xs text-foreground/60">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

