import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  await ProjetEpargne.findOneAndDelete({ _id: id, userId })

  return { success: true }
})
