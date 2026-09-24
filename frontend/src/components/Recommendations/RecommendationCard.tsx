"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ThumbsUp, ThumbsDown, Plane, Hotel, MapPin, Star } from "lucide-react";
import WhyThisTooltip from "./WhyThisTooltip";
import { submitFeedback, logClick } from "@/store/recommendationSlice";
import { AppDispatch, RootState } from "@/store";

interface RecommendationCardProps {
  recommendation: {
    id: string;
    userId: string;
    entityType: "FLIGHT" | "HOTEL" | "DESTINATION";
    entityId?: string;
    destination?: string;
    displayName: string;
    imageUrl?: string;
    price?: number;
    reason: string;
    reasonDetails?: string;
    algorithmUsed: string;
    confidenceScore: number;
    status: string;
    category?: string;
    userFeedback?: string;
  };
  onFeedback?: (id: string, feedback: string) => void;
}

export default function RecommendationCard({ recommendation, onFeedback }: RecommendationCardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(recommendation.userFeedback);
  const [isSaved, setIsSaved] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getImageUrl = () => {
    const name = recommendation.displayName?.toLowerCase() || "";
    const entityType = recommendation.entityType;
    
    if (imgError) {
      return "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=500&fit=crop";
    }
    
    if (name.includes("goa")) {
      return "https://images.unsplash.com/photo-1512343879784-960f40e4bff3?w=800&h=500&fit=crop";
    }
    if (name.includes("delhi")) {
      return "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop";
    }
    if (entityType === "FLIGHT" || name.includes("skyhigh") || name.includes("airone")) {
      return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop";
    }
    if (entityType === "HOTEL" || name.includes("luxury") || name.includes("seaside")) {
      return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop";
    }
    return "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=500&fit=crop";
  };

  const getEntityIcon = () => {
    switch (recommendation.entityType) {
      case "FLIGHT":
        return <Plane className="w-5 h-5 text-blue-500" />;
      case "HOTEL":
        return <Hotel className="w-5 h-5 text-green-500" />;
      case "DESTINATION":
        return <MapPin className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getCategoryBadge = () => {
    const category = recommendation.category;
    switch (category) {
      case "BEACH":
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🏖️ Beach</span>;
      case "MOUNTAIN":
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">⛰️ Mountain</span>;
      case "HERITAGE":
        return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🏛️ Heritage</span>;
      case "ADVENTURE":
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🧗 Adventure</span>;
      case "LUXURY":
        return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✨ Luxury</span>;
      default:
        return null;
    }
  };

  const getAlgorithmBadge = () => {
    const algorithm = recommendation.algorithmUsed;
    switch (algorithm) {
      case "COLLABORATIVE_FILTERING":
        return <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">👥 Similar Users</span>;
      case "CONTENT_BASED":
        return <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">📊 Your History</span>;
      case "POPULARITY":
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">🔥 Trending</span>;
      default:
        return null;
    }
  };

  const handleClick = async () => {
    if (!user?.id) return;

    try {
      if (recommendation.entityId) {
        await dispatch(logClick({
          userId: user.id,
          entityType: recommendation.entityType,
          entityId: recommendation.entityId,
          recommendationId: recommendation.id,
        }));
      }

      if (recommendation.entityType === "FLIGHT" && recommendation.entityId) {
        router.push(`/book-flight/${recommendation.entityId}`);
      } else if (recommendation.entityType === "HOTEL" && recommendation.entityId) {
        router.push(`/book-hotel/${recommendation.entityId}`);
      } else if (recommendation.entityType === "DESTINATION" && recommendation.destination) {
        router.push(`/?search=${encodeURIComponent(recommendation.destination)}`);
      }
    } catch (error) {
      console.error("Error handling click:", error);
    }
  };

  const handleFeedback = async (feedback: "HELPFUL" | "NOT_HELPFUL") => {
    if (!user?.id || feedbackLoading) return;

    setFeedbackLoading(true);
    try {
      await dispatch(submitFeedback({
        userId: user.id,
        recommendationId: recommendation.id,
        feedback,
      }));
      setLocalFeedback(feedback);
      onFeedback?.(recommendation.id, feedback);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const imageUrl = getImageUrl();

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 h-full flex flex-col">
      {/* Image Section - Height increased to match Best Offers */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 cursor-pointer flex-shrink-0" onClick={handleClick}>
        <img
          src={imageUrl}
          alt={recommendation.displayName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => {
           
            setImgError(true);
          }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition">
            View Details
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          {getCategoryBadge()}
        </div>

        {/* Algorithm Badge */}
        <div className="absolute top-3 right-3">
          {getAlgorithmBadge()}
        </div>

        {/* Entity Type Icon */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
          {getEntityIcon()}
        </div>

        {/* Price Tag */}
        {recommendation.price && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
            ₹{recommendation.price.toLocaleString()}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="font-bold text-gray-800 text-base cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1 flex-1"
            onClick={handleClick}
          >
            {recommendation.displayName}
          </h3>
          <WhyThisTooltip
            reason={recommendation.reason}
            reasonDetails={recommendation.reasonDetails}
            algorithmUsed={recommendation.algorithmUsed}
            confidenceScore={recommendation.confidenceScore}
            category={recommendation.category}
          />
        </div>

        {recommendation.destination && recommendation.entityType === "DESTINATION" && (
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {recommendation.destination}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">
          {recommendation.reason}
        </p>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Match</span>
            <span>{Math.round(recommendation.confidenceScore * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${recommendation.confidenceScore * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleFeedback("HELPFUL")}
              disabled={feedbackLoading || localFeedback === "HELPFUL"}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                localFeedback === "HELPFUL"
                  ? "bg-green-100 text-green-600"
                  : "text-gray-400 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              Helpful
            </button>
            <button
              onClick={() => handleFeedback("NOT_HELPFUL")}
              disabled={feedbackLoading || localFeedback === "NOT_HELPFUL"}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                localFeedback === "NOT_HELPFUL"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
              Not Helpful
            </button>
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className="transition-colors"
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ${
                isSaved 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-400 hover:text-red-500 hover:fill-red-500/20"
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}
