import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        // Return user object
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" }, // Your login page
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }