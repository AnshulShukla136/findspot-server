
// Normalizes scraped data from different platforms into one unified schema
export const normalizeProduct = (raw, platform) => {
  return {
    title: raw.title || '',
    image: raw.image || '',
    price: parseFloat(raw.price) || 0,
    mrp: parseFloat(raw.mrp) || parseFloat(raw.price) || 0,
    discount: raw.discount || calculateDiscount(raw.price, raw.mrp),
    platform,
    url: raw.url || '',
    rating: parseFloat(raw.rating) || 0,
    reviews: parseInt(raw.reviews) || 0,
    inStock: raw.inStock !== false,
    delivery: raw.delivery || 'Check on platform',
  }
}

const calculateDiscount = (price, mrp) => {
  if (!price || !mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}