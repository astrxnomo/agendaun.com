import { Account, Client, Databases } from "node-appwrite"

const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)
    .setLocale("es-co")

  return {
    get account() {
      return new Account(client)
    },

    get database() {
      return new Databases(client)
    },
  }
}

const createSessionClient = async (session: string) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setLocale("es-co")

  if (session) {
    client.setSession(session)
  }

  return {
    get account() {
      return new Account(client)
    },

    get database() {
      return new Databases(client)
    },
  }
}

export { createAdminClient, createSessionClient }

