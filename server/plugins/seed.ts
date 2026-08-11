import { Categorie } from '~/server/models/Categorie'
import { Transaction } from '~/server/models/Transaction'
import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()

    // Pre-multi-user, `nom` had a single-field unique index. The schema now
    // uses a compound (userId, nom) unique index instead so different users
    // can each have a "Groceries" category — Mongoose doesn't drop stale
    // indexes on its own, so this removes the old one if it's still there.
    try {
      await Categorie.collection.dropIndex('nom_1')
      console.log('[Spendito] Dropped legacy nom_1 unique index on categories.')
    } catch (err: any) {
      if (err.codeName !== 'IndexNotFound') throw err
    }

    // Deleting a savings project used to leave its mirrored `epargne` rows
    // behind, which kept dragging the savings total of the cycle they sat in
    // — a withdrawal from a since-deleted project could leave the dashboard
    // reporting a negative amount saved, with nothing left in the UI to act
    // on. The delete endpoint now cleans up after itself; this clears the
    // rows orphaned before it did. A no-op once there are none left.
    const projetIds = await Transaction.distinct('projetId', { projetId: { $ne: null } })
    if (projetIds.length) {
      const existants = await ProjetEpargne.find({ _id: { $in: projetIds } }).distinct('_id')
      const vivants = new Set(existants.map(String))
      const orphelins = projetIds.filter(id => !vivants.has(String(id)))
      if (orphelins.length) {
        const { deletedCount } = await Transaction.deleteMany({ projetId: { $in: orphelins } })
        console.log(`[Spendito] Removed ${deletedCount} savings transaction(s) left by deleted projects.`)
      }
    }
  } catch (err) {
    console.error('[Spendito] Startup migration failed:', err)
  }
})
