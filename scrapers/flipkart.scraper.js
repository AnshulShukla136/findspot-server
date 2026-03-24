import axios from 'axios'
import * as cheerio from 'cheerio'
import { normalizeProduct } from '../utils/normalizer.js'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
}

export const scrapeFlipkart = async (query) => {
  try {
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`
    console.log('🔍 Scraping Flipkart:', url)

    const { data } = await axios.get(url, {
      headers: HEADERS,
      timeout: 15000,
      maxRedirects: 5,
    })

    console.log('📄 Flipkart HTML length:', data.length)

    const $ = cheerio.load(data)
    const products = []

    // Check if blocked
    if (data.length < 5000) {
      console.log('❌ Flipkart blocked the request')
      return []
    }

    // Try multiple selectors as Flipkart changes them often
    const selectors = [
      '._1AtVbE',
      '._2kHMtA',
      '.CXW8mj',
      '._75nlfW',
      '[data-id]',
    ]

    let items = $([])
    for (const selector of selectors) {
      const found = $(selector)
      if (found.length > 2) {
        items = found
        console.log(`Flipkart selector matched: ${selector} (${found.length} items)`)
        break
      }
    }

    items.each((i, el) => {
      if (i >= 8) return

      // Try multiple title selectors
      const title =
        $(el).find('._4rR01T').text().trim() ||
        $(el).find('.s1Q9rs').text().trim() ||
        $(el).find('.IRpwTa').text().trim() ||
        $(el).find('a[title]').attr('title') ||
        $(el).find('img').attr('alt') || ''

      // Try multiple image selectors
      const image =
        $(el).find('img._396cs4').attr('src') ||
        $(el).find('img._2r_T1I').attr('src') ||
        $(el).find('img').first().attr('src') || ''

      // Try multiple price selectors
      const priceText =
        $(el).find('._30jeq3').first().text() ||
        $(el).find('._1_WHN1').first().text() ||
        $(el).find('._25b18').first().text() || ''

      const mrpText =
        $(el).find('._3I9_wc').first().text() ||
        $(el).find('._27UcVY').first().text() ||
        $(el).find('._3auQ3N').first().text() || ''

      const ratingText =
        $(el).find('._3LWZlK').first().text() ||
        $(el).find('._1lRcqv').first().text() || '0'

      const href =
        $(el).find('a._1fQZEK').attr('href') ||
        $(el).find('a.s1Q9rs').attr('href') ||
        $(el).find('a').first().attr('href') || ''

      if (!title || !priceText) return

      const price = parseFloat(priceText.replace(/[₹,]/g, '').trim())
      const mrp = parseFloat(mrpText.replace(/[₹,]/g, '').trim()) || price * 1.2
      const rating = parseFloat(ratingText) || 0

      if (isNaN(price) || price <= 0) return

      products.push(normalizeProduct({
        title,
        image,
        price,
        mrp,
        url: href ? `https://www.flipkart.com${href}` : 'https://flipkart.com',
        rating,
        inStock: true,
        delivery: 'Free delivery available',
      }, 'Flipkart'))
    })

    console.log(`✅ Flipkart: ${products.length} products found`)
    return products

  } catch (err) {
    console.error('❌ Flipkart scraper error:', err.message)
    return []
  }
}