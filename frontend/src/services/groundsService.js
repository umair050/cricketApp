import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const GROUNDS_URL = `${API_URL}/grounds`;

// Get auth token from cookies (same as other services)
const getAuthHeader = () => {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const groundsService = {
  // ==================== GROUND MANAGEMENT ====================

  // Create new ground
  createGround: async (groundData) => {
    const response = await axios.post(GROUNDS_URL, groundData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get all grounds with filters
  getGrounds: async (filters = {}) => {
    const response = await axios.get(GROUNDS_URL, {
      params: filters,
    });
    return response.data;
  },

  // Get ground by ID
  getGroundById: async (id) => {
    const response = await axios.get(`${GROUNDS_URL}/${id}`);
    return response.data;
  },

  // Get grounds owned by current user
  getMyGrounds: async () => {
    const response = await axios.get(`${GROUNDS_URL}/owner/my-grounds`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update ground
  updateGround: async (id, updates) => {
    const response = await axios.patch(`${GROUNDS_URL}/${id}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Delete ground
  deleteGround: async (id) => {
    const response = await axios.delete(`${GROUNDS_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // ==================== AVAILABILITY ====================

  // Check if slot is available
  checkAvailability: async (availabilityData) => {
    const response = await axios.post(
      `${GROUNDS_URL}/availability/check`,
      availabilityData
    );
    return response.data;
  },

  // Get ground availability for a specific date
  getGroundAvailability: async (groundId, date) => {
    const response = await axios.get(
      `${GROUNDS_URL}/${groundId}/availability`,
      {
        params: { date },
      }
    );
    return response.data;
  },

  // Get booked slots for a ground (public - no auth required)
  getBookedSlots: async (groundId, startDate, endDate) => {
    const response = await axios.get(
      `${GROUNDS_URL}/${groundId}/booked-slots`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  // Block slots (owner only)
  blockSlots: async (groundId, slotData) => {
    const response = await axios.post(
      `${GROUNDS_URL}/${groundId}/block-slots`,
      slotData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // ==================== BOOKING MANAGEMENT ====================

  // Create booking
  createBooking: async (bookingData) => {
    const response = await axios.post(`${GROUNDS_URL}/bookings`, bookingData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await axios.get(`${GROUNDS_URL}/bookings/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await axios.get(
      `${GROUNDS_URL}/bookings/user/my-bookings`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Get bookings for a ground (owner only)
  getGroundBookings: async (groundId) => {
    const response = await axios.get(`${GROUNDS_URL}/${groundId}/bookings`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update booking status
  updateBooking: async (id, updates) => {
    const response = await axios.patch(
      `${GROUNDS_URL}/bookings/${id}`,
      updates,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await axios.post(
      `${GROUNDS_URL}/bookings/${id}/cancel`,
      { reason },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // ==================== PAYMENT ====================

  // Create payment
  createPayment: async (paymentData) => {
    const response = await axios.post(`${GROUNDS_URL}/payments`, paymentData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentId, transactionData) => {
    const response = await axios.post(
      `${GROUNDS_URL}/payments/${paymentId}/confirm`,
      transactionData,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // ==================== STATISTICS ====================

  // Get ground statistics (owner only)
  getGroundStats: async (groundId) => {
    const response = await axios.get(`${GROUNDS_URL}/${groundId}/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default groundsService;
