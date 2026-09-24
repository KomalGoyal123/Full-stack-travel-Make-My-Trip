import { useRouter } from "next/router";
import {
  Star,
  MapPin,
  School as Pool,
  UtensilsCrossed,
  Wine,
  Power,
  ChevronRight,
  Camera,
  Image,
  CreditCard,
  Ticket,
  Plane,
  Home,
} from "lucide-react";
import {
  Sparkles,
  Wifi,
  ShieldCheck,
  BedDouble,
  Users,
  Eye,
} from "lucide-react"; 
import { useEffect, useState, useCallback, } from "react";
import { gethotel, handlehotelbooking } from "@/api";
interface Hotel {
  id: string; 
  hotelName: string; 
  location: string; 
  pricePerNight: number; 
  availableRooms: number; 
  amenities: string; 
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/store/userSlice";

import ReviewForm from "../../../components/Reviews/ReviewForm";
import ReviewList from "../../../components/Reviews/ReviewList";
import AverageRating from "@/components/Reviews/AverageRating";

import RoomSelection from "@/components/Hotel/RoomSelection";
import { RootState } from "@/store";



import DynamicPriceCard from "@/components/Pricing/DynamicPriceCard";
import PriceHistoryGraph from "@/components/Pricing/PriceHistoryGraph";
import PriceFreezePanel from "@/components/Pricing/PriceFreezePanel";
import LivePriceTicker from "@/components/Pricing/LivePriceTicker";


import { logViewInteraction } from "@/api/recommendation";

import {
  fetchLivePrice,
  fetchPriceHistory,
  setLivePriceRealtime,
} from "@/store/pricingSlice";

import { createPriceStream } from "@/api/pricing";


const BookHotelPage = () => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = router.query;
  const [hotels, sethotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
 
  const user = useSelector(
    (state: RootState) => state.user.user
  );
  const [open, setopen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const dispatch = useDispatch();
 
  const pricingState = useSelector(
    (state: RootState) => state.pricing
  );

  const {
    livePrice,
    priceHistory
  } = pricingState;
  
  useEffect(() => {
    const fetchhotels = async () => {
      try {
        const data = await gethotel();
        const filteredData = data.filter((hotel: any) => hotel.id === id);
        sethotels(filteredData);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchhotels();
  }, [id]);

 
  useEffect(() => {
    if (id && user?.id) {
      logViewInteraction(user.id, "HOTEL", id as string);
    }
  }, [id, user?.id]);
  
  useEffect(() => {

    if (!id) return;

    dispatch(
      fetchLivePrice({
        entityType: "hotel",
        entityId: id as string,
      }) as any
    );

    dispatch(
      fetchPriceHistory(
        id as string
      ) as any
    );

  }, [id, dispatch]);

  useEffect(() => {

    if (!id) return;

    const stream = createPriceStream(
      "hotel",
      id as string,

      (data) => {

        dispatch(
          setLivePriceRealtime(data)
        );
      }
    );

    return () => {

      stream.close();
    };

  }, [id, dispatch]);
  



  const hotelData = {
    name: "Magnum Resorts- Near Candolim Beach",
    rating: 3,
    maxRating: 5,
    propertyPhotos: 91,
    guestPhotos: 386,
    description:
      "One of the best hotels in North Goa, operating since 2001 catering to international and domestic individual and group travelers.",
    amenities: [
      { icon: <Pool className="w-5 h-5" />, name: "Swimming Pool" },
      { icon: <UtensilsCrossed className="w-5 h-5" />, name: "Restaurant" },
      { icon: <Wine className="w-5 h-5" />, name: "Bar" },
      { icon: <Power className="w-5 h-5" />, name: "Power Backup" },
    ],
    room: {
      type: "Standard Room",
      capacity: "Fits 2 Adults",
      features: [
        "No meals included",
        "10% off on food & beverage services",
        "Complimentary welcome drinks on arrival",
        "Non-Refundable",
      ],
      originalPrice: 8999,
      discountedPrice: 664,
      taxes: 527,
    },
    upgradeRooms: [
      {
        name: "Deluxe Ocean View",
        price: 2500,
        perks: ["Ocean View", "Free Breakfast", "Premium WiFi"],
      },
      {
        name: "Luxury Suite",
        price: 5000,
        perks: ["Private Lounge", "Jacuzzi", "VIP Service"],
      },
    ],
    location: {
      area: "Candolim",
      distance: "7 minutes walk to Candolim Beach",
    },
    reviews: {
      rating: 3.8,
      count: 784,
      text: "Very Good",
    },
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number.parseInt(e.target.value);
    setQuantity(
      isNaN(value) ? 1 : Math.max(1, Math.min(value, hotel.availableRooms))
    );
  };

 
  const hotel = hotels[0];


  const roomExtra = selectedRoom?.price || 0;

  
  const dynamicBasePrice = livePrice?.currentPrice || hotel?.pricePerNight || 0;
  const totalPrice = (dynamicBasePrice + roomExtra) * quantity;

  const totalTaxes = hotelData?.room?.taxes * quantity;


  const totalDiscounts = hotelData?.room?.discountedPrice * quantity;

  const grandTotal = totalPrice + totalTaxes - totalDiscounts;





  const handlebooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }



    try {
      if (!user?.id || !hotel?.id) {
        console.error("Missing user or hotel");
        return;
      }
      const roomPref = {
        type: selectedRoom.type,
        price: selectedRoom.price,
      };

      console.log("Sending roomPref => ", roomPref);

      const data = await handlehotelbooking(
        user.id,
        hotel.id,
        roomPref,
        quantity,
        grandTotal
      );

      if (!data) {
        console.warn("Hotel booking API returned an empty response");
        return;
      }

      const normalizedBooking = {
        ...data,
        bookingId:
          data?.bookingId || data?.id || data?._id || `hotel-${hotel?.id}-${Date.now()}`,
        type: data?.type || "Hotel",
        date: data?.date || new Date().toISOString(),
        totalPrice: Number(data?.totalPrice || data?.price || grandTotal || 0),
        status: data?.status || "CONFIRMED",
        roomPref: {
          roomType: selectedRoom.type,
          price: selectedRoom.price,
        },
      };

      const existingBookings = Array.isArray(user?.bookings)
        ? [...user.bookings]
        : [];

      const existingBookingIndex = existingBookings.findIndex(
        (b: any) => b.bookingId === normalizedBooking.bookingId
      );

      let updatedBookings;
      if (existingBookingIndex >= 0) {
        updatedBookings = [...existingBookings];
        updatedBookings[existingBookingIndex] = normalizedBooking;
      } else {
        updatedBookings = [...existingBookings, normalizedBooking];
      }

      const updateuser = {
        ...user,
        bookings: updatedBookings,
      };

      dispatch(setUser(updateuser));
      setopen(false); 
      setQuantity(1);
      router.push("/profile");

    } catch (error) {
      console.log(error);
    }
  };

  
  const HotelContent = useCallback(() => {
    return (
      <DialogContent className=" w-full sm:max-w-[700px] mx-auto bg-white rounded-xl shadow-lg p-10 max-h-[90vh] overflow-y-auto"

      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Home className="w-6 h-6 mr-2" />
            Hotel Booking Details
          </DialogTitle>
          <DialogDescription>
            Complete your hotel booking details and payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Hotel Name</Label>
              <Input value={hotel?.hotelName} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={hotel?.location} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Price Per Night</Label>
         
              <Input value={`₹ ${dynamicBasePrice}`} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Available Rooms</Label>
              <Input value={hotel?.availableRooms} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Number of Rooms</Label>
              <Input
                type="number"
                min="1"
                max={hotel.availableRooms}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Room Selection</h3>
            <RoomSelection onSelect={setSelectedRoom} />

            {selectedRoom && (
              <p className="text-sm text-gray-600 mt-2">
                Selected Room:
                <b> {selectedRoom.type}</b>
                (+₹{selectedRoom.price})
              </p>
            )}
          </div>

          {/* SELECTED ROOM SUMMARY */}

          {selectedRoom && (
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border">
              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-lg font-bold">
                    Selected Upgrade
                  </h3>

                  <p className="text-gray-600">
                    {selectedRoom.type}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Extra Price
                  </p>

                  <p className="text-2xl font-bold text-indigo-600">
                    ₹{selectedRoom.price}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="bg-white px-3 py-1 rounded-full text-sm shadow">
                  Premium Experience
                </span>

                <span className="bg-white px-3 py-1 rounded-full text-sm shadow">
                  Live Availability
                </span>

                <span className="bg-white px-3 py-1 rounded-full text-sm shadow">
                  Smart Recommendation
                </span>
              </div>
            </div>
          )}
          {/* LIVE ROOM STATUS */}

          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />

                <span className="font-semibold text-green-700">
                  Live Availability Enabled
                </span>
              </div>

              <span className="text-sm text-green-600">
                Rooms update automatically
              </span>
            </div>
          </div>
          {/*Dynamic price  */}
          {hotel?.id && (
            <>
              <div className="mt-6">
                <LivePriceTicker
                  entityType="hotel"
                  entityId={hotel.id}
                />
              </div>

              <div className="mt-6">
                <DynamicPriceCard
                  entityType="hotel"
                  entityId={hotel.id}
                />
              </div>

              {user?.id && (
                <div className="mt-6">
                  <PriceFreezePanel
                    entityType="hotel"
                    entityId={hotel.id}
                    userId={user.id}
                  />
                </div>
              )}

              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  Price Trend History
                </h2>

                <PriceHistoryGraph
                  entityId={hotel.id}
                />
              </div>
            </>
          )}
          {/* Fare */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Fare Summary</h3>

            <div className="flex justify-between">
              <span>Base Fare</span>
              <span>₹ {totalPrice.toLocaleString()}</span>
            </div>
            {/*this is for price  */}
            <div className="flex justify-between text-blue-600">
              <span className="font-medium">
                Live Dynamic Price
              </span>

              <span className="font-bold">
                ₹ {dynamicBasePrice.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹ {totalTaxes.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹ {Math.abs(totalDiscounts).toLocaleString()}</span>
            </div>

            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          onClick={handlebooking}
          disabled={!selectedRoom}
        >
          Proceed to Payment
        </Button>

      </DialogContent>
    );
  }, [
    hotel,
    selectedRoom,
    quantity,
    totalPrice,
    totalTaxes,
    totalDiscounts,
    grandTotal,
    dynamicBasePrice,
    user,
    open
  ]);
  if (loading) {
    return <Loader />;
  }


  if (!hotel) {
    return <div>Hotel not found</div>;
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-blue-500">
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <a href="/" className="text-blue-500">
              {hotel?.location}
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{hotel?.hotelName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 order-1 ">
            {/* Hotel Title & Rating */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{hotel.hotelName}</h1>
              <div className="flex items-center space-x-1">
                {[...Array(hotelData.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
                {[...Array(hotelData.maxRating - hotelData.rating)].map(
                  (_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  )
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="col-span-2 relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800"
                  alt="Hotel Main"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">
                    +{hotelData.propertyPhotos} Property Photos
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800"
                    alt="Hotel Room"
                    className="w-full h-[152px] object-cover rounded-lg"
                  />
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800"
                    alt="Hotel Amenity"
                    className="w-full h-[152px] object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span className="text-sm">
                      +{hotelData.guestPhotos} Guest Photos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D ROOM EXPERIENCE  remove*/}

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">

                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Explore Rooms in 3D
                  </h2>

                  <p className="text-indigo-100 mt-2">
                    Experience immersive virtual room previews before booking
                  </p>
                </div>

                <button className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition">
                  View 3D Tour
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {hotelData.description}
              <button className="text-blue-500 ml-2">Read more</button>
            </p>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-6">
                {hotelData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    {amenity.icon}
                    <span>{amenity.name}</span>
                  </div>
                ))}
                <button className="text-blue-500">+ 31 Amenities</button>
              </div>
            </div>

            {/* PREMIUM ROOM UPGRADES  remove */}

            <div className="mb-0">
              <div className="flex items-center gap-2 mb-4">

                <Sparkles className="w-5 h-5 text-yellow-500" />

                <h2 className="text-xl font-bold">
                  Premium Room Upgrades
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {hotelData.upgradeRooms.map((room, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-5 hover:shadow-xl transition bg-white"
                  >

                    <div className="flex items-center justify-between mb-3">

                      <h3 className="font-bold text-lg">
                        {room.name}
                      </h3>

                      <span className="text-indigo-600 font-bold">
                        +₹{room.price}
                      </span>
                    </div>

                    <div className="space-y-2">

                      {room.perks.map((perk, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <ChevronRight className="w-4 h-4 text-green-500" />

                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>




          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2 order-3 lg:col-start-1">
            <div className="bg-white rounded-xl shadow-sm p-6  max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Hotel Reviews
                </h2>
                <AverageRating />
              </div>

              {id && (
                <div className="space-y-6">
                  <ReviewForm hotelId={id as string} />
                  <ReviewList hotelId={id as string} />
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1 order-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {hotelData.room.type}
              </h3>
              <p className="text-gray-600 mb-4">{hotelData.room.capacity}</p>

              <ul className="space-y-3 mb-6">
                {hotelData.room.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                {/* Price Per Night */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 font-semibold">
                    Price Per Night:
                  </span>
                  <span className="text-lg font-medium text-gray-800">
                    ₹ {totalPrice}
                  </span>
                </div>

                {/* Available Rooms */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-800 font-semibold">
                    Available Rooms:
                  </span>
                  <span className="text-lg font-medium text-gray-800">
                    {hotel.availableRooms}
                  </span>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-2">
                    Amenities:
                  </h4>
                  <p className="text-gray-600">{hotel.amenities}</p>
                </div>

              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 line-through">
                    ₹ {totalPrice}
                  </span>
                  <span className="text-gray-500">Per Night:</span>
                </div>
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>₹ {grandTotal}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    + ₹ {totalTaxes} taxes & fees
                  </span>
                </div>
              </div>

              {/* SMART RECOMMENDATION  remove */}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">

                <div className="flex items-center gap-2 mb-2">

                  <Sparkles className="w-5 h-5 text-yellow-600" />

                  <h3 className="font-bold text-yellow-700">
                    Smart Upgrade Suggestion
                  </h3>
                </div>

                <p className="text-sm text-gray-700">
                  Upgrade to Deluxe Room for better views,
                  luxury amenities and premium comfort.
                </p>
              </div>
              <Dialog open={open} onOpenChange={setopen}>
                <DialogTrigger asChild>
                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mb-3">
                    BOOK THIS NOW
                  </button>
                </DialogTrigger>
                {user ? (
                  HotelContent()  
                ) : (
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                      <DialogDescription>
                        Please login to continue hotel booking.
                      </DialogDescription>
                    </DialogHeader>
                    <p>Please log in to continue with your booking.</p>
                    <SignupDialog
                      trigger={
                        <Button className="w-full">Log In / Sign Up</Button>
                      }
                    />
                  </DialogContent>
                )}
              </Dialog>

              <button className="w-full text-blue-500 text-center">
                14 More Options
              </button>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
                    {hotelData.reviews.rating}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {hotelData.reviews.text}
                    </div>
                    <div className="text-gray-500">
                      ({hotelData.reviews.count} ratings)
                    </div>
                  </div>
                </div>
                <a href="#" className="text-blue-500">
                  All Reviews
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {hotel.location}
                  </h3>
                </div>
                <button className="text-blue-500">See on Map</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookHotelPage;

