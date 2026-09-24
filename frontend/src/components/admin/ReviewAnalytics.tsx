import { useEffect, useState } from "react";
import axios from "axios";

interface Analytics {
  total: number;
  approved: number;
  rejected: number;
  flagged: number;
  avgHelpful: number;
}

export default function ReviewAnalytics() {
  const [stats, setStats] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
        const res = await axios.get<Analytics>(`${BACKEND_URL}/review/analytics`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">📊 Review Analytics</h2>
      {stats ? (
        <ul className="space-y-2 text-gray-700">
          <li>Total Reviews: {stats.total}</li>
          <li>Approved: {stats.approved}</li>
          <li>Rejected: {stats.rejected}</li>
          <li>Flagged: {stats.flagged}</li>
          <li>Average Helpfulness: {stats.avgHelpful.toFixed(2)}</li>
        </ul>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
}

