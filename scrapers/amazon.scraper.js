import axios from 'axios'
import * as cheerio from 'cheerio'
import { normalizeProduct } from '../utils/normalizer.js'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
}

export const scrapeAmazon = async (query) => {
  try {
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`
    console.log('🔍 Scraping Amazon:', url)

    const { data } = await axios.get(url, {
      headers: HEADERS,
      timeout: 15000,
      maxRedirects: 5,
    })

    console.log('📄 Amazon HTML length:', data.length)

    const $ = cheerio.load(data)
    const products = []

    // Check if blocked
    if (data.includes('Type the characters you see in this image') ||
        data.includes('Enter the characters you see below') ||
        data.length < 5000) {
      console.log('❌ Amazon blocked the request (CAPTCHA)')
      return []
    }

    $('[data-component-type="s-search-result"]').each((i, el) => {
      if (i >= 8) return

      const title = $(el).find('h2 span').text().trim()
      const image = $(el).find('.s-image').attr('src')
      const priceWhole = $(el)
        .find('.a-price-whole').first()
        .text().replace(/[,\.]/g, '').trim()
      const mrpText = $(el)
        .find('.a-text-price .a-offscreen').first()
        .text().replace(/[₹,]/g, '').trim()
      const ratingText = $(el)
        .find('.a-icon-star-small .a-icon-alt').text()
      const reviewsText = $(el)
        .find('[aria-label*="ratings"]').attr('aria-label') || '0'
      const href = $(el).find('h2 a').attr('href')

      if (!title || !priceWhole) return

      const price = parseFloat(priceWhole)
      const mrp = parseFloat(mrpText) || price * 1.2
      const rating = parseFloat(ratingText) || 0
      const reviews = parseInt(reviewsText.replace(/[^0-9]/g, '')) || 0

      if (isNaN(price) || price <= 0) return

      products.push(normalizeProduct({
        title,
        image: image || '',
        price,
        mrp,
        url: href ? `https://www.amazon.in${href}` : 'https://amazon.in',
        rating,
        reviews,
        inStock: true,
      }, 'Amazon'))
    })

    console.log(`✅ Amazon: ${products.length} products found`)
    return products

  } catch (err) {
    console.error('❌ Amazon scraper error:', err.message)
    return []
  }
}