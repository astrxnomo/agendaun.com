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

  const loadUserAndProfile = async () => {
    try {
      const userData = await getUser()
      setUser(userData)

      if (userData) {
        const profileData = await getProfile(userData.$id)
        if (!isAppwriteError(profileData)) {
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.log(error)
      setUser(null)
      setProfile(null)
    }
  }

  const refreshAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      await loadUserAndProfile()
    } catch (error) {
      console.error("Error in refreshAuth:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load profile when user changes
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null)
        return
      }

      try {
        const profileData = await getProfile(user.$id)
        if (!isAppwriteError(profileData)) {
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.log("Error loading profile:", error)
        setProfile(null)
      }
    }

    void loadProfile()
  }, [user])

  // Load user and profile on mount
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
