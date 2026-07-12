import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId

  const transaction = await Transaction.findOneAndUpdate({ _id: id, userId }, body, { new: true })
  if (!transaction) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction not found' })
  }

  return transaction
})
