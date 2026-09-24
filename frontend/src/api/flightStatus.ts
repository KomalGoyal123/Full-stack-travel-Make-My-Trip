import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

export interface FlightStatus {
  id: string;
  flightId: string;
  status: string;
  reason: string;
  departureTime: string;
  arrivalTime: string;
  delayReason?: string;
  revisedDeparture?: string;
  revisedArrival?: string;
  eta?: string;
}

export const getFlightStatus = async (
  flightId: string
): Promise<FlightStatus> => {
  const res = await axios.get<FlightStatus>(
    `${BACKEND_URL}/flightStatus/${flightId}`
  );
  return res.data;
};


export const getAllFlightStatuses = async (): Promise<FlightStatus[]> => {
  const res = await axios.get<FlightStatus[]>(
    `${BACKEND_URL}/flightStatus/all`
  );
  return res.data;
};


export const createFlightStatus = async (
  status: FlightStatus
): Promise<FlightStatus> => {
  const res = await axios.post<FlightStatus>(
    `${BACKEND_URL}/flightStatus`,
    status
  );
  return res.data;
};


export const subscribeFlightStatus = (
  flightId: string,
  onUpdate: (status: FlightStatus) => void
) => {

  if (typeof window === "undefined") {
    return () => {};
  }

  const eventSource = new EventSource(
    `${BACKEND_URL}/flightStatus/stream/${flightId}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data: FlightStatus = JSON.parse(event.data);
      onUpdate(data);
    } catch (err) {
      console.warn("Invalid SSE data", err);
    }
  };

  eventSource.onerror = () => {
    console.warn("SSE disconnected or backend unavailable");
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
};