export function assertPositiveNumber(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : NaN
  if (!Number.isFinite(n) || n <= 0) {
    throw createError({ statusCode: 400, statusMessage: `${field} must be a positive number` })
  }
  return n
}

export function assertNonNegativeNumber(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : NaN
  if (!Number.isFinite(n) || n < 0) {
    throw createError({ statusCode: 400, statusMessage: `${field} must be a non-negative number` })
  }
  return n
}
