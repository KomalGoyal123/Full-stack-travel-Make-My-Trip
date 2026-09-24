"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  RootState,
  AppDispatch,
} from "@/store";

import {
  saveSeatPreference,
  fetchPreferences,
} from "@/store/preferencesSlice";

interface Seat {
  id: string;
  seatNumber?: string;
  row: number;
  col: string;
  type: "ECONOMY" | "PREMIUM" | "BUSINESS";
  seatType?: string;
  price: number;
  extraPrice?: number;
  booked: boolean;
  seatCategory: "WINDOW" | "AISLE" | "MIDDLE";
}

const ROWS = 10;
const COLS = ["A", "B", "C", "D", "E", "F"];



const generateSeats = (bookedSeats: string[] = []): Seat[] => {
  const seats: Seat[] = [];

  for (let row = 1; row <= ROWS; row++) {
    COLS.forEach((col) => {
      let type: Seat["type"] = "ECONOMY";
      let price = 0;

    
      if (row <= 2) {
        type = "BUSINESS";
        price = 5000;
      }
      
      else if (row <= 5) {
        type = "PREMIUM";
        price = 2500;
      }

      let seatCategory: Seat["seatCategory"] = "MIDDLE";

      
      if (col === "A" || col === "F") {
        seatCategory = "WINDOW";
      }
     
      else if (col === "C" || col === "D") {
        seatCategory = "AISLE";
      }

      const seatId = `${row}${col}`;

      seats.push({
        id: seatId,
        seatNumber: seatId,
        row,
        col,
        type,
        seatType: type,
        price,
        extraPrice: price,
        seatCategory,
        booked: bookedSeats.includes(seatId),
      });
    });
  }

  return seats;
};

interface Props {
  userId?: string;
  bookedSeats?: string[];
  onSelect?: (seat: Seat) => void;
}

const SeatSelection = ({ userId, bookedSeats = [], onSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const savedSeat = useSelector(
    (state: RootState) => state.preferences.seatPreference
  );

  const initialSeatsRef = useRef<Seat[]>([]);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  

  useEffect(() => {
    const generatedSeats = generateSeats(bookedSeats);
    initialSeatsRef.current = generatedSeats;
    setSeats(generatedSeats);
  }, [bookedSeats]);



  useEffect(() => {
    if (userId) {
      dispatch(fetchPreferences(userId));
    }
  }, [dispatch, userId]);

 

  useEffect(() => {
    if (savedSeat?.id && seats.length > 0) {
      const seatExists = seats.find((seat) => seat.id === savedSeat.id);

      if (
        seatExists &&
        !seatExists.booked &&
        selectedSeatId !== savedSeat.id
      ) {
        setSelectedSeatId(savedSeat.id);
      }
    }
  }, [savedSeat?.id, seats, selectedSeatId]);

  

  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prevSeats) => {
        return prevSeats.map((seat) => {
          if (bookedSeats.includes(seat.id)) {
            return { ...seat, booked: true };
          }

          if (seat.id === selectedSeatId) {
            return seat;
          }

          const shouldToggle = Math.random() < 0.02;

          if (!shouldToggle) {
            return seat;
          }

          return { ...seat, booked: !seat.booked };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedSeatId, bookedSeats]);

  

  const handleSelect = (seat: Seat) => {
    if (seat.booked && seat.id !== selectedSeatId) {
      alert("This seat is already booked");
      return;
    }

    setSelectedSeatId(seat.id);

    dispatch(
      saveSeatPreference({
        id: seat.id,
        type: seat.type,
        seatCategory: seat.seatCategory,
      })
    );

    onSelect?.({
      ...seat,
      seatNumber: seat.id,
      seatType: seat.type,
      extraPrice: seat.price,
      booked: false,
    });

    setLiveMessage(`Seat ${seat.id} selected successfully`);

    setTimeout(() => {
      setLiveMessage("");
    }, 2500);
  };

 

  const selectedSeat =
    seats.find((seat) => seat.id === selectedSeatId) || null;

  const totalPrice = selectedSeat?.price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3 sm:mb-5 gap-2">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold">Select Your Seat</h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Real-time seat availability
          </p>
        </div>

        {liveMessage && (
          <div className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
            {liveMessage}
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-3 mb-3 sm:mb-6 text-[10px] sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-purple-300"></div>
          Business +₹5000
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-300"></div>
          Premium +₹2500
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-300"></div>
          Economy
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500"></div>
          Selected
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-500"></div>
          Booked
        </div>
      </div>

      {/* AIRPLANE */}
      <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-5">
        <div className="text-center mb-3 sm:mb-5 font-bold text-lg sm:text-2xl">
          ✈ FRONT
        </div>

        <div className="grid grid-cols-6 gap-1 sm:gap-3 md:gap-4">
          {seats.map((seat) => {
            const isSelected = selectedSeatId === seat.id;
            const isBooked = seat.booked && !isSelected;

            return (
              <button
                key={seat.id}
                onClick={() => handleSelect(seat)}
                disabled={isBooked}
                className={`
                  relative
                  border sm:border-2
                  rounded-lg sm:rounded-2xl
                  min-h-[48px] sm:min-h-[75px] md:min-h-[90px]
                  p-0.5 sm:p-2
                  transition-all
                  duration-200
                  font-bold
                  overflow-hidden
                  cursor-pointer

                  ${
                    isSelected
                      ? `
                      bg-green-500
                      border-green-700
                      text-white
                      sm:scale-105
                      shadow-lg sm:shadow-2xl
                    `
                      : isBooked
                      ? `
                      bg-red-500
                      border-red-700
                      text-white
                      cursor-not-allowed
                      opacity-90
                    `
                      : seat.type === "BUSINESS"
                      ? `
                      bg-purple-100
                      border-purple-400
                      hover:bg-purple-200
                      sm:hover:scale-105
                    `
                      : seat.type === "PREMIUM"
                      ? `
                      bg-blue-100
                      border-blue-400
                      hover:bg-blue-200
                      sm:hover:scale-105
                    `
                      : `
                      bg-gray-100
                      border-gray-300
                      hover:bg-gray-200
                      sm:hover:scale-105
                    `
                  }
                `}
              >
                {/* BOOKED CROSS */}
                {isBooked && (
                  <div className="absolute inset-0 flex items-center justify-center text-xl sm:text-4xl font-black text-white z-20">
                    ✕
                  </div>
                )}

                {/* SEAT INFO */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full leading-tight">
                  <div className="text-[11px] sm:text-lg md:text-xl">
                    {seat.id}
                  </div>
                  <div className="text-[7px] sm:text-[10px] md:text-[11px] mt-0.5 opacity-80">
                    {seat.seatCategory}
                  </div>
                </div>

                {/* VIP */}
                {seat.type !== "ECONOMY" && !isBooked && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[7px] sm:text-[10px] font-bold px-0.5 sm:px-1 rounded-bl-md sm:rounded-bl-lg">
                    VIP
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED SEAT */}
      {selectedSeat && (
        <div className="mt-3 sm:mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-lg">Selected Seat</h3>
              <p className="text-gray-700 text-xs sm:text-base">
                {selectedSeat.id} • {selectedSeat.type}
              </p>
              <p className="text-[10px] sm:text-sm text-gray-500">
                {selectedSeat.seatCategory} Seat
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] sm:text-sm text-gray-500">
                Upgrade Price
              </p>
              <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                ₹{totalPrice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SAVED PREF */}
      {savedSeat && (
        <div className="mt-3 sm:mt-4 text-[10px] sm:text-sm text-gray-500 text-center">
          Saved Preference :
          <span className="font-semibold ml-1">
            {savedSeat.id} • {savedSeat.type}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;





