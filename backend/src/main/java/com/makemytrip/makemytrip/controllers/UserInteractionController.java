package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.UserInteraction;
import com.makemytrip.makemytrip.services.UserInteractionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interactions")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class UserInteractionController {

    @Autowired
    private UserInteractionService userInteractionService;




    @PostMapping("/view")
    public ResponseEntity<?> logView(@RequestBody Map<String, String> body) {
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

            UserInteraction interaction = userInteractionService.logView(userId, entityType, entityId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "View interaction logged successfully",
                    "interactionId", interaction.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/click")
    public ResponseEntity<?> logClick(@RequestBody Map<String, String> body) {
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

            UserInteraction interaction = userInteractionService.logClick(userId, entityType, entityId, recommendationId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Click interaction logged successfully",
                    "interactionId", interaction.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/book")
    public ResponseEntity<?> logBooking(@RequestBody Map<String, Object> body) {
        try {
            String userId = (String) body.get("userId");
            String entityType = (String) body.get("entityType");
            String entityId = (String) body.get("entityId");
            double amount = body.get("amount") != null ?
                    Double.parseDouble(body.get("amount").toString()) : 0;

            if (userId == null || entityType == null || entityId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Missing required fields: userId, entityType, entityId"
                ));
            }

            UserInteraction interaction = userInteractionService.logBooking(userId, entityType, entityId, amount);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking interaction logged successfully",
                    "interactionId", interaction.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @PostMapping("/search")
    public ResponseEntity<?> logSearch(@RequestBody Map<String, String> body) {
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

            UserInteraction interaction = userInteractionService.logSearch(userId, keyword, destination, category);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Search interaction logged successfully",
                    "interactionId", interaction.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @PostMapping("/feedback")
    public ResponseEntity<?> logRecommendationFeedback(@RequestBody Map<String, String> body) {
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

            UserInteraction interaction = userInteractionService.logRecommendationFeedback(userId, recommendationId, feedback);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Feedback logged successfully",
                    "interactionId", interaction.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserInteractions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "50") int limit) {

        try {
            List<UserInteraction> interactions = userInteractionService.getUserInteractions(userId);

            List<UserInteraction> limited = interactions.stream()
                    .limit(limit)
                    .toList();

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




    @GetMapping("/user/{userId}/bookings")
    public ResponseEntity<?> getUserBookings(@PathVariable String userId) {
        try {
            List<UserInteraction> bookings = userInteractionService.getUserBookings(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("bookings", bookings);
            response.put("count", bookings.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @GetMapping("/user/{userId}/destinations")
    public ResponseEntity<?> getUserDestinations(@PathVariable String userId) {
        try {
            List<String> destinations = userInteractionService.getUserDestinations(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("destinations", destinations);
            response.put("count", destinations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @GetMapping("/user/{userId}/categories")
    public ResponseEntity<?> getUserCategories(@PathVariable String userId) {
        try {
            List<String> categories = userInteractionService.getUserPreferredCategories(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("categories", categories);
            response.put("count", categories.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }




    @DeleteMapping("/cleanup")
    public ResponseEntity<?> cleanupOldInteractions() {
        try {
            userInteractionService.cleanupOldInteractions();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Old interactions cleaned up successfully"
            ));

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
                "service", "User Interaction Service",
                "message", "User interaction tracking API is running"
        ));
    }
}