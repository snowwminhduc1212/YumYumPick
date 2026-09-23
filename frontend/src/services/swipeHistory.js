/**
 * Quản lý lịch sử quẹt món ăn (Swipe History) trong localStorage
 * Đảm bảo các món đã lướt qua sẽ không xuất hiện lại trong vòng 7 ngày (1 tuần).
 */

const SWIPED_HISTORY_KEY = 'yumyum_swiped_history'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000 // 7 ngày tính bằng milliseconds

export const swipeHistory = {
  /**
   * Lấy danh sách ID các món đã quẹt trong vòng 7 ngày qua.
   * Tự động dọn dẹp các món đã quẹt quá 7 ngày khỏi localStorage.
   * @returns {string[]} Danh sách dish_id cần loại trừ (exclude_ids)
   */
  getExcludedDishIds() {
    try {
      const raw = localStorage.getItem(SWIPED_HISTORY_KEY)
      if (!raw) return []

      const history = JSON.parse(raw)
      const now = Date.now()
      const activeIds = []
      const updatedHistory = {}
      let hasExpired = false

      for (const [dishId, timestamp] of Object.entries(history)) {
        if (now - Number(timestamp) < SEVEN_DAYS_MS) {
          activeIds.push(dishId)
          updatedHistory[dishId] = timestamp
        } else {
          // Món đã quá 7 ngày -> cho phép xuất hiện lại
          hasExpired = true
        }
      }

      // Nếu có món đã hết hạn 7 ngày, cập nhật lại localStorage để giải phóng bộ nhớ
      if (hasExpired) {
        localStorage.setItem(SWIPED_HISTORY_KEY, JSON.stringify(updatedHistory))
      }

      return activeIds
    } catch (err) {
      console.warn('[swipeHistory] Lỗi khi đọc lịch sử quẹt:', err)
      return []
    }
  },

  /**
   * Lưu 1 món vào lịch sử quẹt (dù Like hay Skip) kèm timestamp hiện tại.
   * @param {string} dishId - Mã định danh món ăn (vd: 'dish_vn_001')
   */
  recordSwipe(dishId) {
    if (!dishId) return
    try {
      const raw = localStorage.getItem(SWIPED_HISTORY_KEY)
      const history = raw ? JSON.parse(raw) : {}
      history[dishId] = Date.now()
      localStorage.setItem(SWIPED_HISTORY_KEY, JSON.stringify(history))
    } catch (err) {
      console.warn('[swipeHistory] Lỗi khi lưu lịch sử quẹt:', err)
    }
  },

  /**
   * Xóa toàn bộ lịch sử quẹt để người dùng có thể bắt đầu lại từ đầu
   * (khi đã lướt hết toàn bộ kho món ăn).
   */
  clearHistory() {
    try {
      localStorage.removeItem(SWIPED_HISTORY_KEY)
    } catch (err) {
      console.warn('[swipeHistory] Lỗi khi xóa lịch sử quẹt:', err)
    }
  }
}
