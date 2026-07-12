import { Categorie } from '~/server/models/Categorie'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const body = await readBody(event)
  const { nom } = body

  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'nom is required' })
  }

  try {
    return await Categorie.create({ nom, parDefaut: false, userId })
  } catch (e: any) {
    if (e.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'This category already exists' })
    }
    throw e
  }
})
