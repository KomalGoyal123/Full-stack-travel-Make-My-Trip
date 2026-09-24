"use client";
import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setUser, clearUser } from "@/store/userSlice";
import { editprofile } from "@/api";
import type { AppDispatch, RootState } from "@/store";
import { cancelBooking } from "@/store/refundSlice";
import RefundHistory from "@/components/RefundHistory";
import { User } from "@/store/userSlice"; 

import { Sparkles } from "lucide-react";



export interface Booking {
  bookingId: string;
  type: string;
  date: string | null;
  totalPrice: number;
  status?: string;
  quantity?: number;
  refund?: {
    bookingId: string;
    refundAmount: number;
    status: string;
    timeline: string;
    createdAt: string;
    reason?: string;
  } | null;
}

const normalizeBooking = (booking: any, defaultType: string, index: number): Booking => {
  const bookingId =
    booking?.bookingId || booking?.id || booking?._id || `${defaultType || "booking"}-${index}-${Date.now()}`;

  return {
    bookingId,
    type: booking?.type || defaultType || "Unknown",
    date: booking?.date || new Date().toISOString(),
    totalPrice: Number(booking?.totalPrice || booking?.price || 0),
    status: booking?.status || "CONFIRMED",
    refund: booking?.refund,
  };
};

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.user.user);

  const router = useRouter();

  const [userData, setUserData] = useState<User>({
    id: "dummy-001",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bookings: [],
  });

  useEffect(() => {
    if (user) {
      const bookingsToUse = Array.isArray(user?.bookings) ? [...user.bookings] : [];
      const normalizedBookings: Booking[] = bookingsToUse.map((booking: any, index: number) =>
        normalizeBooking(
          booking,
          booking?.type || (booking?.flightId ? "Flight" : booking?.hotelId ? "Hotel" : "Booking"),
          index
        )
      );
      const uniqueBookings = getDedupedBookings(normalizedBookings);

      if (typeof window !== "undefined") {
        localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(uniqueBookings));
      }

      setUserData({
        id: user?.id || "dummy-001",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bookings: uniqueBookings,
      });
    }
  }, [user]);

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [selectedReasons, setSelectedReasons] = useState<{ [key: string]: string }>({});
  const [hiddenRefunds, setHiddenRefunds] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      
      setUserData(editForm as User);
      setIsEditing(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDedupedBookings = (bookings: Booking[]) => {
    const map = new Map<string, Booking>();
    bookings.forEach((booking, idx) => {
      const key = booking.bookingId || (booking as any).id || (booking as any)._id || `booking-${idx}`;
      map.set(key, { ...booking, bookingId: key });
    });
    return Array.from(map.values());
  };

  const handleEditFormChange = (field: keyof User, value: any) => {
    setUserData((prevState: User) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const uniqueBookings = getDedupedBookings(userData.bookings);

  const handleCancel = (bookingId: string) => {
    const reason = selectedReasons[bookingId];
    if (!reason) {
      alert("Please select a reason for cancellation");
      return;
    }

    const updatedBookings = getDedupedBookings(
      userData.bookings.map((b: Booking) =>
        b.bookingId === bookingId
          ? {
            ...b,
            status: "CANCELLED",
            refund: {
              bookingId,
              refundAmount: b.totalPrice,
              status: "PENDING",
              timeline: "5-7 business days",
              createdAt: new Date().toISOString(),
              reason,
            },
          }
          : b
      )
    );

    setUserData((prev: User) => ({ ...prev, bookings: updatedBookings }));
    if (typeof window !== "undefined") {
      localStorage.setItem(`bookings_${userData.id}`, JSON.stringify(updatedBookings));
    }

    dispatch(
      setUser({
        id: userData.id,
        bookings: updatedBookings,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      })
    );

    setSelectedReasons((prev) => ({ ...prev, [bookingId]: "" }));

    dispatch(cancelBooking({ userId: userData.id, bookingId, reason }))
      .unwrap()
      .then((refundData) => {
        const finalBookings = getDedupedBookings(
          userData.bookings.map((b: Booking) =>
            b.bookingId === bookingId
              ? {
                ...b,
                status: "CANCELLED",
                refund: {
                  ...refundData,
                  refundAmount: b.totalPrice,
                },
              }
              : b
          )
        );

        setUserData((prev: User) => ({ ...prev, bookings: finalBookings }));
        if (typeof window !== "undefined") {
          localStorage.setItem(`bookings_${userData.id}`, JSON.stringify(finalBookings));
        }

        dispatch(
          setUser({
            id: userData.id,
            bookings: finalBookings,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
          })
        );
      })
      .catch((err) => {
        alert("Cancellation failed: " + (err?.message || "Unknown error"));
      });

  };

  const handleHideRefund = (bookingId: string) => {
    if (!userData) return;

    const updatedBookings = userData.bookings.map((b: Booking) =>
      b.bookingId === bookingId ? { ...b, status: "CONFIRMED", refund: null } : b
    );

    setUserData({ ...userData, bookings: updatedBookings });

    dispatch(
      setUser({
        id: userData.id,
        bookings: updatedBookings,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      })
    );
  };



  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUserData(editForm);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">

                    <UserIcon className="w-5 h-5 text-gray-500" />

                    <div>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p>{user?.phoneNumber}</p>
                  </div>

                  {/* ✅ Recommendations Link */}
                  <button
                    onClick={() => router.push("/recommendations")}
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Personalized Recommendations</span>
                  </button>

                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        
          {/* Bookings Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
              <div className="space-y-6">
                {uniqueBookings.length > 0 ? (
                  uniqueBookings.map((booking: any, index: number) => (
                    <div
                   
                      key={booking.bookingId || index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {booking?.type === "Flight" ? (
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{booking?.type}</h3>
                            <p className="text-sm text-gray-500">
                              Booking ID: {booking?.bookingId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹ {booking?.totalPrice.toLocaleString("en-IN")}
                          </p>
                          <p className="text-sm text-gray-500">{booking?.type}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span suppressHydrationWarning>
                            {typeof window !== "undefined"
                              ? formatDate(booking.date)
                              : booking.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span
                            className={`font-semibold ${booking?.status === "CANCELLED"
                              ? "text-red-600"
                              : "text-green-600"}`}
                          >
                            {booking?.status || "CONFIRMED"}
                          </span>
                        </div>
                      </div>
                      {/* Cancel Section */}
                      {(booking.status === "CONFIRMED" || !booking.status) &&
                        !hiddenRefunds.includes(booking.bookingId) ? (
                        <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 rounded">
                          <select
                            value={selectedReasons[booking.bookingId] || ""}
                            onChange={(e) => setSelectedReasons((prev) => ({
                              ...prev,
                              [booking.bookingId]: e.target.value,
                            }))}
                            className="border rounded px-2 py-1 flex-1 text-sm"
                          >
                            <option value="">Select reason</option>
                            <option value="Change of plans">Change of plans</option>
                            <option value="Medical emergency">Medical emergency</option>
                            <option value="Found cheaper option">Found cheaper option</option>
                          </select>
                          <button
                            onClick={() => handleCancel(booking.bookingId)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      ) : null}

                      {/* Refund Tracker */}
                      {booking.status === "CANCELLED" &&
                        booking.refund &&
                        !hiddenRefunds.includes(booking.bookingId) ? (
                        <div className="mt-4 p-3 border-2 border-green-200 rounded bg-green-50">
                          <p className="text-sm font-semibold text-green-800 mb-2">
                            ✓ Refund Initiated
                          </p>
                          <p className="text-sm text-gray-700">
                            Refund Amount:{" "}
                            <span className="font-semibold">
                              ₹{booking.refund.amount}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Status:{" "}
                            <span className="font-semibold">{booking.refund.status}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Timeline: {booking.refund.timeline}
                          </p>

                          {/* Close button */}
                          <button
                            onClick={() => handleHideRefund(booking.bookingId)}
                            className="mt-2 bg-red-300 text-gray-800 px-3 py-1 rounded"
                          >
                            Close
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No bookings found</p>
                )}
              </div>
            </div>
            <RefundHistory />
          </div>



        </div >
      </div >
    </div >
  );

};

export default ProfilePage;