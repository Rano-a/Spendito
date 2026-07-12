import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const query = getQuery(event)
  const filter: Record<string, any> = { userId }
  if (query.cycleId) filter.cycleId = query.cycleId

  const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).lean()
  return transactions
})
