import { useState, useEffect } from "react";
import Flightlist from "@/components/Flights/Flightlist";
import FlightStatusPanel from "@/components/Flights/FlightStatusPanel";

export default function FlightDashboard() {
  const [selectedFlights, setSelectedFlights] = useState<any[]>([]);

  
  useEffect(() => {
    const saved = localStorage.getItem("selectedFlights");
    if (saved) {
      try {
        setSelectedFlights(JSON.parse(saved));
      } catch {
        setSelectedFlights([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedFlights", JSON.stringify(selectedFlights));
  }, [selectedFlights]);

  const handleSelect = (flight: any) => {
    if (!selectedFlights.find((f) => (f._id || f.id) === (flight._id || flight.id))) {
      const updated = [...selectedFlights, flight];
      setSelectedFlights(updated);
    }
  };

  
  const handleRemove = (flightId: string) => {
    const updated = selectedFlights.filter((f) => (f._id || f.id) !== flightId);
    setSelectedFlights(updated);
  };

  
  const handleClearAll = () => {
    setSelectedFlights([]);
    localStorage.removeItem("selectedFlights");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">✈️ Live Flight Dashboard</h1>

      {/* Flight list to choose from */}
      <Flightlist onSelect={handleSelect} />

      {/* Clear All button */}
      {selectedFlights.length > 0 && (
        <button
          onClick={handleClearAll}
          className="mt-4 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
        >
          Clear All Flights
        </button>
      )}

      {/* Grid of live status panels */}
      {selectedFlights.length === 0 && (
        <div className="mt-6 bg-gray-100 border rounded-lg p-6 text-center text-gray-600">
          No live flights selected yet.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {selectedFlights.map((flight) => (
          
          <div
            key={flight._id || flight.id}
            className="relative bg-white rounded-xl shadow-lg p-4 border"
          >
            <FlightStatusPanel flightId={flight._id || flight.id} />
            <button
              onClick={() => handleRemove(flight._id || flight.id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

