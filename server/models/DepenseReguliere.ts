import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const DepenseReguliereSchema = new Schema({
  nom: { type: String, required: true },
  montantParDefaut: { type: Number, required: true },
  categorie: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

DepenseReguliereSchema.index({ userId: 1 })

export const DepenseReguliere = models.DepenseReguliere || model('DepenseReguliere', DepenseReguliereSchema)
