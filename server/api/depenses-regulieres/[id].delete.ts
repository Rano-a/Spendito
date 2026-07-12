import { DepenseReguliere } from '~/server/models/DepenseReguliere'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  await DepenseReguliere.findOneAndDelete({ _id: id, userId })

  return { success: true }
})
