import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const name = (body.name || '').trim()

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'name is required' })
  }

  const user = await User.findByIdAndUpdate(userId, { name }, { new: true })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { _id: user._id, email: user.email, name: user.name }
})
