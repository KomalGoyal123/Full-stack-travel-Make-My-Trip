import { useState } from "react";
import { addReview, uploadPhoto } from "../../api/review";
import { useDispatch, useSelector } from "react-redux";
import { addReview as addReviewAction, NewReview, setError } from "../../store/reviewSlice";

interface Props {
  hotelId?: string;
  flightId?: string;
}

export default function ReviewForm({ hotelId, flightId }: Props) {
  const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);
  const [text, setText] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be logged in to submit a review.");
      return;
    }

    const rating = stars.filter(Boolean).length;

    if (rating === 0) {
      setErrorMsg("Please select a star rating.");
      return;
    }

    if (!text.trim()) {
      setErrorMsg("Review text cannot be empty.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const review: NewReview = {
      userId: user.id,
      hotelId,
      flightId,
      rating,
      text,
      photos: [],
      replies: [],
      flagged: false,
      createdAt: new Date().toISOString(),
      moderationStatus: "PENDING",
      helpfulCount: 0,
      helpfulUserIds: [],
    };

    try {
      const saved = await addReview(review);

     
      let updated = saved;
      for (const file of photos) {
        updated = await uploadPhoto(saved.id, file);
      }

      dispatch(addReviewAction(updated));

      
      setStars([false, false, false, false, false]);
      setText("");
      setPhotos([]);
    } catch (err) {
      console.error("Error while submitting review:", err);
      setErrorMsg("Failed to submit review. Please try again.");
      dispatch(setError("Review submission failed"));
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (index: number) => {
    const newStars = [...stars];
    newStars[index] = !newStars[index];
    setStars(newStars);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-300"
    >
      <h3 className="text-2xl font-bold text-gray-900 tracking-wide">✨ Write a Review</h3>

      {/* Star rating */}
      <div className="flex items-center space-x-1">
        {stars.map((active, i) => (
          <svg
            key={i}
            onClick={() => toggleStar(i)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={active ? "#FFD700" : "#D1D5DB"}
            className="w-7 h-7 cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-md"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
        ))}
      </div>

      {/* Review text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-2 block w-full border-gray-300 rounded-xl shadow-md focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm p-4 text-gray-800 placeholder-gray-400 transition duration-200"
        rows={5}
        placeholder="Share your luxurious experience..."
        disabled={loading}
      />

      {/* Multiple photo upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setPhotos(Array.from(e.target.files || []))}
        className="mt-3"
        disabled={loading}
      />

      {/* Error message */}
      {errorMsg && (
        <span className="text-red-500 text-sm">{errorMsg}</span>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 font-semibold rounded-xl shadow-lg transition-transform duration-300 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white hover:shadow-2xl hover:scale-105"
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

