import { ProjetEpargne } from '~/server/models/ProjetEpargne'
import { Transaction } from '~/server/models/Transaction'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const projet = await ProjetEpargne.findOneAndDelete({ _id: id, userId })

  // The `epargne` rows mirroring this project's movements only ever described
  // the project itself. Left behind they keep skewing the savings total of
  // every cycle they belong to, with nothing in the UI to point at or remove.
  if (projet) {
    await Transaction.deleteMany({ userId, projetId: projet._id })
  }

  return { success: true }
})
