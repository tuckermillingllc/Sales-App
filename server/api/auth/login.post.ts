/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email/username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email or username
 *                 example: "john.smith@tucker.com"
 *               password:
 *                 type: string
 *                 description: User password or PIN
 *                 example: "tucker2025"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: User code/ID
 *                       example: "JS001"
 *                     name:
 *                       type: string
 *                       description: User full name
 *                       example: "John Smith"
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: "john.smith@tucker.com"
 *         headers:
 *           Set-Cookie:
 *             description: Authentication token cookie
 *             schema:
 *               type: string
 *               example: "auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 statusMessage:
 *                   type: string
 *                   example: "Email and password required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 statusMessage:
 *                   type: string
 *                   example: "Invalid credentials"
 */

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