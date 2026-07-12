import mongoose from 'mongoose'

let cached = (global as any)._mongooseConn as Promise<typeof mongoose> | undefined

export async function connectDB() {
  if (cached) return cached

  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string

  if (!uri) {
    throw createError({ statusCode: 500, statusMessage: 'MONGODB_URI is not configured' })
  }

  cached = mongoose.connect(uri, { dbName: 'budgeto' })
  ;(global as any)._mongooseConn = cached

  try {
    return await cached
  } catch (err) {
    cached = undefined
    ;(global as any)._mongooseConn = undefined
    throw err
  }
}
