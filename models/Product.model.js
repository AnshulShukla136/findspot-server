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

export default mongoose.model('Product', productSchema)