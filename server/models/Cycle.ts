import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const CycleSchema = new Schema({
  dateDebut: { type: Date, required: true },
  dateFinPrevue: { type: Date, required: true },
  revenuTotal: { type: Number, required: true },
  statut: { type: String, enum: ['actif', 'cloture'], default: 'actif' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

// Partial unique index: enforced only among docs where statut is 'actif', so
// a user can have unlimited closed cycles but never more than one active one
// at a time — guards against a double-submit/retry race creating two.
CycleSchema.index({ userId: 1, statut: 1 }, { unique: true, partialFilterExpression: { statut: 'actif' } })

export const Cycle = models.Cycle || model('Cycle', CycleSchema)
