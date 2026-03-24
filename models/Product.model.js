<<<<<<< HEAD
import mongoose from 'mongoose'

const platformDataSchema = new mongoose.Schema({
  platform: String,
  price: Number,
  mrp: Number,
  discount: Number,
  url: String,
  inStock: Boolean,
  delivery: String,
  lastUpdated: { type: Date, default: Date.now },
})

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: String,
  category: String,
  images: [String],
  description: String,
  rating: Number,
  reviews: Number,
  platforms: [platformDataSchema],
  specs: [{ label: String, value: String }],
  searchKeywords: [String],
}, { timestamps: true })

productSchema.index({ title: 'text', searchKeywords: 'text' })

=======
import mongoose from 'mongoose'

const platformDataSchema = new mongoose.Schema({
  platform: String,
  price: Number,
  mrp: Number,
  discount: Number,
  url: String,
  inStock: Boolean,
  delivery: String,
  lastUpdated: { type: Date, default: Date.now },
})

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: String,
  category: String,
  images: [String],
  description: String,
  rating: Number,
  reviews: Number,
  platforms: [platformDataSchema],
  specs: [{ label: String, value: String }],
  searchKeywords: [String],
}, { timestamps: true })

productSchema.index({ title: 'text', searchKeywords: 'text' })

>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
export default mongoose.model('Product', productSchema)