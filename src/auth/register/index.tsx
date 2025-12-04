
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getApiUrl, API_ENDPOINTS } from "@/config/api"

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || "Registration failed")
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
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-foreground/60">Join TaskFlow and start managing tasks</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-5 animate-slideInRight">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-scaleIn">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Username</label>
              <input
                {...register("username")}
                type="text"
                placeholder="johndoe"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
              {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
            </div>

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
                  {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors"
                >
                  {isConfirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-foreground/60 cursor-pointer hover:text-foreground transition-colors">
              <input type="checkbox" className="w-4 h-4 mt-1 rounded border-border" />I agree to the Terms of Service
              and Privacy Policy
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-foreground/50">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <a
              href="/auth/login"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = "/auth/login"
              }}
              className="block text-center text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign In
            </a>
          </form>
        </div>
      </main>
    </div>
  )
}
