import axios from "axios";
import { Review, NewReview } from "../store/reviewSlice";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";


export const addReview = async (review: NewReview): Promise<Review> => {
  const res = await axios.post<Review>(`${BACKEND_URL}/review/add`, review);
  return res.data;
};


export const getHotelReviews = async (hotelId: string): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/hotel/${hotelId}`);
  return res.data;
};


export const getFlightReviews = async (flightId: string): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/flight/${flightId}`);
  return res.data;
};


export async function replyReview(reviewId: string, reply: string): Promise<Review> {
  const res = await axios.post<Review>(
    `${BACKEND_URL}/review/reply/${reviewId}`,
    { reply },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}


export async function uploadPhoto(reviewId: string, file: File): Promise<Review> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post<Review>(
    `${BACKEND_URL}/review/uploadPhoto/${reviewId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}


export const flagReview = async (reviewId: string): Promise<Review> => {
  const res = await axios.post<Review>(`${BACKEND_URL}/review/flag/${reviewId}`);
  return res.data;
};


export const markHelpful = async (reviewId: string, userId: string): Promise<Review> => {
  const res = await axios.post<Review>(
    `${BACKEND_URL}/review/helpful/${reviewId}`,
    { userId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};


export const moderateReview = async (reviewId: string, status: string): Promise<Review> => {
  const res = await axios.post<Review>(
    `${BACKEND_URL}/review/moderate/${reviewId}`,
    { status },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};


export const filterHotelReviewsByRating = async (hotelId: string, rating: number): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/hotel/${hotelId}/rating/${rating}`);
  return res.data;
};


export const filterFlightReviewsByRating = async (flightId: string, rating: number): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/flight/${flightId}/rating/${rating}`);
  return res.data;
};


export const getMostHelpfulHotelReviews = async (hotelId: string): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/hotel/${hotelId}/helpful`);
  return res.data;
};


export const getMostHelpfulFlightReviews = async (flightId: string): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/flight/${flightId}/helpful`);
  return res.data;
};


export const getFlaggedReviews = async (): Promise<Review[]> => {
  const res = await axios.get<Review[]>(`${BACKEND_URL}/review/flagged`);
  return res.data;
};

