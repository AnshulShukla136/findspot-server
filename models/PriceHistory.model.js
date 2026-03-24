<<<<<<< HEAD
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

=======
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

>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
export default mongoose.model('PriceHistory', priceHistorySchema)