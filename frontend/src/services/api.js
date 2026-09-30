/**
 * API Service Layer for YumYumPick
 * Connects Frontend components to FastAPI Backend endpoints:
 * - /api/v1/saved-dishes (Saved dishes management)
 * - /api/v1/dishes (Dish details and random swipe cards)
 */

import { API_BASE_URL } from '../config/api'
const API_BASE = API_BASE_URL

/**
 * Format raw backend saved dish item into standard frontend dish structure
 */
function normalizeSavedDish(item) {
  return {
    id: item.dish_id || item.id,
    dish_id: item.dish_id || item.id,
    saved_id: item.saved_id,
    saved_at: item.saved_at,
    name: item.name,
    english_name: item.english_name || '',
    cuisine: item.cuisine,
    cook_time_minutes: item.cook_time_minutes ?? 25,
    difficulty: item.difficulty || 'Dễ',
    image: item.image || item.image_url || '',
    image_url: item.image_url || item.image || '',
    short_description: item.short_description || '',
    spicy_level: item.spicy_level ?? 0,
    calories_approx: item.calories_approx ?? 400
  }
}

/**
 * Format raw backend dish detail into standard frontend dish structure
 */
function normalizeDishDetail(item) {
  return {
    id: item.id,
    name: item.name,
    english_name: item.english_name || '',
    cuisine: item.cuisine,
    region: item.region || '',
    cook_time_minutes: item.cook_time_minutes ?? 25,
    prep_time_minutes: item.prep_time_minutes ?? 10,
    difficulty: item.difficulty || 'Dễ',
    spicy_level: item.spicy_level ?? 0,
    calories_approx: item.calories_approx ?? 400,
    image: item.image || item.image_url || '',
    image_url: item.image_url || item.image || '',
    short_description: item.short_description || '',
    tips: item.tips || '',
    ingredients: item.ingredients || [],
    steps: item.steps || []
  }
}

export const api = {
  /**
   * Fetch all saved dishes for a user from SQLite DB
   */
  async getSavedDishes(userId = 1) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/saved-dishes/${userId}`)
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        return data.map(normalizeSavedDish)
      }
      return []
    } catch (err) {
      console.error('[API] Failed to fetch saved dishes from backend:', err.message)
      return []
    }
  },

  /**
   * Fetch random dishes from SQLite DB for the Swipe Deck
   * Supports optional filters: cuisine, spicy_level, max_time, limit, exclude_ids
   */
  async getRandomDishes(params = {}) {
    try {
      const query = new URLSearchParams()
      query.append('limit', params.limit || 10)
      if (params.cuisine && params.cuisine !== 'Tất cả') {
        query.append('cuisine', params.cuisine)
      }
      if (params.spicy_level !== undefined && params.spicy_level !== null) {
        query.append('spicy_level', params.spicy_level)
      }
      if (params.max_time) {
        query.append('max_time', params.max_time)
      }
      if (params.difficulty) {
        query.append('difficulty', params.difficulty)
      }
      if (params.exclude_ids) {
        query.append('exclude_ids', params.exclude_ids)
      }
      if (params.user_id) {
        query.append('user_id', params.user_id)
      }

      const url = `${API_BASE}/api/v1/dishes/random?${query.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          english_name: item.english_name || '',
          difficulty: item.difficulty || '',
          cuisine: item.cuisine,
          cook_time_minutes: item.cook_time_minutes ?? 25,
          spicy_level: item.spicy_level ?? 0,
          calories_approx: item.calories_approx ?? 400,
          image: item.image || item.image_url || '',
          image_url: item.image_url || item.image || '',
          short_description: item.short_description || ''
        }))
      }
      return []
    } catch (err) {
      console.error('[API] Failed to fetch random dishes from backend:', err.message)
      return []
    }
  },

  /**
   * Save a dish to SQLite DB for a user
   */
  async saveDish(userId = 1, dishId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/saved-dishes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: Number(userId),
          dish_id: dishId
        })
      })

      if (response.status === 409) {
        // Already saved in DB - treat as success
        return { success: true, alreadySaved: true }
      }

      if (!response.ok) {
        throw new Error(`Failed to save dish (${response.status})`)
      }

      return await response.json()
    } catch (err) {
      console.warn('[API] Failed to save dish to backend:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Delete / Unsave a dish from SQLite DB for a user
   */
  async unsaveDish(userId = 1, dishId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/saved-dishes/${userId}/${dishId}`, {
        method: 'DELETE'
      })

      if (response.status === 404) {
        // Not found in DB, still considered removed on UI
        return { success: true, notFound: true }
      }

      if (!response.ok) {
        throw new Error(`Failed to unsave dish (${response.status})`)
      }

      return await response.json()
    } catch (err) {
      console.warn('[API] Failed to unsave dish from backend:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Record a swiped-left (skipped) dish in SQLite DB
   * This dish will automatically be excluded for 7 days
   */
  async skipDish(userId = 1, dishId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/dishes/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: Number(userId),
          dish_id: dishId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to record skip (${response.status})`)
      }

      return await response.json()
    } catch (err) {
      console.warn('[API] Failed to record skip in backend:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Reset skip history for user in SQLite DB (allow swiping from start)
   */
  async clearSkips(userId = 1) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/dishes/skip/${userId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`Failed to clear skips (${response.status})`)
      }
      return await response.json()
    } catch (err) {
      console.warn('[API] Failed to clear skips in backend:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Fetch complete dish recipe details (ingredients, steps, tips)
   */
  async getDishDetail(dishId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/dishes/${dishId}`)
      if (!response.ok) {
        throw new Error(`Dish detail returned ${response.status}`)
      }
      const data = await response.json()
      return normalizeDishDetail(data)
    } catch (err) {
      console.error('[API] Failed to fetch dish detail from backend:', err.message)
      return null
    }
  }
}
