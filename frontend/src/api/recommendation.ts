import axios from "axios";

// const BACKEND_URL = "http://localhost:8081";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";



export interface Recommendation {
  id: string;
  userId: string;
  entityType: "FLIGHT" | "HOTEL" | "DESTINATION";
  entityId?: string;
  destination?: string;
  displayName: string;
  imageUrl?: string;
  price?: number;
  reason: string;
  reasonDetails?: string;
  algorithmUsed: "COLLABORATIVE_FILTERING" | "CONTENT_BASED" | "POPULARITY";
  confidenceScore: number;
  status: "ACTIVE" | "CLICKED" | "BOOKED" | "DISMISSED" | "EXPIRED";
  category?: string;
  tags?: string[];
  generatedAt: string;
  expiresAt: string;
  userFeedback?: "HELPFUL" | "NOT_HELPFUL";
}

export interface InteractionLogRequest {
  userId: string;
  entityType: string;
  entityId: string;
  recommendationId?: string;
}

export interface SearchLogRequest {
  userId: string;
  keyword?: string;
  destination?: string;
  category?: string;
}

export interface FeedbackRequest {
  userId: string;
  recommendationId: string;
  feedback: "HELPFUL" | "NOT_HELPFUL";
}




export const getRecommendationsForUser = async (
  userId: string,
  limit: number = 10
): Promise<Recommendation[]> => {
  try {
    const response = await axios.get<{ recommendations: Recommendation[] }>(
      `${BACKEND_URL}/api/recommendations/user/${userId}`,
      { params: { limit } }
    );
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};


export const getActiveRecommendationsForUser = async (
  userId: string,
  limit: number = 10
): Promise<Recommendation[]> => {
  try {
    const response = await axios.get<{ recommendations: Recommendation[] }>(
      `${BACKEND_URL}/api/recommendations/user/${userId}/active`,
      { params: { limit } }
    );
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching active recommendations:", error);
    return [];
  }
};




export const logViewInteraction = async (
  userId: string,
  entityType: string,
  entityId: string
): Promise<boolean> => {
  try {
    await axios.post(`${BACKEND_URL}/api/recommendations/interaction/view`, {
      userId,
      entityType,
      entityId,
    });
    return true;
  } catch (error) {
    console.error("Error logging view interaction:", error);
    return false;
  }
};


export const logClickInteraction = async (
  userId: string,
  entityType: string,
  entityId: string,
  recommendationId?: string
): Promise<boolean> => {
  try {
    await axios.post(`${BACKEND_URL}/api/recommendations/interaction/click`, {
      userId,
      entityType,
      entityId,
      recommendationId,
    });
    return true;
  } catch (error) {
    console.error("Error logging click interaction:", error);
    return false;
  }
};


export const logSearchInteraction = async (
  userId: string,
  keyword?: string,
  destination?: string,
  category?: string
): Promise<boolean> => {
  try {
    await axios.post(`${BACKEND_URL}/api/recommendations/interaction/search`, {
      userId,
      keyword,
      destination,
      category,
    });
    return true;
  } catch (error) {
    console.error("Error logging search interaction:", error);
    return false;
  }
};




export const submitRecommendationFeedback = async (
  userId: string,
  recommendationId: string,
  feedback: "HELPFUL" | "NOT_HELPFUL"
): Promise<boolean> => {
  try {
    await axios.post(`${BACKEND_URL}/api/recommendations/feedback`, {
      userId,
      recommendationId,
      feedback,
    });
    return true;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return false;
  }
};




export const markRecommendationBooked = async (
  recommendationId: string
): Promise<boolean> => {
  try {
    await axios.post(`${BACKEND_URL}/api/recommendations/booked`, {
      recommendationId,
    });
    return true;
  } catch (error) {
    console.error("Error marking recommendation as booked:", error);
    return false;
  }
};



export const getUserPreferences = async (userId: string): Promise<{
  preferredDestinations: string[];
  preferredCategories: string[];
}> => {
  try {
    const response = await axios.get<{
      preferredDestinations: string[];
      preferredCategories: string[];
    }>(`${BACKEND_URL}/api/recommendations/user/${userId}/preferences`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return { preferredDestinations: [], preferredCategories: [] };
  }
};




export const getUserInteractionHistory = async (
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    const response = await axios.get<{ interactions: any[] }>(
      `${BACKEND_URL}/api/recommendations/user/${userId}/history`,
      { params: { limit } }
    );
    return response.data.interactions;
  } catch (error) {
    console.error("Error fetching interaction history:", error);
    return [];
  }
};