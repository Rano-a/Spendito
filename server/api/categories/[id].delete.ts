import { Categorie } from '~/server/models/Categorie'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  await Categorie.findOneAndDelete({ _id: id, userId })

  return { success: true }
})
