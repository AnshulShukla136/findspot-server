import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
import { searchAmazonRapid } from './rapidapi.scraper.js'

export const scrapeAll = async (query) => {
  console.log(`🕷️ Scraping all platforms for: ${query}`)

  // Use RapidAPI if key is available
  if (process.env.RAPIDAPI_KEY) {
    console.log('✅ Using RapidAPI...')

    const results = await Promise.allSettled([
      searchAmazonRapid(query),
    ])

    const allProducts = []
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allProducts.push(...result.value)
        console.log(`✅ Amazon: ${result.value.length} real results`)
      } else {
        console.error(`❌ Amazon RapidAPI failed`)
      }
    })

    if (allProducts.length > 0) return allProducts
    console.log('⚠️ RapidAPI returned 0 — trying direct scrapers')
  }

  // Fallback to direct scrapers
  const results = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
  ])

  const allProducts = []
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allProducts.push(...result.value)
    }
  })

  return allProducts
}