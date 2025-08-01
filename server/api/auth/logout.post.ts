// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  setCookie(event, 'auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  })

  return { success: true }
})