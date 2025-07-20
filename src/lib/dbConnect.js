// src/lib/dbConnect.js
import mongoose from 'mongoose'

let isConnected = false

export const dbConnect = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'db_sr12',
    })

    isConnected = true
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
  }
}
