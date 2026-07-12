import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session.data.userId
  if (!userId) {
    return null
  }

  await connectDB()
  const user = await User.findById(userId).lean()
  if (!user) {
    return null
  }

  return { _id: user._id, email: user.email, name: user.name }
})
