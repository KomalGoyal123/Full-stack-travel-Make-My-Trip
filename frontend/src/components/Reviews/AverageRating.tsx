import { useSelector } from "react-redux";
import { Review } from "@/store/reviewSlice";

export default function AverageRating() {
  const reviews: Review[] = useSelector((state: any) => state.reviews?.reviews || []);

  if (reviews.length === 0) {
    return (
      <span className="text-gray-500 text-sm">
        No ratings yet
      </span>
    );
  }

 
  const validReviews = reviews.filter(r => r.moderationStatus !== "REJECTED");

  if (validReviews.length === 0) {
    return (
      <span className="text-gray-500 text-sm">
        No approved ratings yet
      </span>
    );
  }

 
  const avg = validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length;

  
  const breakdown = [1, 2, 3, 4, 5].map(star => ({
    star,
    count: validReviews.filter(r => r.rating === star).length,
  }));

  return (
    <div className="space-y-2">
      <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full font-medium">
        ★ {avg.toFixed(1)} / 5
      </span>

      <div className="space-y-1 text-sm text-gray-700">
        {breakdown.map(b => (
          <div key={b.star} className="flex items-center space-x-2">
            <span>{b.star}★</span>
            <div className="flex-1 bg-gray-200 rounded h-2">
              <div
                className="bg-yellow-500 h-2 rounded"
                style={{ width: `${(b.count / validReviews.length) * 100}%` }}
              ></div>
            </div>
            <span>{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

