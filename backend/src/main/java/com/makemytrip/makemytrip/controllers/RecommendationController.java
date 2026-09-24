package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Recommendation;
import com.makemytrip.makemytrip.services.RecommendationService;
import com.makemytrip.makemytrip.services.UserInteractionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserInteractionService userInteractionService;




    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRecommendationsForUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            List<Recommendation> recommendations = recommendationService
                    .generateRecommendationsForUser(userId, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("recommendations", recommendations);
            response.put("count", recommendations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }


    @GetMapping("/user/{userId}/active")
    public ResponseEntity<?> getActiveRecommendationsForUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            List<Recommendation> allRecommendations = recommendationService
                    .generateRecommendationsForUser(userId, limit * 2);

            List<Recommendation> activeRecommendations = allRecommendations.stream()
                    .filter(r -> "ACTIVE".equals(r.getStatus()))
                    .limit(limit)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("recommendations", activeRecommendations);
            response.put("count", activeRecommendations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }




    @PostMapping("/interaction/view")
    public ResponseEntity<?> logViewInteraction(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            String entityType = body.get("entityType");
            String entityId = body.get("entityId");

            if (userId == null || entityType == null || entityId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Missing required fields: userId, entityType, entityId"
                ));
            }

            userInteractionService.logView(userId, entityType, entityId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "View interaction logged successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @PostMapping("/interaction/click")
    public ResponseEntity<?> logClickInteraction(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            String entityType = body.get("entityType");
            String entityId = body.get("entityId");
            String recommendationId = body.get("recommendationId");

            if (userId == null || entityType == null || entityId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Missing required fields: userId, entityType, entityId"
                ));
            }

            userInteractionService.logClick(userId, entityType, entityId, recommendationId);


            if (recommendationId != null) {
                recommendationService.markRecommendationClicked(recommendationId);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Click interaction logged successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @PostMapping("/interaction/search")
    public ResponseEntity<?> logSearchInteraction(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            String keyword = body.get("keyword");
            String destination = body.get("destination");
            String category = body.get("category");

            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "userId is required"
                ));
            }

            userInteractionService.logSearch(userId, keyword, destination, category);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Search interaction logged successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/feedback")
    public ResponseEntity<?> submitRecommendationFeedback(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            String recommendationId = body.get("recommendationId");
            String feedback = body.get("feedback");

            if (userId == null || recommendationId == null || feedback == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Missing required fields: userId, recommendationId, feedback"
                ));
            }

            if (!feedback.equals("HELPFUL") && !feedback.equals("NOT_HELPFUL")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Feedback must be HELPFUL or NOT_HELPFUL"
                ));
            }

            recommendationService.handleRecommendationFeedback(userId, recommendationId, feedback);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Feedback submitted successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/booked")
    public ResponseEntity<?> markRecommendationBooked(@RequestBody Map<String, String> body) {
        try {
            String recommendationId = body.get("recommendationId");

            if (recommendationId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "recommendationId is required"
                ));
            }

            recommendationService.markRecommendationBooked(recommendationId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Recommendation marked as booked"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @GetMapping("/user/{userId}/history")
    public ResponseEntity<?> getUserInteractionHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "20") int limit) {

        try {
            List<com.makemytrip.makemytrip.models.UserInteraction> interactions =
                    userInteractionService.getUserInteractions(userId);

            List<com.makemytrip.makemytrip.models.UserInteraction> limited =
                    interactions.stream().limit(limit).toList();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("interactions", limited);
            response.put("count", limited.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }


    @GetMapping("/user/{userId}/preferences")
    public ResponseEntity<?> getUserPreferences(@PathVariable String userId) {
        try {
            List<String> preferredDestinations = userInteractionService.getUserDestinations(userId);
            List<String> preferredCategories = userInteractionService.getUserPreferredCategories(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("preferredDestinations", preferredDestinations);
            response.put("preferredCategories", preferredCategories);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }



    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "ACTIVE",
                "service", "Recommendation Service",
                "message", "Personalized recommendations API is running"
        ));
    }
}