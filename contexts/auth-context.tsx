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

  const refreshAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const userData = await getUser()

      if (!userData) {
        setUser(null)
        setProfile(null)
        return
      }

      setUser(userData)

      try {
        const profileData = await getProfile(userData.$id)
        setProfile(profileData)
      } catch (profileError) {
        console.warn("Could not load user profile:", profileError)
        setProfile(null)
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
