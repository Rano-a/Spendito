import { Categorie } from '~/server/models/Categorie'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()
  return Categorie.find({ userId }).sort({ nom: 1 }).lean()
})
