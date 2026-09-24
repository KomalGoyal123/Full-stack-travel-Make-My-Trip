import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getFlaggedReviews, moderateReview } from "../../api/review";
import { Review } from "../../store/reviewSlice";
import ReviewAnalytics from "./ReviewAnalytics";

export default function ModeratorDashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  if (!user || user.role !== "ADMIN") {
    return <p className="text-red-500">Access denied. Moderator only.</p>;
  }

  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        const data = await getFlaggedReviews();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching flagged reviews:", err);
        setError("Failed to load flagged reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchFlagged();
  }, []);

  const handleModerate = async (id: string, status: string) => {
    try {
      const updated = await moderateReview(id, status);
      setReviews(reviews.map(r => r.id === id ? updated : r));
    } catch (err) {
      console.error("Error moderating review:", err);
      setError("Failed to moderate review");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">🛡️ Moderator Dashboard</h1>

      {/* Analytics Panel */}
      <ReviewAnalytics />

      {/* Flagged Reviews Section */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">🚨 Flagged Reviews</h2>

        {loading && <p>Loading flagged reviews...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && reviews.length === 0 && (
          <p>No flagged reviews pending moderation.</p>
        )}

        {reviews.map(r => (
          <div key={r.id} className="border p-4 mb-3 rounded">
            <p className="font-medium">{r.text}</p>
            <p className="text-sm text-gray-600">Status: {r.moderationStatus}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleModerate(r.id, "APPROVED")}
                className="text-green-600 hover:underline"
              >
                Approve
              </button>
              <button
                onClick={() => handleModerate(r.id, "REJECTED")}
                className="text-red-600 hover:underline"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

