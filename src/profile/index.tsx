import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getApiUrl, API_ENDPOINTS } from "@/config/api"
import Navigation from "@/components/navigation"

interface User {
  id: string
  username: string
  email: string
  createdAt?: string
  updatedAt?: string
}

const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
}).refine((data) => data.username || data.email, {
  message: "At least one field must be provided",
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      window.location.href = "/auth/login"
      return
    }

    fetchProfile(token)
  }, [])

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.PROFILE), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdateProfile = async (data: UpdateProfileFormData) => {
    setIsUpdatingProfile(true)
    setProfileError("")
    setProfileSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/auth/login"
        return
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.UPDATE_PROFILE), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setProfileError(result.message || "Failed to update profile")
        return
      }

      setProfileSuccess("Profile updated successfully!")
      setUser(result.user)
      localStorage.setItem("user", JSON.stringify(result.user))
      resetProfile()
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(""), 3000)
    } catch (err) {
      setProfileError("An error occurred. Please try again.")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsChangingPassword(true)
    setPasswordError("")
    setPasswordSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/auth/login"
        return
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setPasswordError(result.message || "Failed to change password")
        return
      }

      setPasswordSuccess("Password changed successfully!")
      resetPassword()
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(""), 3000)
    } catch (err) {
      setPasswordError("An error occurred. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    window.location.href = href
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fadeInUp space-y-6">
          {/* Header */}
          <div className="mb-6">
            <a
              href="/dashboard"
              onClick={(e) => handleLinkClick(e, "/dashboard")}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </a>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Profile Settings</h1>
                <p className="text-foreground/70 mt-1">Manage your account information and security</p>
              </div>
            </div>
          </div>

          {/* Profile Information Card - Redesigned */}
          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 rounded-2xl p-8 shadow-xl animate-slideInRight">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-4xl shadow-lg ring-4 ring-primary/20">
                  {user.username[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">{user.username}</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-3 text-foreground/70">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  {user.createdAt && (
                    <>
                      <span className="hidden md:inline text-foreground/40">•</span>
                      <div className="flex items-center gap-2 justify-center md:justify-start text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Update Profile Form */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-slideInRight">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Update Profile</h2>
                  <p className="text-sm text-foreground/60">Change your account details</p>
                </div>
              </div>

              {profileError && (
                <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm mb-4 animate-scaleIn flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-500/30 text-green-600 dark:text-green-400 text-sm mb-4 animate-scaleIn flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Username
                  </label>
                  <input
                    {...registerProfile("username")}
                    type="text"
                    placeholder={user.username}
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {profileErrors.username && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {profileErrors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <input
                    {...registerProfile("email")}
                    type="email"
                    placeholder={user.email}
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {profileErrors.email && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-slideInRight">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Change Password</h2>
                  <p className="text-sm text-foreground/60">Update your account password</p>
                </div>
              </div>

              {passwordError && (
                <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm mb-4 animate-scaleIn flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-500/30 text-green-600 dark:text-green-400 text-sm mb-4 animate-scaleIn flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword("currentPassword")}
                      type={isPasswordVisible.current ? "text" : "password"}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible({ ...isPasswordVisible, current: !isPasswordVisible.current })}
                      className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors p-1 hover:bg-muted/50 rounded"
                    >
                    {isPasswordVisible.current ? (
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
                  {passwordErrors.currentPassword && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword("newPassword")}
                      type={isPasswordVisible.new ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible({ ...isPasswordVisible, new: !isPasswordVisible.new })}
                      className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors p-1 hover:bg-muted/50 rounded"
                    >
                      {isPasswordVisible.new ? (
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
                  {passwordErrors.newPassword && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword("confirmPassword")}
                      type={isPasswordVisible.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible({ ...isPasswordVisible, confirm: !isPasswordVisible.confirm })}
                      className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors p-1 hover:bg-muted/50 rounded"
                    >
                      {isPasswordVisible.confirm ? (
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
                  {passwordErrors.confirmPassword && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

