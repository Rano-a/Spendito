import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  resetAt: { type: Date, required: true }
})

// TTL index: MongoDB deletes the document once resetAt is in the past, so
// expired windows clean themselves up without a separate maintenance job.
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 })

export const RateLimit = models.RateLimit || model('RateLimit', RateLimitSchema)
