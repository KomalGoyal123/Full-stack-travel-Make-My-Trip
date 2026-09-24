import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getRecommendationsForUser,
  getActiveRecommendationsForUser,
  submitRecommendationFeedback,
  markRecommendationBooked,
  getUserPreferences,
  logViewInteraction,
  logClickInteraction,
  logSearchInteraction,
  Recommendation,
} from "@/api/recommendation";



export interface UserPreferences {
  preferredDestinations: string[];
  preferredCategories: string[];
}

interface RecommendationState {
  recommendations: Recommendation[];
  activeRecommendations: Recommendation[];
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
}



const initialState: RecommendationState = {
  recommendations: [],
  activeRecommendations: [],
  userPreferences: null,
  loading: false,
  error: null,
  lastFetched: null,
};




export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetch",
  async ({ userId, limit }: { userId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const recommendations = await getRecommendationsForUser(userId, limit || 10);
      return recommendations;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch recommendations");
    }
  }
);


export const fetchActiveRecommendations = createAsyncThunk(
  "recommendations/fetchActive",
  async ({ userId, limit }: { userId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const recommendations = await getActiveRecommendationsForUser(userId, limit || 10);
      return recommendations;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch active recommendations");
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "recommendations/submitFeedback",
  async (
    { userId, recommendationId, feedback }: 
    { userId: string; recommendationId: string; feedback: "HELPFUL" | "NOT_HELPFUL" },
    { rejectWithValue }
  ) => {
    try {
      const success = await submitRecommendationFeedback(userId, recommendationId, feedback);
      if (success) {
        return { recommendationId, feedback };
      }
      return rejectWithValue("Failed to submit feedback");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit feedback");
    }
  }
);


export const markAsBooked = createAsyncThunk(
  "recommendations/markBooked",
  async ({ recommendationId }: { recommendationId: string }, { rejectWithValue }) => {
    try {
      const success = await markRecommendationBooked(recommendationId);
      if (success) {
        return { recommendationId };
      }
      return rejectWithValue("Failed to mark as booked");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to mark as booked");
    }
  }
);


export const fetchUserPreferences = createAsyncThunk(
  "recommendations/fetchPreferences",
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const preferences = await getUserPreferences(userId);
      return preferences;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user preferences");
    }
  }
);

export const logView = createAsyncThunk(
  "recommendations/logView",
  async (
    { userId, entityType, entityId }: 
    { userId: string; entityType: string; entityId: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await logViewInteraction(userId, entityType, entityId);
      if (!success) {
        return rejectWithValue("Failed to log view");
      }
      return { success };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to log view");
    }
  }
);

export const logClick = createAsyncThunk(
  "recommendations/logClick",
  async (
    { userId, entityType, entityId, recommendationId }: 
    { userId: string; entityType: string; entityId: string; recommendationId?: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await logClickInteraction(userId, entityType, entityId, recommendationId);
      if (!success) {
        return rejectWithValue("Failed to log click");
      }
      return { success, recommendationId };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to log click");
    }
  }
);


export const logSearch = createAsyncThunk(
  "recommendations/logSearch",
  async (
    { userId, keyword, destination, category }: 
    { userId: string; keyword?: string; destination?: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await logSearchInteraction(userId, keyword, destination, category);
      if (!success) {
        return rejectWithValue("Failed to log search");
      }
      return { success };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to log search");
    }
  }
);



const recommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.activeRecommendations = [];
      state.userPreferences = null;
      state.error = null;
      state.lastFetched = null;
    },
    
  
    clearError: (state) => {
      state.error = null;
    },
    
    
    updateRecommendationStatus: (
      state,
      action: PayloadAction<{ recommendationId: string; status: string }>
    ) => {
      const { recommendationId, status } = action.payload;
      
      const recIndex = state.recommendations.findIndex(r => r.id === recommendationId);
      if (recIndex !== -1) {
        state.recommendations[recIndex].status = status as any;
      }
      
      
      const activeIndex = state.activeRecommendations.findIndex(r => r.id === recommendationId);
      if (activeIndex !== -1) {
        if (status !== "ACTIVE") {
          
          state.activeRecommendations.splice(activeIndex, 1);
        } else {
          state.activeRecommendations[activeIndex].status = status as any;
        }
      }
    },
    
   
    updateRecommendationFeedback: (
      state,
      action: PayloadAction<{ recommendationId: string; feedback: "HELPFUL" | "NOT_HELPFUL" }>
    ) => {
      const { recommendationId, feedback } = action.payload;
      
      const rec = state.recommendations.find(r => r.id === recommendationId);
      if (rec) {
        rec.userFeedback = feedback;
      }
      
      const activeRec = state.activeRecommendations.find(r => r.id === recommendationId);
      if (activeRec) {
        activeRec.userFeedback = feedback;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
     
      .addCase(fetchActiveRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.activeRecommendations = action.payload;
      })
      .addCase(fetchActiveRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(submitFeedback.fulfilled, (state, action) => {
        const { recommendationId, feedback } = action.payload;
        
       
        const rec = state.recommendations.find(r => r.id === recommendationId);
        if (rec) {
          rec.userFeedback = feedback;
        }
        
        
        const activeRec = state.activeRecommendations.find(r => r.id === recommendationId);
        if (activeRec) {
          activeRec.userFeedback = feedback;
        }
      })
      
   
      .addCase(markAsBooked.fulfilled, (state, action) => {
        const { recommendationId } = action.payload;
        
       
        const rec = state.recommendations.find(r => r.id === recommendationId);
        if (rec) {
          rec.status = "BOOKED";
          rec.userFeedback = "HELPFUL";
        }
        
        
        state.activeRecommendations = state.activeRecommendations.filter(
          r => r.id !== recommendationId
        );
      })
      
      
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
      })
      
    
      .addCase(logClick.fulfilled, (state, action) => {
        const { recommendationId } = action.payload;
        if (recommendationId) {
          const rec = state.recommendations.find(r => r.id === recommendationId);
          if (rec && rec.status === "ACTIVE") {
            rec.status = "CLICKED";
          }
          
         
          state.activeRecommendations = state.activeRecommendations.filter(
            r => r.id !== recommendationId
          );
        }
      });
  },
});



export const {
  clearRecommendations,
  clearError,
  updateRecommendationStatus,
  updateRecommendationFeedback,
} = recommendationSlice.actions;

export default recommendationSlice.reducer;