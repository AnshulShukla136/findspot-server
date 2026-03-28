import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
import { searchAmazonRapid, searchFlipkartRapid } from './rapidapi.scraper.js'

export const scrapeAll = async (query) => {
  console.log(`🕷️ Scraping all platforms for: ${query}`)

  const useRapidAPI = !!process.env.RAPIDAPI_KEY

  if (useRapidAPI) {
    console.log('Using RapidAPI for data...')
    // Run RapidAPI scrapers in parallel
    const results = await Promise.allSettled([
      searchAmazonRapid(query),
      searchFlipkartRapid(query),
    ])

    const allProducts = []
    results.forEach((result, index) => {
      const platforms = ['Amazon', 'Flipkart']
      if (result.status === 'fulfilled') {
        allProducts.push(...result.value)
        console.log(`✅ ${platforms[index]}: ${result.value.length} results`)
      } else {
        console.error(`❌ ${platforms[index]} failed:`, result.reason?.message)
      }
    })

    return allProducts
  }

  // Fallback to direct scrapers
  console.log('Using direct scrapers...')
  const results = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
  ])

  const allProducts = []
  results.forEach((result, index) => {
    const platforms = ['Amazon', 'Flipkart']
    if (result.status === 'fulfilled') {
      allProducts.push(...result.value)
    } else {
      console.error(`❌ ${platforms[index]} failed:`, result.reason?.message)
    }
  })

  return allProducts
}