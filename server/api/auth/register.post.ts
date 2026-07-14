import { User } from '~/server/models/User'
import { Cycle } from '~/server/models/Cycle'
import { Transaction } from '~/server/models/Transaction'
import { DepenseReguliere } from '~/server/models/DepenseReguliere'
import { ProjetEpargne } from '~/server/models/ProjetEpargne'
import { Categorie } from '~/server/models/Categorie'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const email = (body.email || '').toLowerCase().trim()
  const password = body.password || ''
  const name = (body.name || '').trim()

  if (!email || !password || !name) {
    throw createError({ statusCode: 400, statusMessage: 'email, password and name are required' })
  }
  assertStrongPassword(password)

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  // Slows down both mass account creation and email-enumeration scanning
  // (the 409 below reveals whether an email is already registered).
  await enforceRateLimit(`register:ip:${ip}`, 10, 60 * 60 * 1000)

  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists' })
  }

  const passwordHash = await hashPassword(password)
  const user = await User.create({ email, passwordHash, name })

  // One-time migration: any pre-existing data created before multi-user support
  // had no owner. The first person to register on a fresh instance inherits it.
  // This is a no-op for every registration after the first, since that data is
  // already claimed.
  await Promise.all([
    Cycle.updateMany({ userId: { $exists: false } }, { $set: { userId: user._id } }),
    Transaction.updateMany({ userId: { $exists: false } }, { $set: { userId: user._id } }),
    DepenseReguliere.updateMany({ userId: { $exists: false } }, { $set: { userId: user._id } }),
    ProjetEpargne.updateMany({ userId: { $exists: false } }, { $set: { userId: user._id } }),
    Categorie.updateMany({ userId: { $exists: false } }, { $set: { userId: user._id } })
  ])

  const session = await getUserSession(event)
  await session.update({ userId: user._id.toString() })

  return { _id: user._id, email: user.email, name: user.name }
})
