export interface User {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  email: string
  emailVerification: boolean
  status: boolean
  labels: string[]
  targets: Array<{
    $id: string
    $createdAt: string
    $updatedAt: string
    name: string
    userId: string
    providerId?: string
    providerType: string
    identifier: string
  }>
  prefs: Record<string, any>
  accessedAt: string
}

export interface Session {
  $id: string
  $createdAt: string
  $updatedAt: string
  userId: string
  expire: string
  provider: string
  providerUid: string
  providerAccessToken: string
  providerAccessTokenExpiry: string
  providerRefreshToken: string
  ip: string
  osCode: string
  osName: string
  osVersion: string
  clientType: string
  clientCode: string
  clientName: string
  clientVersion: string
  clientEngine: string
  clientEngineVersion: string
  deviceName: string
  deviceBrand: string
  deviceModel: string
  countryCode: string
  countryName: string
  current: boolean
  factors: string[]
  secret: string
}

export interface AuthError {
  message: string
  code?: number
  type?: string
}
