"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { getProfile } from "@/lib/actions/profiles.actions"
import { getUser } from "@/lib/appwrite/auth"
import { isAppwriteError } from "@/lib/utils/error-handler"
import { type Profiles, type User } from "@/types"

interface AuthContextType {
  user: User | null
  profile: Profiles | null
  refreshAuth: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profiles | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUserAndProfile = useCallback(async () => {
    try {
      const userData = await getUser()
      setUser(userData)

      if (userData) {
        const profileData = await getProfile(userData.$id)
        setProfile(!isAppwriteError(profileData) ? profileData : null)
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.error("Error loading user and profile:", error)
      setUser(null)
      setProfile(null)
    }
  }, [])

  const refreshAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      await loadUserAndProfile()
    } catch (error) {
      console.error("Error in refreshAuth:", error)
    } finally {
      setIsLoading(false)
    }
  }, [loadUserAndProfile])

  useEffect(() => {
    void refreshAuth()
  }, [refreshAuth])

  return (
    <AuthContext.Provider value={{ user, profile, refreshAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider")
  }
  return context
}
