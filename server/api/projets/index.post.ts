import { ProjetEpargne } from '~/server/models/ProjetEpargne'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { nom, montantCible, montantActuel, icone, couleur, principal } = body

  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'nom is required' })
  }
  assertPositiveNumber(montantCible, 'montantCible')
  if (montantActuel !== undefined) assertNonNegativeNumber(montantActuel, 'montantActuel')

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
