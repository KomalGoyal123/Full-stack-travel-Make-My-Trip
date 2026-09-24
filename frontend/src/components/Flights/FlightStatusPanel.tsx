import { useEffect, useState } from "react";
import { FlightStatus, subscribeFlightStatus } from "@/api/flightStatus";
import toast from "react-hot-toast";

interface Props {
  flightId: string;
}

export default function FlightStatusPanel({ flightId }: Props) {
  const [status, setStatus] = useState<FlightStatus | null>(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeFlightStatus(flightId, (data) => {
      setStatus(data);
      setHighlight(true);

      const flightLabel = data.flightId || flightId || "Unknown Flight";

      
      if (Notification.permission === "granted") {
        new Notification(`Flight ${flightLabel} Update`, {
          body: `${data.status} – ${data.reason}\nETA: ${
            data.eta ? new Date(data.eta).toLocaleString() : "N/A"
          }`,
        
        });
      }

      
      let bgColor = "#1e3a8a";
      if (data.status === "Delayed") bgColor = "#dc2626";
      if (data.status === "On Time") bgColor = "#16a34a";
      if (data.status === "Boarding") bgColor = "#facc15";
      if (data.status === "Cancelled") bgColor = "#6b7280";
      if (data.status === "Landed") bgColor = "#0ea5e9";
      if (data.status === "Diverted") bgColor = "#9333ea";

      toast(`✈️ Flight ${flightLabel}\n${data.status} – ${data.reason}\nETA: ${
        data.eta ? new Date(data.eta).toLocaleString() : "N/A"
      }`, {
        style: {
          borderRadius: "10px",
          background: bgColor,
          color: "#fff",
          padding: "12px 16px",
          fontSize: "14px",
          lineHeight: "1.4",
        },
      });

      setTimeout(() => setHighlight(false), 1500);
    });

    return () => unsubscribe();
  }, [flightId]);

  if (!status) return <p>Loading flight status...</p>;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 mt-4 transition-all duration-500 ${
        highlight ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <h2 className="text-lg font-bold">✈️ Flight Live Status</h2>
      <p>
        Status:{" "}
        <span
          className={`font-semibold transition-colors duration-500 ${
            status.status === "Delayed"
              ? "text-red-600"
              : status.status === "On Time"
              ? "text-green-600"
              : status.status === "Boarding"
              ? "text-blue-600"
              : status.status === "Cancelled"
              ? "text-gray-600"
              : status.status === "Landed"
              ? "text-cyan-600"
              : status.status === "Diverted"
              ? "text-purple-600"
              : "text-gray-600"
          }`}
        >
          {status.status}
        </span>
      </p>
      <p>Reason: {status.reason}</p>
      {status.delayReason && (
        <p className="text-red-600 font-semibold">Delay Reason: {status.delayReason}</p>
      )}
      <p>Departure: {new Date(status.departureTime).toLocaleString()}</p>
      <p>Arrival: {new Date(status.arrivalTime).toLocaleString()}</p>
      {status.revisedDeparture && (
        <p>Revised Departure: {new Date(status.revisedDeparture).toLocaleString()}</p>
      )}
      {status.revisedArrival && (
        <p>Revised Arrival: {new Date(status.revisedArrival).toLocaleString()}</p>
      )}
      {status.eta && (
        <p className="font-semibold">ETA: {new Date(status.eta).toLocaleString()}</p>
      )}
    </div>
  );
}






