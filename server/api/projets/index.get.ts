import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()
  return ProjetEpargne.find({ userId }).sort({ principal: -1, createdAt: 1 }).lean()
})
