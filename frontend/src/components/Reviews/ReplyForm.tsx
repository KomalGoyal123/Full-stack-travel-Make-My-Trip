import { useState } from "react";
import { replyReview } from "../../api/review";
import { useDispatch } from "react-redux";
import { addReply, setError } from "../../store/reviewSlice";

interface Props {
  reviewId: string;
}

export default function ReplyForm({ reviewId }: Props) {
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reply.trim()) {
      setErrorMsg("Reply cannot be empty.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await replyReview(reviewId, reply);
      dispatch(addReply({ reviewId, reply }));
      setReply("");
    } catch (err) {
      console.error("Error while replying:", err);
      setErrorMsg("Failed to submit reply. Please try again.");
      dispatch(setError("Reply submission failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className={`flex items-center font-medium ${
          loading ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
        }`}
      >
        {loading ? "Submitting..." : "💬 Reply"}
      </button>
      {errorMsg && (
        <span className="text-red-500 text-xs ml-2">{errorMsg}</span>
      )}
    </form>
  );
}

