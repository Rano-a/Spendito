import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const ProjetEpargneSchema = new Schema({
  nom: { type: String, required: true },
  montantCible: { type: Number, required: true },
  montantActuel: { type: Number, default: 0 },
  icone: { type: String, default: 'PiggyBank' },
  couleur: { type: String, default: '#6366f1' },
  principal: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const ProjetEpargne = models.ProjetEpargne || model('ProjetEpargne', ProjetEpargneSchema)
