import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const currentPassword = body.currentPassword || ''
  const newPassword = body.newPassword || ''

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: 'currentPassword and newPassword are required' })
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'New password must be at least 6 characters' })
  }

  const user = await User.findById(userId)
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Current password is incorrect' })
  }

  user.passwordHash = await hashPassword(newPassword)
  await user.save()

  return { success: true }
})
