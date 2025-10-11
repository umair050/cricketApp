import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invitationAPI } from "../../services/invitationAPI";

// Async Thunks

// Fetch invitations
export const fetchInvitations = createAsyncThunk(
  "invitations/fetchInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await invitationAPI.getInvitations();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch invitations");
    }
  }
);

// Send invitation
export const sendInvitation = createAsyncThunk(
  "invitations/sendInvitation",
  async (invitationData, { rejectWithValue }) => {
    try {
      const newInvitation = await invitationAPI.sendInvitation(invitationData);
      return newInvitation;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send invitation");
    }
  }
);

// Accept invitation
export const acceptInvitation = createAsyncThunk(
  "invitations/acceptInvitation",
  async (invitationId, { rejectWithValue }) => {
    try {
      const updatedInvitation = await invitationAPI.acceptInvitation(
        invitationId
      );
      return updatedInvitation;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to accept invitation");
    }
  }
);

// Reject invitation
export const rejectInvitation = createAsyncThunk(
  "invitations/rejectInvitation",
  async (invitationId, { rejectWithValue }) => {
    try {
      const updatedInvitation = await invitationAPI.rejectInvitation(
        invitationId
      );
      return updatedInvitation;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reject invitation");
    }
  }
);

// Cancel invitation
export const cancelInvitation = createAsyncThunk(
  "invitations/cancelInvitation",
  async (invitationId, { rejectWithValue }) => {
    try {
      const updatedInvitation = await invitationAPI.cancelInvitation(
        invitationId
      );
      return updatedInvitation;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to cancel invitation");
    }
  }
);

// Initial state
const initialState = {
  sent: [],
  received: [],
  loading: false,
  error: null,
};

// Invitation Slice
const invitationSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInvitations: (state) => {
      state.sent = [];
      state.received = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invitations
      .addCase(fetchInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.sent = action.payload.sent || [];
        state.received = action.payload.received || [];
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send invitation
      .addCase(sendInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.loading = false;
        state.sent.push(action.payload);
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Accept invitation
      .addCase(acceptInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.loading = false;
        // Update the invitation in received list
        const index = state.received.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.received[index] = action.payload;
        }
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject invitation
      .addCase(rejectInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectInvitation.fulfilled, (state, action) => {
        state.loading = false;
        // Update the invitation in received list
        const index = state.received.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.received[index] = action.payload;
        }
      })
      .addCase(rejectInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel invitation
      .addCase(cancelInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelInvitation.fulfilled, (state, action) => {
        state.loading = false;
        // Update the invitation in sent list
        const index = state.sent.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.sent[index] = action.payload;
        }
      })
      .addCase(cancelInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectPendingReceivedCount = (state) =>
  state.invitations.received.filter((inv) => inv.status === "PENDING").length;

export const selectPendingSentCount = (state) =>
  state.invitations.sent.filter((inv) => inv.status === "PENDING").length;

export const { clearError, resetInvitations } = invitationSlice.actions;
export default invitationSlice.reducer;
