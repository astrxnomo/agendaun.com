"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { getUser } from "@/lib/appwrite/auth"
import { type User } from "@/types"

interface AuthContextType {
  user: User | null
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
  const [isLoading, setIsLoading] = useState(true)

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
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
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
