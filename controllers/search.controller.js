<<<<<<< HEAD
import { scrapeAll } from '../scrapers/orchestrator.js'

const getDummyResults = (query) => [
  {
    id: '1',
    title: `${query} - Premium Edition`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 1299, mrp: 3990, discount: 67,
    platform: 'Amazon', rating: 4.2, reviews: 2341,
    url: 'https://amazon.in', inStock: true,
    delivery: 'Free delivery tomorrow'
  },
  {
    id: '2',
    title: `${query} - Standard Pack`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 999, mrp: 2499, discount: 60,
    platform: 'Flipkart', rating: 4.0, reviews: 1820,
    url: 'https://flipkart.com', inStock: true,
    delivery: 'Free delivery in 2 days'
  },
  {
    id: '3',
    title: `${query} - Pro Version`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 2199, mrp: 4999, discount: 56,
    platform: 'Myntra', rating: 4.5, reviews: 980,
    url: 'https://myntra.com', inStock: true,
    delivery: 'Delivery in 3-4 days'
  },
  {
    id: '4',
    title: `${query} - Budget Pick`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 799, mrp: 1499, discount: 47,
    platform: 'Meesho', rating: 3.9, reviews: 540,
    url: 'https://meesho.com', inStock: true,
    delivery: 'Delivery in 5-7 days'
  },
  {
    id: '5',
    title: `${query} - Special Edition`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 3499, mrp: 6999, discount: 50,
    platform: 'Amazon', rating: 4.6, reviews: 4210,
    url: 'https://amazon.in', inStock: true,
    delivery: 'Free delivery tomorrow'
  },
  {
    id: '6',
    title: `${query} - Lite Version`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 599, mrp: 1299, discount: 54,
    platform: 'Ajio', rating: 4.1, reviews: 760,
    url: 'https://ajio.com', inStock: true,
    delivery: 'Delivery in 2-3 days'
  },
  {
    id: '7',
    title: `${query} - Luxury Range`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 5999, mrp: 9999, discount: 40,
    platform: 'Nykaa', rating: 4.7, reviews: 1230,
    url: 'https://nykaa.com', inStock: true,
    delivery: 'Delivery in 3-5 days'
  },
  {
    id: '8',
    title: `${query} - Classic Series`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 1599, mrp: 2999, discount: 47,
    platform: 'Flipkart', rating: 4.3, reviews: 890,
    url: 'https://flipkart.com', inStock: true,
    delivery: 'Free delivery in 2 days'
  },
]

export const searchProducts = async (req, res) => {
  try {
    const { q, platform, sort, minPrice, maxPrice } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    console.log(`🔍 Searching for: ${q}`)

    let results = await scrapeAll(q)

    // Fallback to dummy data if scrapers return nothing
    if (results.length === 0) {
      console.log('⚠️ Scrapers returned 0 results — using dummy data')
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
=======
import { scrapeAll } from '../scrapers/orchestrator.js'

const getDummyResults = (query) => [
  {
    id: '1',
    title: `${query} - Premium Edition`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 1299, mrp: 3990, discount: 67,
    platform: 'Amazon', rating: 4.2, reviews: 2341,
    url: 'https://amazon.in', inStock: true,
    delivery: 'Free delivery tomorrow'
  },
  {
    id: '2',
    title: `${query} - Standard Pack`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 999, mrp: 2499, discount: 60,
    platform: 'Flipkart', rating: 4.0, reviews: 1820,
    url: 'https://flipkart.com', inStock: true,
    delivery: 'Free delivery in 2 days'
  },
  {
    id: '3',
    title: `${query} - Pro Version`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 2199, mrp: 4999, discount: 56,
    platform: 'Myntra', rating: 4.5, reviews: 980,
    url: 'https://myntra.com', inStock: true,
    delivery: 'Delivery in 3-4 days'
  },
  {
    id: '4',
    title: `${query} - Budget Pick`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 799, mrp: 1499, discount: 47,
    platform: 'Meesho', rating: 3.9, reviews: 540,
    url: 'https://meesho.com', inStock: true,
    delivery: 'Delivery in 5-7 days'
  },
  {
    id: '5',
    title: `${query} - Special Edition`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 3499, mrp: 6999, discount: 50,
    platform: 'Amazon', rating: 4.6, reviews: 4210,
    url: 'https://amazon.in', inStock: true,
    delivery: 'Free delivery tomorrow'
  },
  {
    id: '6',
    title: `${query} - Lite Version`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 599, mrp: 1299, discount: 54,
    platform: 'Ajio', rating: 4.1, reviews: 760,
    url: 'https://ajio.com', inStock: true,
    delivery: 'Delivery in 2-3 days'
  },
  {
    id: '7',
    title: `${query} - Luxury Range`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 5999, mrp: 9999, discount: 40,
    platform: 'Nykaa', rating: 4.7, reviews: 1230,
    url: 'https://nykaa.com', inStock: true,
    delivery: 'Delivery in 3-5 days'
  },
  {
    id: '8',
    title: `${query} - Classic Series`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 1599, mrp: 2999, discount: 47,
    platform: 'Flipkart', rating: 4.3, reviews: 890,
    url: 'https://flipkart.com', inStock: true,
    delivery: 'Free delivery in 2 days'
  },
]

export const searchProducts = async (req, res) => {
  try {
    const { q, platform, sort, minPrice, maxPrice } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    console.log(`🔍 Searching for: ${q}`)

    let results = await scrapeAll(q)

    // Fallback to dummy data if scrapers return nothing
    if (results.length === 0) {
      console.log('⚠️ Scrapers returned 0 results — using dummy data')
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
>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
}