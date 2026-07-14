import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId
  if (body.montant !== undefined) assertPositiveNumber(body.montant, 'montant')
  if (body.montantPrevu !== undefined) assertPositiveNumber(body.montantPrevu, 'montantPrevu')

  const transaction = await Transaction.findOneAndUpdate({ _id: id, userId }, body, { new: true })
  if (!transaction) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction not found' })
  }

  return transaction
})
