import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  id: string;   
  userId: string;
  hotelId?: string;
  flightId?: string;
  rating: number;
  text: string;
  photos?: string[];
  replies?: string[];
  flagged?: boolean;
  createdAt: string;


  helpfulCount?: number;
  helpfulUserIds?: string[];
  moderationStatus?: string; 
}

export type NewReview = Omit<Review, "id">;

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReview(state, action: PayloadAction<Review>) {
      state.reviews.push(action.payload);
    },
    addReply(state, action: PayloadAction<{ reviewId: string; reply: string }>) {
      const review = state.reviews.find(r => r.id === action.payload.reviewId);
      if (review) {
        if (!review.replies) review.replies = [];
        review.replies.push(action.payload.reply);
      }
    },
    flagReview(state, action: PayloadAction<string>) {
      const review = state.reviews.find(r => r.id === action.payload);
      if (review) {
        review.flagged = true;
        review.moderationStatus = "PENDING";
      }
    },
    markHelpful(state, action: PayloadAction<{ reviewId: string; userId: string }>) {
      const review = state.reviews.find(r => r.id === action.payload.reviewId);
      if (review) {
        if (!review.helpfulUserIds) review.helpfulUserIds = [];
        if (!review.helpfulUserIds.includes(action.payload.userId)) {
          review.helpfulUserIds.push(action.payload.userId);
          review.helpfulCount = (review.helpfulCount || 0) + 1;
        }
      }
    },
    moderateReview(state, action: PayloadAction<{ reviewId: string; status: string }>) {
      const review = state.reviews.find(r => r.id === action.payload.reviewId);
      if (review) {
        review.moderationStatus = action.payload.status;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setReviews,
  addReview,
  addReply,
  flagReview,
  markHelpful,
  moderateReview,
  setLoading,
  setError,
} = reviewSlice.actions;

export default reviewSlice.reducer;

