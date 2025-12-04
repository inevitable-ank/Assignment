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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fadeInUp">
          {/* Header */}
          <div className="mb-8">
            <a
              href="/dashboard"
              onClick={(e) => handleLinkClick(e, "/dashboard")}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold gradient-text mb-2">Profile Settings</h1>
            <p className="text-foreground/60">Manage your account information and security</p>
          </div>

          {/* Profile Information Card */}
          <div className="glass rounded-2xl p-8 mb-6 animate-slideInRight">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl">
                {user.username[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user.username}</h2>
                <p className="text-foreground/60">{user.email}</p>
                {user.createdAt && (
                  <p className="text-sm text-foreground/40 mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Update Profile Form */}
          <div className="glass rounded-2xl p-8 mb-6 animate-slideInRight">
            <h2 className="text-xl font-bold text-foreground mb-6">Update Profile</h2>

            {profileError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4 animate-scaleIn">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm mb-4 animate-scaleIn">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Username
                  </label>
                  <input
                    {...registerProfile("username")}
                    type="text"
                    placeholder={user.username}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                  {profileErrors.username && (
                    <p className="text-destructive text-sm">{profileErrors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    {...registerProfile("email")}
                    type="email"
                    placeholder={user.email}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                  {profileErrors.email && (
                    <p className="text-destructive text-sm">{profileErrors.email.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="glass rounded-2xl p-8 animate-slideInRight">
            <h2 className="text-xl font-bold text-foreground mb-6">Change Password</h2>

            {passwordError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4 animate-scaleIn">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm mb-4 animate-scaleIn">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    {...registerPassword("currentPassword")}
                    type={isPasswordVisible.current ? "text" : "password"}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible({ ...isPasswordVisible, current: !isPasswordVisible.current })}
                    className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors"
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
                  <p className="text-destructive text-sm">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword("newPassword")}
                      type={isPasswordVisible.new ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible({ ...isPasswordVisible, new: !isPasswordVisible.new })}
                      className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors"
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
                    <p className="text-destructive text-sm">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword("confirmPassword")}
                      type={isPasswordVisible.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible({ ...isPasswordVisible, confirm: !isPasswordVisible.confirm })}
                      className="absolute right-3 top-3.5 text-foreground/60 hover:text-foreground transition-colors"
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
                    <p className="text-destructive text-sm">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold transition-smooth transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Changing...
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

