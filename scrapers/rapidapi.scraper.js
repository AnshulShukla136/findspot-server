import axios from 'axios'
import { normalizeProduct } from '../utils/normalizer.js'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

// ── Amazon via RapidAPI ──
export const searchAmazonRapid = async (query) => {
  try {
    console.log(`🔍 RapidAPI Amazon searching: ${query}`)

    const response = await axios.get(
      'https://real-time-amazon-data.p.rapidapi.com/search',
      {
        params: {
          query,
          page: '1',
          country: 'IN',
          sort_by: 'RELEVANCE',
          product_condition: 'ALL',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
        },
        timeout: 15000,
      }
    )

    const products = response.data?.data?.products || []
    console.log(`✅ RapidAPI Amazon: ${products.length} products found`)

    return products
      .filter(p => p.product_title && p.product_price)
      .slice(0, 8)
      .map(p => {
        const price = parseFloat(
          p.product_price?.replace(/[^0-9.]/g, '') || '0'
        )
        const mrp = parseFloat(
          p.product_original_price?.replace(/[^0-9.]/g, '') || '0'
        ) || price * 1.3

        return normalizeProduct({
          title: p.product_title,
          image: p.product_photo,
          price,
          mrp,
          url: p.product_url,
          rating: parseFloat(p.product_star_rating) || 0,
          reviews: parseInt(p.product_num_ratings?.replace(/[^0-9]/g, '')) || 0,
          inStock: p.is_prime || true,
          delivery: 'Check on Amazon',
        }, 'Amazon')
      })

  } catch (err) {
    console.error('❌ RapidAPI Amazon error:', err.message)
    return []
  }
}

// ── Flipkart via RapidAPI ──
export const searchFlipkartRapid = async (query) => {
  try {
    console.log(`🔍 RapidAPI Flipkart searching: ${query}`)

    const response = await axios.get(
      'https://real-time-flipkart-data.p.rapidapi.com/search',
      {
        params: {
          q: query,
          page: '1',
          sort_by: 'relevance',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'real-time-flipkart-data.p.rapidapi.com',
        },
        timeout: 15000,
      }
    )

    const products = response.data?.products || []
    console.log(`✅ RapidAPI Flipkart: ${products.length} products found`)

    return products
      .filter(p => p.title && p.price)
      .slice(0, 8)
      .map(p => {
        const price = parseFloat(
          String(p.price).replace(/[^0-9.]/g, '') || '0'
        )
        const mrp = parseFloat(
          String(p.original_price || p.mrp || '0').replace(/[^0-9.]/g, '')
        ) || price * 1.3

        return normalizeProduct({
          title: p.title,
          image: p.thumbnail || p.image,
          price,
          mrp,
          url: p.url || p.product_url || 'https://flipkart.com',
          rating: parseFloat(p.rating) || 0,
          reviews: parseInt(
            String(p.rating_count || '0').replace(/[^0-9]/g, '')
          ) || 0,
          inStock: true,
          delivery: 'Check on Flipkart',
        }, 'Flipkart')
      })

  } catch (err) {
    console.error('❌ RapidAPI Flipkart error:', err.message)
    return []
  }
}