import { Cycle } from '~/server/models/Cycle'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const actif = await Cycle.findOne({ statut: 'actif', userId }).sort({ dateDebut: -1 }).lean()
  const historique = await Cycle.find({ statut: 'cloture', userId }).sort({ dateDebut: -1 }).limit(12).lean()

  return { actif, historique }
})
