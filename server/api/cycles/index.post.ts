import mongoose from 'mongoose'
import { Cycle } from '~/server/models/Cycle'
import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { revenuTotal, dateDebut, dateFinPrevue, depensesFixesSelectionnees } = body

  if (!dateFinPrevue) {
    throw createError({ statusCode: 400, statusMessage: 'dateFinPrevue is required' })
  }
  assertPositiveNumber(revenuTotal, 'revenuTotal')

  const debut = dateDebut ? new Date(dateDebut) : new Date()
  // Generated up front so the cycle doc and its transactions can reference
  // the same id regardless of which one gets written first.
  const cycleId = new mongoose.Types.ObjectId()

  const transactionDocs = [{
    montant: revenuTotal,
    montantPrevu: revenuTotal,
    type: 'revenu',
    categorie: 'Salary',
    note: 'Cycle salary',
    date: debut,
    cycleId,
    userId
  }]

  if (Array.isArray(depensesFixesSelectionnees)) {
    for (const d of depensesFixesSelectionnees) {
      transactionDocs.push({
        montant: assertPositiveNumber(d.montant, 'depensesFixesSelectionnees[].montant'),
        montantPrevu: d.montant,
        type: 'depense_fixe',
        categorie: d.categorie || '',
        note: d.nom,
        date: debut,
        cycleId,
        userId
      })
    }
  }

  async function run(session?: mongoose.ClientSession) {
    await Cycle.updateMany({ statut: 'actif', userId }, { statut: 'cloture' }, { session })
    const [cycle] = await Cycle.create([{
      _id: cycleId,
      dateDebut: debut,
      dateFinPrevue: new Date(dateFinPrevue),
      revenuTotal,
      statut: 'actif',
      userId
    }], { session })
    await Transaction.insertMany(transactionDocs, { session })
    return cycle
  }

  const session = await mongoose.startSession()
  try {
    let cycle: any
    try {
      await session.withTransaction(async () => {
        cycle = await run(session)
      })
    } catch (err: any) {
      if (err?.code === 20 || /Transaction numbers are only allowed/.test(err?.message || '')) {
        // Standalone MongoDB (common in local dev) doesn't support
        // multi-document transactions — fall back to a best-effort
        // sequential write so local dev keeps working without a replica set.
        cycle = await run()
      } else {
        throw err
      }
    }
    return cycle
  } catch (err: any) {
    if (err?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'A month is already active' })
    }
    throw err
  } finally {
    await session.endSession()
  }
})
