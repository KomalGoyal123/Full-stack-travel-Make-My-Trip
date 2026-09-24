import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { Refund } from "@/store/refundSlice";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
    const backendRes = await axios.get<Refund[]>(
      `${BACKEND_URL}/refunds/user/${userId}`,
      { timeout: 5000 }
    );


    const refunds: Refund[] = backendRes.data;

    return res.status(200).json(refunds);
  } catch (error: any) {
    console.error("❌ Backend Error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to fetch refunds",
    });
  }
}




