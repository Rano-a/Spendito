import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const TransactionSchema = new Schema({
  montant: { type: Number, required: true },
  montantPrevu: { type: Number },
  type: {
    type: String,
    enum: ['depense_variable', 'depense_fixe', 'epargne', 'revenu'],
    default: 'depense_variable',
    required: true
  },
  categorie: { type: String, default: '' },
  note: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  paye: { type: Boolean, default: false },
  cycleId: { type: Schema.Types.ObjectId, ref: 'Cycle', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

// Covers the `{ userId, cycleId }` filter every dashboard/journal load queries by.
TransactionSchema.index({ userId: 1, cycleId: 1 })

export const Transaction = models.Transaction || model('Transaction', TransactionSchema)
