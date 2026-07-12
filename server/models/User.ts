import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { timestamps: true })

export const User = models.User || model('User', UserSchema)
