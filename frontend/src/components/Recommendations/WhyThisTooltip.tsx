"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";

interface WhyThisTooltipProps {
  reason: string;
  reasonDetails?: string;
  algorithmUsed?: string;
  confidenceScore?: number;
  category?: string;
}

export default function WhyThisTooltip({
  reason,
  reasonDetails,
  algorithmUsed,
  confidenceScore,
  category,
}: WhyThisTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case "BEACH": return "🏖️";
      case "MOUNTAIN": return "⛰️";
      case "HERITAGE": return "🏛️";
      case "ADVENTURE": return "🧗";
      case "LUXURY": return "✨";
      default: return "🎯";
    }
  };

  const getAlgorithmLabel = (alg?: string) => {
    switch (alg) {
      case "COLLABORATIVE_FILTERING": return "Similar users also liked this";
      case "CONTENT_BASED": return "Based on your travel history";
      case "POPULARITY": return "Trending among travelers";
      default: return "Personalized for you";
    }
  };

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
        aria-label="Why this recommendation?"
      >
        <Info className="w-4 h-4" />
      </button>

      {/* Modal Popup - Screen ke center me khulega, pura dikhega */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-80 max-w-[90%] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-xl">{getCategoryIcon(category)}</span>
                <h3 className="text-white font-semibold">Why this recommendation?</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              {/* Main Reason */}
              <div className="bg-indigo-50 rounded-xl p-3">
                <p className="text-indigo-800 text-sm font-medium">
                  {reason}
                </p>
              </div>

              {/* Detailed Reason */}
              {reasonDetails && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Details</p>
                  <p className="text-gray-600 text-sm">
                    {reasonDetails}
                  </p>
                </div>
              )}

              {/* Algorithm */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">How we know</span>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  {getAlgorithmLabel(algorithmUsed)}
                </span>
              </div>

              {/* Confidence Score */}
              {confidenceScore && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Match confidence</span>
                    <span className="font-semibold text-indigo-600">
                      {Math.round(confidenceScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${confidenceScore * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="border-t pt-3 mt-2">
                <p className="text-[11px] text-gray-400 text-center">
                  Your feedback helps us improve recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
