import axios from 'axios'
import { normalizeProduct } from '../utils/normalizer.js'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const AMAZON_HOST = 'real-time-amazon-data.p.rapidapi.com'

// ── Amazon Search ──
export const searchAmazonRapid = async (query) => {
  try {
    console.log(`🔍 RapidAPI Amazon searching: ${query}`)

    const response = await axios.get(
      `https://${AMAZON_HOST}/search`,
      {
        params: {
          query,
          page: '1',
          country: 'IN',
          sort_by: 'RELEVANCE',
          product_condition: 'ALL',
          language: 'en_IN',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': AMAZON_HOST,
        },
        timeout: 15000,
      }
    )

    const products = response.data?.data?.products || []
    console.log(`✅ Amazon RapidAPI: ${products.length} products found`)

    return products
      .filter(p => p.product_title && p.product_price)
      .slice(0, 10)
      .map(p => {
        // ✅ exact field names from your response
        const price = parseFloat(
          String(p.product_price).replace(/[₹,]/g, '').trim()
        ) || 0

        const mrp = parseFloat(
          String(p.product_original_price || '0').replace(/[₹,]/g, '').trim()
        ) || Math.round(price * 1.3)

        const discount = mrp > price
          ? Math.round(((mrp - price) / mrp) * 100)
          : 0

        return normalizeProduct({
          title: p.product_title,
          image: p.product_photo,
          price,
          mrp,
          discount,
          url: p.product_url,
          rating: parseFloat(p.product_star_rating) || 0,
          reviews: parseInt(p.product_num_ratings) || 0,
          inStock: true,
          delivery: p.delivery?.split('Or')[0]?.trim() || 'Check on Amazon',
          badge: p.is_amazon_choice ? 'Amazon Choice' :
                 p.is_best_seller ? 'Best Seller' : null,
          asin: p.asin,
          salesVolume: p.sales_volume || null,
        }, 'Amazon')
      })

  } catch (err) {
    console.error('❌ Amazon RapidAPI error:', err.message)
    return []
  }
}

// ── Amazon Best Sellers / Deals ──
export const getAmazonBestSellers = async () => {
  try {
    console.log('🔍 Fetching Amazon best sellers...')

    const response = await axios.get(
      `https://${AMAZON_HOST}/best-sellers`,
      {
        params: {
          category: 'electronics',
          country: 'IN',
          language: 'en_IN',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': AMAZON_HOST,
        },
        timeout: 15000,
      }
    )

    const products = response.data?.data?.best_sellers || []
    console.log(`✅ Amazon best sellers: ${products.length} found`)

    return products
      .filter(p => p.product_title && p.product_price)
      .slice(0, 8)
      .map(p => {
        const price = parseFloat(
          String(p.product_price).replace(/[₹,]/g, '').trim()
        ) || 0

        const mrp = parseFloat(
          String(p.product_original_price || '0').replace(/[₹,]/g, '').trim()
        ) || Math.round(price * 1.3)

        const discount = mrp > price
          ? Math.round(((mrp - price) / mrp) * 100)
          : 0

        return normalizeProduct({
          title: p.product_title,
          image: p.product_photo,
          price,
          mrp,
          discount,
          url: p.product_url,
          rating: parseFloat(p.product_star_rating) || 0,
          reviews: parseInt(p.product_num_ratings) || 0,
          inStock: true,
          delivery: 'Check on Amazon',
          asin: p.asin,
        }, 'Amazon')
      })

  } catch (err) {
    console.error('❌ Amazon best sellers error:', err.message)
    return []
  }
}

// ── Amazon Product Details by ASIN ──
export const getAmazonProductDetails = async (asin) => {
  try {
    console.log(`🔍 Fetching Amazon product: ${asin}`)

    const response = await axios.get(
      `https://${AMAZON_HOST}/product-details`,
      {
        params: {
          asin,
          country: 'IN',
          language: 'en_IN',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': AMAZON_HOST,
        },
        timeout: 15000,
      }
    )

    return response.data?.data || null

  } catch (err) {
    console.error('❌ Amazon product details error:', err.message)
    return null
  }
}