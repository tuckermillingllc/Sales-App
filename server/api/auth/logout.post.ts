/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user by clearing authentication cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *         headers:
 *           Set-Cookie:
 *             description: Clears the authentication token cookie
 *             schema:
 *               type: string
 *               example: "auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
 */

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