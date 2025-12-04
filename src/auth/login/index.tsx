
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getApiUrl, API_ENDPOINTS } from "@/config/api"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || "Login failed")
        return
      }

      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))
      window.location.href = "/dashboard"
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Header */}
          <div className="mb-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = "/"
              }}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </a>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-foreground/60">Sign in to your TaskFlow account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-6 animate-slideInRight">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-scaleIn">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors"
                >
                  {isPasswordVisible ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 1.274 4.057 5.064 7 9.542 7 1.341 0 2.629-.167 3.834-.477l-2.08-2.08A4 4 0 006 10a4 4 0 008-0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-foreground/60 hover:text-foreground cursor-pointer transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-border" />
                Remember me
              </label>
              <a
                href="/auth/forgot-password"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = "/auth/forgot-password"
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-foreground/50">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <a
              href="/auth/register"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = "/auth/register"
              }}
              className="block text-center text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Create Account
            </a>
          </form>
        </div>
      </main>
    </div>
  )
}
