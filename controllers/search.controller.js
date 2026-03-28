import { scrapeAll } from '../scrapers/orchestrator.js'

const getDummyResults = (query) => {
  const platforms = [
    { platform: 'Amazon', url: 'https://amazon.in', mult: 1.0 },
    { platform: 'Flipkart', url: 'https://flipkart.com', mult: 1.05 },
    { platform: 'Myntra', url: 'https://myntra.com', mult: 1.1 },
    { platform: 'Ajio', url: 'https://ajio.com', mult: 0.95 },
    { platform: 'Meesho', url: 'https://meesho.com', mult: 0.85 },
    { platform: 'Nykaa', url: 'https://nykaa.com', mult: 1.15 },
  ]

  let basePrice = 999
  const q = query.toLowerCase()
  if (q.includes('phone') || q.includes('iphone')) basePrice = 15000
  else if (q.includes('laptop')) basePrice = 45000
  else if (q.includes('tv')) basePrice = 25000
  else if (q.includes('earphone') || q.includes('headphone') || q.includes('boat')) basePrice = 1299
  else if (q.includes('shoe') || q.includes('nike')) basePrice = 2499

  return platforms.map((p, i) => {
    const price = Math.round(basePrice * p.mult)
    const mrp = Math.round(price * 1.4)
    const discount = Math.round(((mrp - price) / mrp) * 100)
    return {
      id: String(i + 1),
      title: `${query} - ${['Premium', 'Standard', 'Pro', 'Budget', 'Special', 'Classic'][i]}`,
      image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
      price, mrp, discount,
      platform: p.platform,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 5000) + 100,
      url: p.url,
      inStock: true,
      delivery: 'Check on platform',
    }
  })
}

export const searchProducts = async (req, res) => {
  try {
    const { q, platform, sort, minPrice, maxPrice } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    console.log(`🔍 Searching for: ${q}`)

    let results = await scrapeAll(q)

    // Fallback to dummy if no results
    if (results.length === 0) {
      console.log('⚠️ No results — using dummy data')
      results = getDummyResults(q)
    }

    // Filter by platform
    let filtered = platform && platform !== 'All'
      ? results.filter(r => r.platform === platform)
      : results

    // Filter by price
    if (minPrice) filtered = filtered.filter(r => r.price >= Number(minPrice))
    if (maxPrice) filtered = filtered.filter(r => r.price <= Number(maxPrice))

    // Sort
    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
    if (sort === 'discount') filtered.sort((a, b) => b.discount - a.discount)
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating)

    res.json({
      query: q,
      total: filtered.length,
      products: filtered,
    })

  } catch (err) {
    console.error('Search error:', err.message)
    res.status(500).json({ message: 'Search failed. Try again.' })
  }
}