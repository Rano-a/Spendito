import { Cycle } from '~/server/models/Cycle'
import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { revenuTotal, dateDebut, dateFinPrevue, depensesFixesSelectionnees } = body

  if (!revenuTotal || !dateFinPrevue) {
    throw createError({ statusCode: 400, statusMessage: 'revenuTotal and dateFinPrevue are required' })
  }

  const debut = dateDebut ? new Date(dateDebut) : new Date()

  await Cycle.updateMany({ statut: 'actif', userId }, { statut: 'cloture' })

  const cycle = await Cycle.create({
    dateDebut: debut,
    dateFinPrevue: new Date(dateFinPrevue),
    revenuTotal,
    statut: 'actif',
    userId
  })

  await Transaction.create({
    montant: revenuTotal,
    montantPrevu: revenuTotal,
    type: 'revenu',
    categorie: 'Salary',
    note: 'Cycle salary',
    date: debut,
    cycleId: cycle._id,
    userId
  })

  if (Array.isArray(depensesFixesSelectionnees) && depensesFixesSelectionnees.length) {
    const docs = depensesFixesSelectionnees.map((d: any) => ({
      montant: d.montant,
      montantPrevu: d.montant,
      type: 'depense_fixe',
      categorie: d.categorie || '',
      note: d.nom,
      date: debut,
      cycleId: cycle._id,
      userId
    }))
    await Transaction.insertMany(docs)
  }

  return cycle
})
