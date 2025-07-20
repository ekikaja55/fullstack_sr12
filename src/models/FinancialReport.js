// src/models/FinancialReport.js
import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true })

export default mongoose.models.FinancialReport || mongoose.model('FinancialReport', reportSchema)