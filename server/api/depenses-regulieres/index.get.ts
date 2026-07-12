import { DepenseReguliere } from '~/server/models/DepenseReguliere'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()
  return DepenseReguliere.find({ userId }).sort({ nom: 1 }).lean()
})
