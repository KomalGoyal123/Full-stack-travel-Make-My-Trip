

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Booking {
  bookingId: string;
  type: string;
  date: string | null;
  totalPrice: number;
  quantity?: number;
  status?: string;
  refund?: {
    bookingId: string;
    refundAmount: number;
    status: string;
    timeline: string;
    createdAt: string;
    reason?: string;
  } | null;
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bookings: Booking[];
  role?: string; 
   preferences?: {
  seatPreference?: any;
  roomPreference?: string;
};
}

interface UserState {
  user: User | null;
}


const getSavedUser = (): User | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      

      
      if (newUser.bookings) {
        newUser.bookings = newUser.bookings.map((b, index) => ({
          ...b,
          bookingId: b.bookingId || `booking-${index}`,
          type: b.type || "Unknown",
          date: b.date || null,
          totalPrice: Number(b.totalPrice ?? 0),
          quantity: b.quantity ?? 1,
          status: b.status || "CONFIRMED",
        }));
      }


      state.user = newUser;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    },
    clearUser: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    hydrateUser: (state) => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user");
        state.user = savedUser ? JSON.parse(savedUser) : null;
      }
    },
  },
});

export const { setUser, clearUser, hydrateUser } = userSlice.actions;
export default userSlice.reducer;

