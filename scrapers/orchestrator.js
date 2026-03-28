import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
import { searchAmazonRapid } from './rapidapi.scraper.js'

export const scrapeAll = async (query) => {
  console.log(`🕷️ Scraping all platforms for: ${query}`)

  let allProducts = []

  // ── Step 1: Try RapidAPI ──
  if (process.env.RAPIDAPI_KEY) {
    console.log('✅ Using RapidAPI...')

    const rapidResults = await Promise.allSettled([
      searchAmazonRapid(query),
    ])

    rapidResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allProducts.push(...result.value)
        console.log(`✅ RapidAPI: ${result.value.length} results`)
      } else {
        console.log('⚠️ RapidAPI returned empty or failed')
      }
    })
  }

  // ── Step 2: ALSO fetch from scrapers (IMPORTANT FIX) ──
  console.log('🧩 Fetching from direct scrapers...')

  const scraperResults = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
  ])

  scraperResults.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      console.log(`✅ Scraper ${i + 1}: ${result.value.length} results`)
      allProducts.push(...result.value)
    } else {
      console.log(`⚠️ Scraper ${i + 1} failed`)
    }
  })

  // ── Step 3: Remove duplicates (VERY IMPORTANT) ──
  const uniqueProducts = []
  const seen = new Set()

  for (const product of allProducts) {
    const key = product.asin || product.url || product.title

    if (!seen.has(key)) {
      seen.add(key)
      uniqueProducts.push(product)
    }
  }

  console.log(`📦 Total unique products: ${uniqueProducts.length}`)

  return uniqueProducts
}