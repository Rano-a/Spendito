import { RateLimit } from '~/server/models/RateLimit'

// Fixed-window limiter backed by MongoDB rather than in-process memory, since
// serverless invocations (this app targets Vercel) don't share memory across
// requests. The update uses an aggregation pipeline so the "is the window
// still open" check and the increment happen in one atomic round trip.
export async function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date()
  const pipeline = [
    {
      $set: {
        count: { $cond: [{ $gt: ['$resetAt', now] }, { $add: ['$count', 1] }, 1] },
        resetAt: { $cond: [{ $gt: ['$resetAt', now] }, '$resetAt', new Date(now.getTime() + windowMs)] }
      }
    }
  ]

  let doc
  try {
    doc = await RateLimit.findOneAndUpdate({ key }, pipeline, { upsert: true, new: true })
  } catch (e: any) {
    // Two concurrent first-ever requests for the same key can both miss and
    // race the upsert; the loser gets a duplicate-key error. Retry once as a
    // plain update since the winner's document now exists.
    if (e?.code === 11000) {
      doc = await RateLimit.findOneAndUpdate({ key }, pipeline, { upsert: true, new: true })
    } else {
      throw e
    }
  }

  if (doc.count > limit) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Please try again later.' })
  }
}
