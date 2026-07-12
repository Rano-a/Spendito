export default defineEventHandler(async () => {
  // Disabled: seedDatabase() wipes every collection with an unscoped
  // deleteMany({}), which would destroy every user's data now that the app
  // is multi-user. Nothing in the UI calls this endpoint.
  throw createError({ statusCode: 410, statusMessage: 'This endpoint has been disabled' })
})
