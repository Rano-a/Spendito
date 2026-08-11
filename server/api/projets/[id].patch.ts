import { ProjetEpargne } from '~/server/models/ProjetEpargne'
import { Cycle } from '~/server/models/Cycle'
import { Transaction } from '~/server/models/Transaction'

// Savings already recorded on a cycle — the ceiling for how much a withdrawal
// may take back out of it. A project can hold money put aside before it was
// mirrored into transactions at all, or during an earlier cycle; recording the
// full withdrawal against this month would drive its savings total negative.
async function epargneDuCycle(userId: string, cycleId: unknown) {
  const rows = await Transaction.find({ userId, cycleId, type: 'epargne' }).select('montant').lean()
  return Math.max(0, rows.reduce((acc, t) => acc + t.montant, 0))
}

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId

  let projet

  if (typeof body.delta === 'number') {
    if (!Number.isFinite(body.delta)) {
      throw createError({ statusCode: 400, statusMessage: 'delta must be a finite number' })
    }
    projet = await ProjetEpargne.findOne({ _id: id, userId })
    if (!projet) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
    const avant = projet.montantActuel
    projet.montantActuel = Math.max(0, avant + body.delta)
    await projet.save()

    // Money put aside is money spent out of the month's budget, so mirror the
    // movement as an `epargne` transaction on the active cycle — without this
    // the dashboard's Savings total stayed at 0 no matter how much was saved,
    // and the amount never left the "left to spend" envelope.
    // A withdrawal is stored as a negative amount, which correctly subtracts
    // from the savings total and hands the money back to the envelope.
    // The applied delta can be smaller than the requested one when a
    // withdrawal is clamped at zero, so record what actually moved.
    const applique = projet.montantActuel - avant
    if (applique !== 0) {
      const cycle = await Cycle.findOne({ statut: 'actif', userId }).sort({ dateDebut: -1 })
      if (cycle) {
        const montant = applique > 0 ? applique : -Math.min(-applique, await epargneDuCycle(userId, cycle._id))
        if (montant !== 0) {
          await Transaction.create({
            montant,
            montantPrevu: montant,
            type: 'epargne',
            categorie: '',
            note: projet.nom,
            date: new Date(),
            cycleId: cycle._id,
            projetId: projet._id,
            userId
          })
        }
      }
    }
  } else {
    if (body.montantCible !== undefined) assertPositiveNumber(body.montantCible, 'montantCible')
    if (body.montantActuel !== undefined) assertNonNegativeNumber(body.montantActuel, 'montantActuel')
    projet = await ProjetEpargne.findOneAndUpdate({ _id: id, userId }, body, { new: true })
    if (!projet) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
  }

  return projet
})
