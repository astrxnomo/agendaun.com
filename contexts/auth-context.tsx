"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { getProfile } from "@/lib/actions/profiles.actions"
import { getUser } from "@/lib/appwrite/auth"
import { isAppwriteError } from "@/lib/utils/error-handler"
import { type Profiles, type User } from "@/types"

interface AuthContextType {
  user: User | null
  profile: Profiles | null
  setUser: (user: User | null) => void
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

  useEffect(() => {
    const handleGetLoggedInUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetLoggedInUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setUser, isLoading }}>
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
