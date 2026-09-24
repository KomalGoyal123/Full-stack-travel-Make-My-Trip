import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface CancelBookingResponse {
  bookingId: string;
  userId: string;
  reason: string;
  refundAmount: number;
  status: string;
  timeline: string;
  createdAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  if (req.method === "POST") {
    const { userId, bookingId, reason } = req.body;

    try {
      console.log("📤 Sending to backend:", { userId, bookingId, reason });


      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
      const backendRes = await axios.post<CancelBookingResponse>(
        `${BACKEND_URL}/booking/cancel`,
        { userId, bookingId, reason },
        { timeout: 5000 }
      );

      console.log("📨 Backend Response:", backendRes.data);
      return res.status(200).json(backendRes.data);

    } catch (error: any) {
      console.error("❌ Backend Error:", error.message);
      return res.status(500).json({
        message: error.message || "Something went wrong",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}


