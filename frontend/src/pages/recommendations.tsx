"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/store";
import RecommendationList from "@/components/Recommendations/RecommendationList";
import Loader from "@/components/Loader";
import { Sparkles, TrendingUp, Clock, ChevronRight } from "lucide-react";

export default function RecommendationsPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 
  useEffect(() => {
    if (mounted && !user) {
      router.push("/");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return <Loader />;
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Your Personalized Picks</h1>
          </div>
          <p className="text-indigo-100 max-w-2xl">
            We've analyzed your travel history and preferences to bring you these hand-picked 
            recommendations. The more you interact, the smarter our suggestions become!
          </p>
          
          {/* Stats Section */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Smart Algorithm</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Updated in real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommendation List */}
        <RecommendationList
          userId={user.id}
          limit={12}
          showFilters={true}
          title="Recommended for You"
          className="mb-10"
        />

        {/* How it works section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            How our recommendations work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">We learn your preferences</h3>
              <p className="text-sm text-gray-500">
                Your searches, views, and bookings help us understand what you love.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart algorithms analyze</h3>
              <p className="text-sm text-gray-500">
                Collaborative filtering finds similar users with your taste.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Personalized suggestions</h3>
              <p className="text-sm text-gray-500">
                Get tailored recommendations with clear "why this?" explanations.
              </p>
            </div>
          </div>

          {/* Feedback tip */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <span>💡</span>
              <span>
                <strong>Pro tip:</strong> Mark recommendations as "Helpful" or "Not Helpful" 
                to improve future suggestions. Your feedback makes a difference!
              </span>
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1 mx-auto"
          >
            Continue exploring
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}