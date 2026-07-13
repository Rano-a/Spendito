import { Transaction } from '~/server/models/Transaction'
import { Cycle } from '~/server/models/Cycle'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { montant, montantPrevu, type, categorie, note, date, cycleId } = body

  if (!montant || !cycleId) {
    throw createError({ statusCode: 400, statusMessage: 'montant and cycleId are required' })
  }

  const owned = await Cycle.exists({ _id: cycleId, userId })
  if (!owned) {
    throw createError({ statusCode: 404, statusMessage: 'Cycle not found' })
  }

  const transaction = await Transaction.create({
    montant,
    montantPrevu: montantPrevu ?? montant,
    type: type || 'depense_variable',
    categorie: categorie || '',
    note: note || '',
    date: date ? new Date(date) : new Date(),
    cycleId,
    userId
  })

  return transaction
})
