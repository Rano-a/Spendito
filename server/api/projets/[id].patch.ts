import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId

  let projet

  if (typeof body.delta === 'number') {
    projet = await ProjetEpargne.findOne({ _id: id, userId })
    if (!projet) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
    projet.montantActuel = Math.max(0, projet.montantActuel + body.delta)
    await projet.save()
  } else {
    projet = await ProjetEpargne.findOneAndUpdate({ _id: id, userId }, body, { new: true })
    if (!projet) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
  }

  return projet
})
