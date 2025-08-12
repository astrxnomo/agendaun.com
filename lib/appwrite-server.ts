import { Account, Client, Databases, Storage } from "node-appwrite"

const client = new Client()

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export { client }
