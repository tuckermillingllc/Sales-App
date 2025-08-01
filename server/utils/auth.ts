// server/utils/auth.ts
import jwt from 'jsonwebtoken'

export interface AuthUser {
  userCode: string
  userName: string
  email: string
}

export async function requireAuth(event: any): Promise<AuthUser> {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthUser
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
}