import axios from "axios";

// const BACKEND_URL = "http://localhost:8081";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";




export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login`;
    const res = await axios.post(
      url,
      { email, password },              
      { withCredentials: true }         
    );
    return res.data;                   
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/profile`, {
      params: { email }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};





export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,

) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const data = res.data;
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${email}`);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const data = res.data;
    return data;
  } catch (error) {}
};

export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};



export const handleflightbooking = async (
  userId,
  flightId,
  seatPref,
  quantity,
  totalPrice
) => {

  try {

    console.log("FINAL seatPref => ", seatPref);

    const response = await axios.post(
      `${BACKEND_URL}/booking/flight`,
      {
        userId,
        flightId,

        seatPref,

        seats: quantity,

        price: totalPrice,
      }
    );

    return response.data;

  } catch (error) {

    console.log("Flight booking error:", error);

    return null;
  }
};





export const handlehotelbooking = async (
  userId,
  hotelId,
  roomPref,
  quantity,
  total
) => {

  try {

    console.log("FINAL roomPref => ", roomPref);

    const url = `${BACKEND_URL}/booking/hotel`;

    const res = await axios.post(url, {

      userId,

      hotelId,

    
      roomPref,

     
      quantity,

      total,
    });

    return res.data;

  } catch (error) {

    console.log("Hotel booking error:", error);

    return null;
  }
};


export {
  getRecommendationsForUser,
  getActiveRecommendationsForUser,
  logViewInteraction,
  logClickInteraction,
  logSearchInteraction,
  submitRecommendationFeedback,
  markRecommendationBooked,
  getUserPreferences,
  getUserInteractionHistory,
} from "./recommendation";