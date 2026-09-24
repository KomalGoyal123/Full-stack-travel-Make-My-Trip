import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Refund {
  bookingId: string;
  userId: string;
  reason: string;
  amount: number; 
  status: "PENDING" | "PROCESSED" | "COMPLETED";
  timeline: string;
  createdAt: string;
}

interface CancelBookingPayload {
  userId: string;
  bookingId: string;
  reason: string;
}

interface RefundState {
  refunds: Refund[];
  loading: boolean;
  error: string | null; 
}

const initialState: RefundState = {
  refunds: [],
  loading: false,
  error: null,
};


export const cancelBooking = createAsyncThunk<Refund, CancelBookingPayload>(
  "refund/cancelBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/cancelBooking", payload);
      return res.data as Refund;
    } catch (error: any) {
     
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


export const fetchRefunds = createAsyncThunk<Refund[], string>(
  "refund/fetchRefunds",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/refunds/${userId}`);
      return res.data as Refund[];
    } catch (error: any) {
 
      return rejectWithValue(error.response?.data?.message || "Failed to fetch refunds");
    }
  }
);

const refundSlice = createSlice({
  name: "refund",
  initialState,
  reducers: {
    setRefunds: (state, action: PayloadAction<Refund[]>) => {
      state.refunds = action.payload;
    },
    updateRefundStatus: (
      state,
      action: PayloadAction<{ bookingId: string; status: Refund["status"] }>
    ) => {
      const refund = state.refunds.find(r => r.bookingId === action.payload.bookingId);
      if (refund) {
        refund.status = action.payload.status;
      }
    },
    removeRefund: (state, action: PayloadAction<string>) => {
      state.refunds = state.refunds.filter(
        refund => refund.bookingId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.refunds.findIndex(r => r.bookingId === action.payload.bookingId);
        if (existingIndex >= 0) {
          state.refunds[existingIndex] = action.payload;
        } else {
          state.refunds.push(action.payload);
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      })

     
      .addCase(fetchRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds = action.payload;
      })
      .addCase(fetchRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
  },
});

export const { updateRefundStatus, setRefunds, removeRefund } = refundSlice.actions;
export default refundSlice.reducer;

