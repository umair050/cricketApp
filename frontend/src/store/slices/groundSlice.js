import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groundsService from "../../services/groundsService";

// Async thunks
export const fetchGrounds = createAsyncThunk(
  "grounds/fetchGrounds",
  async (filters, { rejectWithValue }) => {
    try {
      return await groundsService.getGrounds(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchGroundById = createAsyncThunk(
  "grounds/fetchGroundById",
  async (id, { rejectWithValue }) => {
    try {
      return await groundsService.getGroundById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyGrounds = createAsyncThunk(
  "grounds/fetchMyGrounds",
  async (_, { rejectWithValue }) => {
    try {
      return await groundsService.getMyGrounds();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createGround = createAsyncThunk(
  "grounds/createGround",
  async (groundData, { rejectWithValue }) => {
    try {
      return await groundsService.createGround(groundData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateGround = createAsyncThunk(
  "grounds/updateGround",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await groundsService.updateGround(id, updates);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "grounds/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      return await groundsService.getMyBookings();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  "grounds/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      return await groundsService.createBooking(bookingData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "grounds/cancelBooking",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await groundsService.cancelBooking(id, reason);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const groundSlice = createSlice({
  name: "grounds",
  initialState: {
    grounds: [],
    myGrounds: [],
    currentGround: null,
    myBookings: [],
    currentBooking: null,
    pagination: {
      total: 0,
      page: 1,
      totalPages: 1,
    },
    filters: {
      city: "",
      state: "",
      pitchType: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      search: "",
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        city: "",
        state: "",
        pitchType: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        search: "",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGround: (state) => {
      state.currentGround = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Grounds
      .addCase(fetchGrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.grounds = action.payload.grounds;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Ground by ID
      .addCase(fetchGroundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroundById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGround = action.payload;
      })
      .addCase(fetchGroundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Grounds
      .addCase(fetchMyGrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.myGrounds = action.payload;
      })
      .addCase(fetchMyGrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Ground
      .addCase(createGround.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGround.fulfilled, (state, action) => {
        state.loading = false;
        state.myGrounds.push(action.payload);
      })
      .addCase(createGround.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Ground
      .addCase(updateGround.fulfilled, (state, action) => {
        const index = state.myGrounds.findIndex(
          (g) => g.id === action.payload.id
        );
        if (index !== -1) {
          state.myGrounds[index] = action.payload;
        }
        if (state.currentGround?.id === action.payload.id) {
          state.currentGround = action.payload;
        }
      })

      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.myBookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.myBookings.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.myBookings[index] = action.payload;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentGround } =
  groundSlice.actions;
export default groundSlice.reducer;
