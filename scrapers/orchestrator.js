<<<<<<< HEAD
import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const scrapeAll = async (query) => {
  console.log(`🕷️ Scraping all platforms for: ${query}`)

  // Run all scrapers in parallel
  const results = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
    // scrapeMytra(query),   // add later
    // scrapeAjio(query),    // add later
  ])

  const allProducts = []

  results.forEach((result, index) => {
    const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio']
    if (result.status === 'fulfilled') {
      allProducts.push(...result.value)
      console.log(`✅ ${platforms[index]}: ${result.value.length} results`)
    } else {
      console.error(`❌ ${platforms[index]} failed:`, result.reason?.message)
    }
  })

  return allProducts
=======
import { scrapeAmazon } from './amazon.scraper.js'
import { scrapeFlipkart } from './flipkart.scraper.js'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const scrapeAll = async (query) => {
  console.log(`🕷️ Scraping all platforms for: ${query}`)

  // Run all scrapers in parallel
  const results = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
    // scrapeMytra(query),   // add later
    // scrapeAjio(query),    // add later
  ])

  const allProducts = []

  results.forEach((result, index) => {
    const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio']
    if (result.status === 'fulfilled') {
      allProducts.push(...result.value)
      console.log(`✅ ${platforms[index]}: ${result.value.length} results`)
    } else {
      console.error(`❌ ${platforms[index]} failed:`, result.reason?.message)
    }
  })

  return allProducts
>>>>>>> e49221474f114a779c286c41770d1ac46fa7ad76
}