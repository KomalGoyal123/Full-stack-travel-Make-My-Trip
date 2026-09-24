package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }


    public Review addReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (review.getText() == null || review.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Review text cannot be empty");
        }
        return reviewRepository.save(review);
    }

    public List<Review> getHotelReviews(String hotelId) {
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
    }

    public List<Review> getFlightReviews(String flightId) {
        return reviewRepository.findByFlightIdOrderByCreatedAtDesc(flightId);
    }


    public Optional<Review> replyToReview(String reviewId, String replyText) {
        return reviewRepository.findById(reviewId).map(review -> {
            if (review.getReplies() == null) {
                review.setReplies(new ArrayList<>());
            }
            review.getReplies().add(replyText);
            return reviewRepository.save(review);
        });
    }


    public Optional<Review> addPhotoToReview(String reviewId, String photoUrl) {
        return reviewRepository.findById(reviewId).map(review -> {
            if (review.getPhotos() == null) {
                review.setPhotos(new ArrayList<>());
            }
            review.getPhotos().add(photoUrl);
            return reviewRepository.save(review);
        });
    }

    public Optional<Review> flagReview(String reviewId) {
        return reviewRepository.findById(reviewId).map(review -> {
            review.setFlagged(true);
            review.setModerationStatus("PENDING");
            return reviewRepository.save(review);
        });
    }


    public Optional<Review> moderateReview(String reviewId, String status) {
        return reviewRepository.findById(reviewId).map(review -> {
            if (!Arrays.asList("APPROVED", "REJECTED").contains(status)) {
                throw new IllegalArgumentException("Invalid moderation status");
            }
            review.setModerationStatus(status);
            return reviewRepository.save(review);
        });
    }


    public Optional<Review> markHelpful(String reviewId, String userId) {
        return reviewRepository.findById(reviewId).map(review -> {
            if (review.getHelpfulUserIds() == null) {
                review.setHelpfulUserIds(new ArrayList<>());
            }
            if (!review.getHelpfulUserIds().contains(userId)) {
                review.getHelpfulUserIds().add(userId);
                review.setHelpfulCount(review.getHelpfulCount() + 1);
            }
            return reviewRepository.save(review);
        });
    }

    public List<Review> filterHotelReviewsByRating(String hotelId, int rating) {
        return reviewRepository.findByHotelIdAndRating(hotelId, rating);
    }

    public List<Review> filterFlightReviewsByRating(String flightId, int rating) {
        return reviewRepository.findByFlightIdAndRating(flightId, rating);
    }


    public List<Review> getMostHelpfulHotelReviews(String hotelId) {
        return reviewRepository.findByHotelIdOrderByHelpfulCountDesc(hotelId);
    }

    public List<Review> getMostHelpfulFlightReviews(String flightId) {
        return reviewRepository.findByFlightIdOrderByHelpfulCountDesc(flightId);
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByFlaggedTrue();
    }

    public Map<String, Object> getAnalytics() {
        List<Review> allReviews = reviewRepository.findAll();

        long total = allReviews.size();
        long approved = allReviews.stream()
                .filter(r -> "APPROVED".equalsIgnoreCase(r.getModerationStatus()))
                .count();
        long rejected = allReviews.stream()
                .filter(r -> "REJECTED".equalsIgnoreCase(r.getModerationStatus()))
                .count();
        long flagged = allReviews.stream()
                .filter(r -> r.isFlagged())
                .count();

        double avgHelpful = allReviews.stream()
                .mapToInt(r -> Optional.ofNullable(r.getHelpfulCount()).orElse(0))
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("flagged", flagged);
        stats.put("avgHelpful", avgHelpful);

        return stats;
    }
}

