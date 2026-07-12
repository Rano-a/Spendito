import { Categorie } from '~/server/models/Categorie'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()

    // Pre-multi-user, `nom` had a single-field unique index. The schema now
    // uses a compound (userId, nom) unique index instead so different users
    // can each have a "Groceries" category — Mongoose doesn't drop stale
    // indexes on its own, so this removes the old one if it's still there.
    try {
      await Categorie.collection.dropIndex('nom_1')
      console.log('[Budgeto] Dropped legacy nom_1 unique index on categories.')
    } catch (err: any) {
      if (err.codeName !== 'IndexNotFound') throw err
    }
  } catch (err) {
    console.error('[Budgeto] Startup migration failed:', err)
  }
})
