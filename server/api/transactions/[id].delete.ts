import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  await Transaction.findOneAndDelete({ _id: id, userId })

  return { success: true }
})
