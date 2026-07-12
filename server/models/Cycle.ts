import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const CycleSchema = new Schema({
  dateDebut: { type: Date, required: true },
  dateFinPrevue: { type: Date, required: true },
  revenuTotal: { type: Number, required: true },
  statut: { type: String, enum: ['actif', 'cloture'], default: 'actif' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const Cycle = models.Cycle || model('Cycle', CycleSchema)
