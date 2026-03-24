import mongoose from 'mongoose'

const priceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', required: true
  },
  platform: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

export default mongoose.model('PriceHistory', priceHistorySchema)