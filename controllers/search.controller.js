import { scrapeAll } from '../scrapers/orchestrator.js'

export const searchProducts = async (req, res) => {
  try {
    const { q, platform, sort, minPrice, maxPrice } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    console.log(`🔍 Searching for: ${q}`)

    let results = await scrapeAll(q)

    if (results.length === 0) {
      console.log('⚠️ No results — returning empty array')
      results = []
    }

    // ✅ Platform filter
    let filtered =
      platform && platform !== 'All'
        ? results.filter(r => r.platform === platform)
        : results

    // ✅ FIX: price filter (DO NOT remove null prices)
    if (minPrice) {
      filtered = filtered.filter(r =>
        r.price == null || r.price >= Number(minPrice)
      )
    }

    if (maxPrice) {
      filtered = filtered.filter(r =>
        r.price == null || r.price <= Number(maxPrice)
      )
    }

    // ✅ Sort only products WITH price
    if (sort) {
      const withPrice = filtered.filter(p => p.price != null)
      const withoutPrice = filtered.filter(p => p.price == null)

      if (sort === 'price_asc') {
        withPrice.sort((a, b) => a.price - b.price)
      }

      if (sort === 'price_desc') {
        withPrice.sort((a, b) => b.price - a.price)
      }

      if (sort === 'discount') {
        withPrice.sort((a, b) => b.discount - a.discount)
      }

      if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating)
        return res.json({
          query: q,
          total: filtered.length,
          products: filtered,
        })
      }

      // ✅ Combine back (keep iPhones etc.)
      filtered = [...withPrice, ...withoutPrice]
    }

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