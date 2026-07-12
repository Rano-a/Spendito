import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const email = (body.email || '').toLowerCase().trim()
  const password = body.password || ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'email and password are required' })
  }

  const user = await User.findOne({ email })
  const valid = await verifyPassword(password, user?.passwordHash || DUMMY_HASH)
  if (!user || !valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const session = await getUserSession(event)
  await session.update({ userId: user._id.toString() })

  return { _id: user._id, email: user.email, name: user.name }
})
