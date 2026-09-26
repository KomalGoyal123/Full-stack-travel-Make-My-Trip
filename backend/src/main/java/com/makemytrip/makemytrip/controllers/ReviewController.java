package com.makemytrip.makemytrip.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class ReviewController {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }


    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewService.addReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<?> getHotelReviews(@PathVariable String hotelId) {
        try {
            List<Review> reviews = reviewService.getHotelReviews(hotelId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/flight/{flightId}")
    public ResponseEntity<?> getFlightReviews(@PathVariable String flightId) {
        try {
            List<Review> reviews = reviewService.getFlightReviews(flightId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @PostMapping("/reply/{reviewId}")
    public ResponseEntity<?> replyToReview(
            @PathVariable String reviewId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String replyText = body.get("reply");
            Optional<Review> review = reviewService.replyToReview(reviewId, replyText);

            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                return ResponseEntity.status(404).body("Review not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    // ✅ UPDATED: Cloudinary upload (permanent storage)
    @PostMapping("/uploadPhoto/{reviewId}")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable String reviewId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File empty");
            }

            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            String photoUrl = uploadResult.get("secure_url").toString();

            Optional<Review> review = reviewService.addPhotoToReview(reviewId, photoUrl);

            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                return ResponseEntity.status(404).body("Review not found");
            }

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload error: " + e.getMessage());
        }
    }


    @PostMapping("/flag/{reviewId}")
    public ResponseEntity<?> flagReview(@PathVariable String reviewId) {
        try {
            Optional<Review> review = reviewService.flagReview(reviewId);
            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                return ResponseEntity.status(404).body("Review not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @PostMapping("/helpful/{reviewId}")
    public ResponseEntity<?> markHelpful(
            @PathVariable String reviewId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String userId = body.get("userId");
            Optional<Review> review = reviewService.markHelpful(reviewId, userId);
            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                return ResponseEntity.status(404).body("Review not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @PostMapping("/moderate/{reviewId}")
    public ResponseEntity<?> moderateReview(
            @PathVariable String reviewId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");
            Optional<Review> review = reviewService.moderateReview(reviewId, status);
            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                return ResponseEntity.status(404).body("Review not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/hotel/{hotelId}/rating/{rating}")
    public ResponseEntity<?> filterHotelReviews(
            @PathVariable String hotelId,
            @PathVariable int rating
    ) {
        try {
            return ResponseEntity.ok(reviewService.filterHotelReviewsByRating(hotelId, rating));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/flight/{flightId}/rating/{rating}")
    public ResponseEntity<?> filterFlightReviews(
            @PathVariable String flightId,
            @PathVariable int rating
    ) {
        try {
            return ResponseEntity.ok(reviewService.filterFlightReviewsByRating(flightId, rating));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/hotel/{hotelId}/helpful")
    public ResponseEntity<?> getHelpfulHotelReviews(@PathVariable String hotelId) {
        try {
            return ResponseEntity.ok(reviewService.getMostHelpfulHotelReviews(hotelId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/flight/{flightId}/helpful")
    public ResponseEntity<?> getHelpfulFlightReviews(@PathVariable String flightId) {
        try {
            return ResponseEntity.ok(reviewService.getMostHelpfulFlightReviews(flightId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/flagged")
    public ResponseEntity<?> getFlaggedReviews() {
        try {
            return ResponseEntity.ok(reviewService.getFlaggedReviews());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        try {
            return ResponseEntity.ok(reviewService.getAnalytics());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}