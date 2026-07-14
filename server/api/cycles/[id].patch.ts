import { Cycle } from '~/server/models/Cycle'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  delete body.userId
  if (body.revenuTotal !== undefined) assertPositiveNumber(body.revenuTotal, 'revenuTotal')

  const cycle = await Cycle.findOneAndUpdate({ _id: id, userId }, body, { new: true })
  if (!cycle) {
    throw createError({ statusCode: 404, statusMessage: 'Cycle not found' })
  }

  return cycle
})
