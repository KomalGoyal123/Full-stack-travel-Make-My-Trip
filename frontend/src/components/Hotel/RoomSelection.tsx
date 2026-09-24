"use client";

import {
  useEffect,
  useMemo,
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
  saveRoomPreference,
} from "@/store/preferencesSlice";

interface Room {
  id: string;

  type:
  | "STANDARD"
  | "DELUXE"
  | "SUITE";

  price: number;

  booked: boolean;

  images: string[];

  size: string;

  guests: number;

  premium: boolean;

  description: string;

  virtualTour?: string;
}

const generateRooms = (): Room[] => {

  return [

    {
      id: "R1",

      type: "STANDARD",

      price: 0,

      booked: false,

      size: "250 sq ft",

      guests: 2,

      premium: false,

      description:
        "Comfortable standard room with modern amenities.",

      virtualTour:
        "https://my.matterport.com/show/?m=example1",

      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      ],
    },

    {
      id: "R2",

      type: "DELUXE",

      price: 2500,

      booked: false,

      size: "400 sq ft",

      guests: 3,

      premium: true,

      description:
        "Luxury deluxe room with premium city views.",

      virtualTour:
        "https://my.matterport.com/show/?m=example2",

      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      ],
    },

    {
      id: "R3",

      type: "SUITE",

      price: 5000,

      booked: false,

      size: "650 sq ft",

      guests: 5,

      premium: true,

      description:
        "Ultra luxury suite with lounge and balcony.",

      virtualTour:
        "https://my.matterport.com/show/?m=example3",

      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      ],
    },
  ];
};

interface Props {
  onSelect?: (
    room: Room
  ) => void;
}

const RoomSelection = ({
  onSelect,
}: Props) => {

  const dispatch =
    useDispatch<AppDispatch>();

  const savedRoom =
    useSelector(
      (state: RootState) =>
        state.preferences
          .roomPreference
    );

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [
    selectedRoom,
    setSelectedRoom,
  ] = useState<Room | null>(
    null
  );

  const [
    liveMessage,
    setLiveMessage,
  ] = useState("");

  

  useEffect(() => {

    setRooms(generateRooms());

  }, []);

  

  useEffect(() => {

    if (
      savedRoom?.id &&
      rooms.length > 0
    ) {

      const foundRoom =
        rooms.find(
          (room) =>
            room.id ===
            savedRoom.id
        );

      if (
        foundRoom &&
        !foundRoom.booked &&
        selectedRoom?.id !==
        foundRoom.id
      ) {

        setSelectedRoom(
          foundRoom
        );
      }
    }

  }, [
    savedRoom,
    rooms,
    selectedRoom,
  ]);


  useEffect(() => {

    const interval =
      setInterval(() => {

        setRooms((prevRooms) =>

          prevRooms.map((room) => {

            
            if (
              room.id ===
              selectedRoom?.id
            ) {

              return {
                ...room,
                booked: false,
              };
            }

          
            if (
              Math.random() < 0.06
            ) {

              return {
                ...room,
                booked:
                  !room.booked,
              };
            }

            return room;
          })
        );

        setLiveMessage(
          "Room availability updated live"
        );

        setTimeout(() => {

          setLiveMessage("");

        }, 2000);

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [selectedRoom]);

 

  const handleSelect = (
    room: Room
  ) => {

    if (room.booked) {

      alert(
        "This room is already booked"
      );

      return;
    }

    setSelectedRoom(room);

    dispatch(
      saveRoomPreference({

        id: room.id,

        type: room.type,

        price: room.price,
      })
    );

    onSelect?.(room);

    setLiveMessage(
      `${room.type} selected successfully`
    );

    setTimeout(() => {

      setLiveMessage("");

    }, 2000);
  };



  const totalPrice =
    useMemo(() => {

      return (
        selectedRoom?.price || 0
      );

    }, [selectedRoom]);

  return (

    <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-lg sm:text-2xl font-bold">
            Select Your Room
          </h2>

          <p className="text-gray-600 text-[10px] sm:text-sm mt-1 sm:mt-2">
            Luxury room selection with live updates
          </p>

        </div>

        {liveMessage && (

          <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">

            {liveMessage}

          </div>
        )}
      </div>

      {/* ROOM GRID */}

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 items-start ">

        {rooms.map((room) => {

          const isSelected =
            selectedRoom?.id ===
            room.id;

          return (

            <div
              key={room.id}

              onClick={() =>
                !room.booked &&
                handleSelect(room)
              }

              className={`

                group
                relative
                overflow-hidden
                rounded-2xl
                border
                transition-all
                duration-300

                ${room.booked
                  ? `
                    opacity-50
                    cursor-not-allowed
                    border-red-400
                  `
                  : isSelected
                    ? `
                      border-green-500
                      shadow-2xl
                      scale-[1.02]
                      cursor-pointer
                    `
                    : `
                      hover:shadow-2xl
                      hover:-translate-y-1
                      cursor-pointer
                      border-gray-200
                    `
                }
              `}
            >

              {/* IMAGE */}

              <div className="relative">

                <img
                  src={
                    room.images?.[0] ||
                    "/placeholder.jpg"
                  }
                  alt={room.type}
                  className="w-full h-32 sm:h-44 object-cover"
                />

                {/* PREMIUM */}

                {room.premium && (

                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PREMIUM
                  </div>
                )}

                {/* STATUS */}

                <div
                  className={`
                      absolute top-2 right-2 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full
                       ${room.booked ? `bg-red-500 text-white` : `bg-green-500 text-white`}
                      `}
                >
                  {room.booked ? "BOOKED" : "AVAILABLE"}
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-3 sm:p-4">

                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-lg font-bold truncate">
                    {room.type}
                  </h3>
                  <p className="font-bold text-indigo-600 text-xs sm:text-base whitespace-nowrap">
                    {room.price === 0 ? "Free" : `₹${room.price}`}
                  </p>
                </div>

                <p className="text-gray-600 text-sm mt-2">

                  {room.description}

                </p>

                {/* DETAILS */}

                <div className="mt-2 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">

                  <div className="bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs">

                    {room.size}

                  </div>

                  <div className="bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs">

                    {room.guests} Guests

                  </div>

                  {room.virtualTour && (

                    <a
                      href={
                        room.virtualTour
                      }

                      target="_blank"

                      rel="noopener noreferrer"

                      onClick={(e) =>
                        e.stopPropagation()
                      }

                      className="bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs hover:bg-indigo-200"
                    >
                      3D Preview
                    </a>
                  )}
                </div>

                {/* PREMIUM MESSAGE */}

                {room.premium && (

                  <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl">

                    <p className="text-sm font-medium text-orange-700">

                      Upgrade for premium luxury experience ✨

                    </p>

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED ROOM */}

      {selectedRoom && (

        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold">

                Selected Room

              </h3>

              <p className="text-gray-600">

                {selectedRoom.type}

              </p>

              <p className="text-sm text-gray-500">

                {selectedRoom.size}
                {" • "}
                {
                  selectedRoom.guests
                } Guests

              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-gray-500">

                Upgrade Price

              </p>

              <p className="text-3xl font-bold text-indigo-600">

                ₹{totalPrice}

              </p>

            </div>
          </div>

          {/* SAVE BUTTON */}

          <button
            onClick={() =>

              dispatch(
                saveRoomPreference({

                  id:
                    selectedRoom.id,

                  type:
                    selectedRoom.type,

                  price:
                    selectedRoom.price,
                })
              )
            }

            className="mt-5 w-full bg-black hover:bg-gray-900 transition text-white py-3 rounded-xl font-semibold"
          >

            Save Room Preference

          </button>
        </div>
      )}

      {/* SAVED PREF */}

      {savedRoom && (

        <div className="mt-4 text-center text-sm text-gray-500">

          Saved Preference :

          <span className="font-semibold ml-1">

            {savedRoom?.type}

          </span>

        </div>
      )}
    </div>
  );
};

export default RoomSelection;
