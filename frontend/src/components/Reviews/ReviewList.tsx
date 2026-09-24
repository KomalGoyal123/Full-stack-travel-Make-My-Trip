import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReviews,
  flagReview as flagReviewAction,
  markHelpful as markHelpfulAction,
  moderateReview as moderateReviewAction,
  setError,
} from "../../store/reviewSlice";
import {
  getHotelReviews,
  getFlightReviews,
  flagReview,
  markHelpful,
  moderateReview,
  getMostHelpfulHotelReviews,
  getMostHelpfulFlightReviews,
  filterHotelReviewsByRating,
  filterFlightReviewsByRating,
} from "../../api/review";
import ReplyForm from "./ReplyForm";
import { Review } from "../../store/reviewSlice";

interface Props {
  hotelId?: string;
  flightId?: string;
}

export default function ReviewList({ hotelId, flightId }: Props) {
  const dispatch = useDispatch();
  const reviews: Review[] = useSelector((state: any) => state.reviews?.reviews || []);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const currentUser = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let data: Review[] = [];
        if (hotelId) {
          if (sortOption === "helpful") {
            data = await getMostHelpfulHotelReviews(hotelId);
          } else if (filterRating) {
            data = await filterHotelReviewsByRating(hotelId, filterRating);
          } else {
            data = await getHotelReviews(hotelId);
          }
        } else if (flightId) {
          if (sortOption === "helpful") {
            data = await getMostHelpfulFlightReviews(flightId);
          } else if (filterRating) {
            data = await filterFlightReviewsByRating(flightId, filterRating);
          } else {
            data = await getFlightReviews(flightId);
          }
        }
        dispatch(setReviews(data));
      } catch (err) {
        console.error("Error fetching reviews:", err);
        dispatch(setError("Failed to load reviews"));
      }
    };
    fetchReviews();
  }, [hotelId, flightId, sortOption, filterRating, dispatch]);

  const handleFlag = async (id: string) => {
    try {
      const updated = await flagReview(id);
      dispatch(flagReviewAction(updated.id));
    } catch (err) {
      console.error("Error flagging review:", err);
      dispatch(setError("Failed to flag review"));
    }
  };

  const handleHelpful = async (id: string, userId: string) => {
    try {
      const updated = await markHelpful(id, userId);
      dispatch(markHelpfulAction({ reviewId: updated.id, userId }));
    } catch (err) {
      console.error("Error marking helpful:", err);
      dispatch(setError("Failed to mark helpful"));
    }
  };

  const handleModerate = async (id: string, status: string) => {
    try {
      const updated = await moderateReview(id, status);
      dispatch(moderateReviewAction({ reviewId: updated.id, status }));
    } catch (err) {
      console.error("Error moderating review:", err);
      dispatch(setError("Failed to moderate review"));
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">✨ Customer Reviews</h3>

      {/* Sorting & Filtering Controls */}
      <div className="flex space-x-4 mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="helpful">Most Helpful</option>
        </select>

        <select
          value={filterRating || ""}
          onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5★</option>
          <option value="4">4★</option>
          <option value="3">3★</option>
          <option value="2">2★</option>
          <option value="1">1★</option>
        </select>
      </div>

      {reviews.map((r: Review) => (
        <div
          key={r.id}
          className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-lg p-6"
        >
          {/* Star rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < r.rating ? "#FFD700" : "#D1D5DB"}
                className="w-6 h-6 drop-shadow-md"
              >
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
              </svg>
            ))}
          </div>

          {/* Review text */}
          <p className="mt-3 text-gray-800">{r.text}</p>

          {/* Photos */}
          {r.photos && r.photos.length > 0 && (
            <div className="mt-4 flex space-x-2">
              {r.photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt="review photo"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}

          {/* Helpful votes */}
          <div className="mt-2 text-sm text-gray-600">
            👍 {r.helpfulCount || 0} found this helpful
            <button
              onClick={() => handleHelpful(r.id, currentUser?.id || "")}
              className="ml-2 text-blue-500 hover:underline"
              disabled={!currentUser?.id}
            >
              Mark Helpful
            </button>
          </div>

          {/* Flag status */}
          {r.flagged && (
            <span className="block mt-2 text-red-600 text-sm font-medium">
              ⚠️ Flagged (Status: {r.moderationStatus})
            </span>
          )}

          {/* Flag button */}
          <button
            onClick={() => handleFlag(r.id)}
            className="mt-3 text-sm text-red-500 hover:underline"
          >
            Flag as inappropriate
          </button>

          {/* Moderator controls (for admin UI) */}
          {r.flagged && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleModerate(r.id, "APPROVED")}
                className="text-green-600 hover:underline text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => handleModerate(r.id, "REJECTED")}
                className="text-red-600 hover:underline text-sm"
              >
                Reject
              </button>
            </div>
          )}

          {/* Replies */}
          {r.replies && r.replies.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Replies:</h4>
              {r.replies.map((reply: string, idx: number) => (
                <p
                  key={idx}
                  className="ml-4 text-gray-700 border-l pl-2 text-sm"
                >
                  ↳ {reply}
                </p>
              ))}
            </div>
          )}

          {/* Reply form box */}
          <div className="mt-4">
            <ReplyForm reviewId={r.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

