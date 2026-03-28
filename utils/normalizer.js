export const normalizeProduct = (raw, platform) => {
  const price = parseFloat(raw.price) || 0
  const mrp = parseFloat(raw.mrp) || price
  const discount = raw.discount || calculateDiscount(price, mrp)

  return {
    id: raw.asin || raw.id || generateId(raw.title, platform),
    title: raw.title || '',
    image: raw.image || '',
    price,
    mrp,
    discount,
    platform,
    url: raw.url || '',
    rating: parseFloat(raw.rating) || 0,
    reviews: parseInt(raw.reviews) || 0,
    inStock: raw.inStock !== false,
    delivery: raw.delivery || 'Check on platform',
    badge: raw.badge || null,
    asin: raw.asin || null,
    salesVolume: raw.salesVolume || null,
  }
}

const calculateDiscount = (price, mrp) => {
  if (!price || !mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

const generateId = (title, platform) => {
  return `${platform}-${title?.slice(0, 20).replace(/\s/g, '-').toLowerCase()}-${Date.now()}`
}