// server/api/auth/login.post.ts
import { PrismaClient } from '@prisma/client'
import { createToken } from '~/server/utils/simpleAuth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password required'
      })
    }

    // Find user in your existing active_salespeople table
    const user = await prisma.activeSalespeople.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { name: email } // Allow login with name too
        ]
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Simple password check (you can enhance this later)
    // For now, check against their PIN or a simple password
    const isValid = password === user.pin || password === 'tucker2025' // temp password

    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Create token
    const token = createToken({
      code: user.code,
      name: user.name || 'Sales Rep',
      email: user.email || `${user.code}@tucker.com`
    })

    // Set cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return {
      success: true,
      user: {
        code: user.code,
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
})