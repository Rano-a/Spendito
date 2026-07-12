import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { nom, montantCible, montantActuel, icone, couleur, principal } = body

  if (!nom || !montantCible) {
    throw createError({ statusCode: 400, statusMessage: 'nom and montantCible are required' })
  }

  return ProjetEpargne.create({
    nom,
    montantCible,
    montantActuel: montantActuel || 0,
    icone: icone || 'PiggyBank',
    couleur: couleur || '#6366f1',
    principal: !!principal,
    userId
  })
})
