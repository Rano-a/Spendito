import { Categorie } from '~/server/models/Categorie'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId

  try {
    const categorie = await Categorie.findOneAndUpdate({ _id: id, userId }, body, { new: true, runValidators: true })
    if (!categorie) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }
    return categorie
  } catch (e: any) {
    if (e.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'This category already exists' })
    }
    throw e
  }
})
