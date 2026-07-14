import { DepenseReguliere } from '~/server/models/DepenseReguliere'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { nom, montantParDefaut, categorie } = body

  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'nom is required' })
  }
  assertPositiveNumber(montantParDefaut, 'montantParDefaut')

  return DepenseReguliere.create({ nom, montantParDefaut, categorie: categorie || '', userId })
})
