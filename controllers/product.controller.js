
import Product from '../models/Product.model.js'
import PriceHistory from '../models/PriceHistory.model.js'

// @GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const priceHistory = await PriceHistory.find({
      productId: product._id
    }).sort({ date: 1 }).limit(30)

    res.json({ product, priceHistory })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}