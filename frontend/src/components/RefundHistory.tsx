"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { removeRefund, fetchRefunds } from "@/store/refundSlice";
import type { AppDispatch } from "@/store";

export default function RefundHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const { refunds, loading, error } = useSelector((state: RootState) => state.refund);
  const user = useSelector((state: RootState) => state.user.user);

  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchRefunds(user.id));
    }
  }, [user?.id, dispatch]);

 
  const handleDeleteRefund = (bookingId: string) => {
    dispatch(removeRefund(bookingId));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Refund History</h2>

      {loading && <p className="text-gray-500">Loading refunds...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {refunds.length === 0 && !loading ? (
        <p className="text-gray-500">No refunds yet.</p>
      ) : (
        refunds.map((refund,index) => (
          <div key={`${refund.bookingId}-${index}`} className="border p-3 rounded mb-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Booking ID:</span> {refund.bookingId}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Refund Amount:</span> ₹{refund.amount}
            </p>

            
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Status:</span> {refund.status}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Timeline:</span> {refund.timeline}
            </p>
            <p className="text-xs text-gray-500">
              Requested On: {new Date(refund.createdAt).toLocaleDateString()}
            </p>

            {/* ✅ Delete button */}
            <button
              disabled={loading}
              onClick={() => handleDeleteRefund(refund.bookingId)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Delete Refund History
            </button>
          </div>
        ))
      )}
    </div>
  );
}



