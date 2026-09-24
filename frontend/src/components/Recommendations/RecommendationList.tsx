"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchRecommendations,
  fetchActiveRecommendations,
  clearRecommendations,
} from "@/store/recommendationSlice";
import RecommendationCard from "./RecommendationCard";
import { Loader2, RefreshCw, Filter, X } from "lucide-react";

interface RecommendationListProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
  title?: string;
  className?: string;
}

export default function RecommendationList({
  userId,
  limit = 10,
  showFilters = true,
  title = "Recommended for You",
  className = "",
}: RecommendationListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    recommendations,
    activeRecommendations,
    loading,
    error,
    lastFetched,
  } = useSelector((state: RootState) => state.recommendations);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  useEffect(() => {
    if (userId) {
      if (showOnlyActive) {
        dispatch(fetchActiveRecommendations({ userId, limit: limit * 2 }));
      } else {
        dispatch(fetchRecommendations({ userId, limit: limit * 2 }));
      }
    }
  }, [userId, dispatch, limit, showOnlyActive]);

  const handleRefresh = () => {
    if (userId) {
      if (showOnlyActive) {
        dispatch(fetchActiveRecommendations({ userId, limit: limit * 2 }));
      } else {
        dispatch(fetchRecommendations({ userId, limit: limit * 2 }));
      }
    }
  };

  const handleClear = () => {
    dispatch(clearRecommendations());
  };

  let filteredRecommendations = showOnlyActive ? activeRecommendations : recommendations;
  
 
  if (showOnlyActive) {
    filteredRecommendations = filteredRecommendations.filter(
      (rec) => rec.status === "ACTIVE"
    );
  }

  if (filterType !== "all") {
    filteredRecommendations = filteredRecommendations.filter(
      (rec) => rec.entityType === filterType.toUpperCase()
    );
  }

  if (filterCategory !== "all") {
    filteredRecommendations = filteredRecommendations.filter(
      (rec) => rec.category === filterCategory.toUpperCase()
    );
  }

  filteredRecommendations = filteredRecommendations.slice(0, limit);

  const handleFeedback = (id: string, feedback: string) => {
    console.log(`Feedback for recommendation ${id}: ${feedback}`);
    setTimeout(() => {
      if (userId) {
        if (showOnlyActive) {
          dispatch(fetchActiveRecommendations({ userId, limit: limit * 2 }));
        } else {
          dispatch(fetchRecommendations({ userId, limit: limit * 2 }));
        }
      }
    }, 500);
  };

  if (loading && filteredRecommendations.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="mt-3 text-gray-500 text-sm">Loading personalized recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 text-indigo-600 text-sm hover:underline flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </button>
      </div>
    );
  }

  if (filteredRecommendations.length === 0) {
    return (
      <div className={`text-center py-12 bg-gray-50 rounded-xl ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🎯</span>
        </div>
        <p className="text-gray-500 text-sm">No recommendations available yet.</p>
        <p className="text-gray-400 text-xs mt-1">
          Start browsing flights and hotels to get personalized suggestions.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 text-indigo-600 text-sm hover:underline flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {lastFetched && (
            <p className="text-xs text-gray-400 mt-0.5">
              Updated {new Date(lastFetched).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showFilters && (
            <button
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                showOnlyActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {showOnlyActive ? "Active Only" : "All"}
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">Filter:</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600"
          >
            <option value="all">All Types</option>
            <option value="flight">Flights</option>
            <option value="hotel">Hotels</option>
            <option value="destination">Destinations</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600"
          >
            <option value="all">All Categories</option>
            <option value="beach">🏖️ Beach</option>
            <option value="mountain">⛰️ Mountain</option>
            <option value="heritage">🏛️ Heritage</option>
            <option value="adventure">🧗 Adventure</option>
            <option value="luxury">✨ Luxury</option>
          </select>

          {(filterType !== "all" || filterCategory !== "all") && (
            <button
              onClick={() => {
                setFilterType("all");
                setFilterCategory("all");
              }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onFeedback={handleFeedback}
          />
        ))}
      </div>
    </div>
  );
}