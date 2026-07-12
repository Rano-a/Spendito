import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const CategorieSchema = new Schema({
  nom: { type: String, required: true },
  parDefaut: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

CategorieSchema.index({ userId: 1, nom: 1 }, { unique: true })

export const Categorie = models.Categorie || model('Categorie', CategorieSchema)
