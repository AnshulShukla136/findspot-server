import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
import { searchAmazonRapid } from './rapidapi.scraper.js'

const cache = new Map()

export const scrapeAll = async (query) => {
  console.log(`🕷️ Searching: ${query}`)

  // ✅ 1. Cache check
  if (cache.has(query)) {
    console.log('⚡ Cache hit')
    return cache.get(query)
  }

  let allProducts = []

  // ✅ 2. FAST: RapidAPI
  try {
    const rapidResults = await searchAmazonRapid(query)
    allProducts = rapidResults
    console.log(`⚡ RapidAPI returned ${rapidResults.length}`)
  } catch (err) {
    console.log('❌ RapidAPI failed')
  }

  // ✅ 3. Send response immediately (important)
  cache.set(query, allProducts)

  // ✅ 4. Background scraping (DO NOT await)
  setTimeout(async () => {
    console.log('🧩 Running background scrapers...')

    try {
      const results = await Promise.allSettled([
        scrapeAmazon(query),
        scrapeFlipkart(query),
      ])

      let extra = []

      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          extra.push(...r.value)
        }
      })

      // Merge + dedupe
      const merged = [...allProducts, ...extra]
      const unique = []
      const seen = new Set()

      for (const p of merged) {
        const key = p.asin || p.url || p.title
        if (!seen.has(key)) {
          seen.add(key)
          unique.push(p)
        }
      }

      cache.set(query, unique)
      console.log(`✅ Cache updated: ${unique.length} items`)

    } catch (err) {
      console.log('❌ Background scraping failed')
    }

  }, 0)

  return allProducts
}