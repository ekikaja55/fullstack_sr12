// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // untuk validasi tidak boleh sama
  },
  nohp: {
    type: String,
  },
  role: {
    type: String,
    default: 'Agen'
  },
  total_income: {
    type: Number,
    default: 0
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tgl: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
