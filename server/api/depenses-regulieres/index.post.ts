import { DepenseReguliere } from '~/server/models/DepenseReguliere'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { nom, montantParDefaut, categorie } = body

  if (!nom || !montantParDefaut) {
    throw createError({ statusCode: 400, statusMessage: 'nom and montantParDefaut are required' })
  }

  return DepenseReguliere.create({ nom, montantParDefaut, categorie: categorie || '', userId })
})
