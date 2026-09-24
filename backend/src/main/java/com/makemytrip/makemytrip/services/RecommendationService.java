package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private UserInteractionService userInteractionService;

    @Autowired
    private FlightRespository flightRespository;

    @Autowired
    private HotelRespository hotelRespository;

    @Autowired
    private UserRepository userRepository;


    public List<Recommendation> generateRecommendationsForUser(String userId, int limit) {

        cleanupExpiredRecommendations();

        List<Recommendation> existingActive = recommendationRepository
                .findByUserIdAndStatusOrderByConfidenceScoreDesc(userId, "ACTIVE");

        if (existingActive.size() >= limit) {
            return existingActive.stream().limit(limit).collect(Collectors.toList());
        }

        List<Recommendation> newRecommendations = new ArrayList<>();

        newRecommendations.addAll(generateCollaborativeFilteringRecommendations(userId));
        newRecommendations.addAll(generateContentBasedRecommendations(userId));

        if (newRecommendations.isEmpty()) {
            newRecommendations.addAll(generatePopularityBasedRecommendations());
        }


        newRecommendations = newRecommendations.stream()
                .filter(rec -> rec.getEntityId() != null || rec.getDestination() != null)
                .collect(Collectors.toMap(
                        rec -> rec.getEntityId() != null ? rec.getEntityId() : rec.getDestination(),
                        rec -> rec,
                        (existing, replacement) -> existing
                ))
                .values().stream()
                .collect(Collectors.toList());

        for (Recommendation rec : newRecommendations) {
            boolean exists = existingActive.stream()
                    .anyMatch(e -> (e.getEntityId() != null && e.getEntityId().equals(rec.getEntityId())) ||
                            (e.getDestination() != null && e.getDestination().equals(rec.getDestination())));
            if (!exists) {
                recommendationRepository.save(rec);
            }
        }

        List<Recommendation> allRecommendations = recommendationRepository
                .findByUserIdAndStatusOrderByConfidenceScoreDesc(userId, "ACTIVE");

        return allRecommendations.stream().limit(limit).collect(Collectors.toList());
    }



    private List<Recommendation> generateCollaborativeFilteringRecommendations(String userId) {

        List<Recommendation> recommendations = new ArrayList<>();

        List<UserInteraction> userBookings = userInteractionService.getUserBookings(userId);
        Set<String> userDestinations = userBookings.stream()
                .map(UserInteraction::getDestination)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<String> userCategories = userBookings.stream()
                .map(UserInteraction::getCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (userDestinations.isEmpty() && userCategories.isEmpty()) {
            return recommendations;
        }

        List<Users> allUsers = userRepository.findAll();
        Map<String, Double> similarUsers = new HashMap<>();

        for (Users otherUser : allUsers) {
            if (otherUser.getId().equals(userId)) continue;

            List<UserInteraction> otherBookings = userInteractionService.getUserBookings(otherUser.getId());

            Set<String> otherDestinations = otherBookings.stream()
                    .map(UserInteraction::getDestination)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            Set<String> otherCategories = otherBookings.stream()
                    .map(UserInteraction::getCategory)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            Set<String> commonDestinations = new HashSet<>(userDestinations);
            commonDestinations.retainAll(otherDestinations);

            Set<String> commonCategories = new HashSet<>(userCategories);
            commonCategories.retainAll(otherCategories);

            double destinationSimilarity = userDestinations.isEmpty() ? 0 :
                    (double) commonDestinations.size() / userDestinations.size();

            double categorySimilarity = userCategories.isEmpty() ? 0 :
                    (double) commonCategories.size() / userCategories.size();

            double totalSimilarity = (destinationSimilarity * 0.6) + (categorySimilarity * 0.4);

            if (totalSimilarity > 0.3) {
                similarUsers.put(otherUser.getId(), totalSimilarity);
            }
        }

        Map<String, Double> recommendedEntities = new HashMap<>();

        for (Map.Entry<String, Double> similarUser : similarUsers.entrySet()) {
            String similarUserId = similarUser.getKey();
            double similarityScore = similarUser.getValue();

            List<UserInteraction> similarUserBookings = userInteractionService.getUserBookings(similarUserId);

            for (UserInteraction interaction : similarUserBookings) {
                String entityId = interaction.getEntityId();
                if (entityId != null && !userBookings.stream().anyMatch(b -> entityId.equals(b.getEntityId()))) {
                    double currentScore = recommendedEntities.getOrDefault(entityId, 0.0);
                    recommendedEntities.put(entityId, currentScore + similarityScore);
                }
            }
        }

        for (Map.Entry<String, Double> entry : recommendedEntities.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toList())) {

            String entityId = entry.getKey();
            double confidence = Math.min(entry.getValue(), 1.0);

            Optional<Flight> flight = flightRespository.findById(entityId);
            if (flight.isPresent()) {
                Flight f = flight.get();
                Recommendation rec = new Recommendation(
                        userId, "FLIGHT", entityId, f.getFlightName(),
                        "Similar users booked this flight", confidence
                );
                rec.setAlgorithmUsed("COLLABORATIVE_FILTERING");
                rec.setCategory(inferCategoryFromDestination(f.getTo()));
                rec.setImageUrl(f.getFlightImage());
                rec.setPrice(f.getCurrentPrice() > 0 ? f.getCurrentPrice() : f.getPrice());
                recommendations.add(rec);
            }

            Optional<Hotel> hotel = hotelRespository.findById(entityId);
            if (hotel.isPresent()) {
                Hotel h = hotel.get();
                Recommendation rec = new Recommendation(
                        userId, "HOTEL", entityId, h.getHotelName(),
                        "Similar users booked this hotel", confidence
                );
                rec.setAlgorithmUsed("COLLABORATIVE_FILTERING");
                rec.setCategory(inferCategoryFromDestination(h.getLocation()));
                rec.setImageUrl(h.getHotelImage());
                rec.setPrice(h.getCurrentPrice() > 0 ? h.getCurrentPrice() : h.getPricePerNight());
                recommendations.add(rec);
            }
        }

        return recommendations;
    }



    private List<Recommendation> generateContentBasedRecommendations(String userId) {

        List<Recommendation> recommendations = new ArrayList<>();

        List<String> preferredDestinations = userInteractionService.getUserDestinations(userId);
        List<String> preferredCategories = userInteractionService.getUserPreferredCategories(userId);

        if (preferredDestinations.isEmpty() && preferredCategories.isEmpty()) {
            return recommendations;
        }

        List<UserInteraction> userBookings = userInteractionService.getUserBookings(userId);
        Set<String> bookedEntityIds = userBookings.stream()
                .map(UserInteraction::getEntityId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());


        List<Flight> allFlights = flightRespository.findAll();

        for (Flight flight : allFlights) {
            if (bookedEntityIds.contains(flight.getId())) continue;

            String flightDestination = flight.getTo();
            double score = 0.0;
            String reason = "";

            if (preferredDestinations.contains(flightDestination)) {
                score += 0.7;
                reason = "You've shown interest in " + flightDestination;
            }

            String category = inferCategoryFromDestination(flightDestination);
            if (preferredCategories.contains(category)) {
                score += 0.3;
                reason = reason.isEmpty() ? "You like " + category + " destinations" : reason + " and " + category + " destinations";
            }

            if (score > 0.5) {
                Recommendation rec = new Recommendation(
                        userId, "FLIGHT", flight.getId(), flight.getFlightName(),
                        reason, Math.min(score, 1.0)
                );
                rec.setAlgorithmUsed("CONTENT_BASED");
                rec.setCategory(category);
                rec.setImageUrl(flight.getFlightImage());
                rec.setPrice(flight.getCurrentPrice() > 0 ? flight.getCurrentPrice() : flight.getPrice());
                recommendations.add(rec);
            }
        }


        List<Hotel> allHotels = hotelRespository.findAll();

        for (Hotel hotel : allHotels) {
            if (bookedEntityIds.contains(hotel.getId())) continue;

            String hotelLocation = hotel.getLocation();
            double score = 0.0;
            String reason = "";

            if (preferredDestinations.contains(hotelLocation)) {
                score += 0.7;
                reason = "You've shown interest in " + hotelLocation;
            }

            String category = inferCategoryFromDestination(hotelLocation);
            if (preferredCategories.contains(category)) {
                score += 0.3;
                reason = reason.isEmpty() ? "You like " + category + " destinations" : reason + " and " + category + " destinations";
            }

            if (score > 0.5) {
                Recommendation rec = new Recommendation(
                        userId, "HOTEL", hotel.getId(), hotel.getHotelName(),
                        reason, Math.min(score, 1.0)
                );
                rec.setAlgorithmUsed("CONTENT_BASED");
                rec.setCategory(category);
                rec.setImageUrl(hotel.getHotelImage());
                rec.setPrice(hotel.getCurrentPrice() > 0 ? hotel.getCurrentPrice() : hotel.getPricePerNight());
                recommendations.add(rec);
            }
        }


        if (!preferredCategories.isEmpty()) {
            Set<String> recommendedDestinations = new HashSet<>();
            for (String category : preferredCategories) {
                String destination = getPopularDestinationForCategory(category);
                if (destination != null && !preferredDestinations.contains(destination) && !recommendedDestinations.contains(destination)) {
                    recommendedDestinations.add(destination);
                    String reason = getReasonForDestinationRecommendation(category);
                    Recommendation rec = new Recommendation(
                            userId, destination, "Explore " + destination,
                            reason, category, 0.8, true
                    );
                    rec.setAlgorithmUsed("CONTENT_BASED");
                    rec.setImageUrl(getDestinationImageUrl(destination));
                    recommendations.add(rec);
                }
            }
        }

        return recommendations.stream().limit(10).collect(Collectors.toList());
    }


    private List<Recommendation> generatePopularityBasedRecommendations() {

        List<Recommendation> recommendations = new ArrayList<>();

        List<Flight> allFlights = flightRespository.findAll();

        for (Flight flight : allFlights.stream().limit(5).collect(Collectors.toList())) {
            Recommendation rec = new Recommendation(
                    null, "FLIGHT", flight.getId(), flight.getFlightName(),
                    "Popular choice among travelers", 0.6
            );
            rec.setAlgorithmUsed("POPULARITY");
            rec.setCategory(inferCategoryFromDestination(flight.getTo()));
            rec.setImageUrl(flight.getFlightImage());
            rec.setPrice(flight.getCurrentPrice() > 0 ? flight.getCurrentPrice() : flight.getPrice());
            recommendations.add(rec);
        }

        List<Hotel> allHotels = hotelRespository.findAll();

        for (Hotel hotel : allHotels.stream().limit(5).collect(Collectors.toList())) {
            Recommendation rec = new Recommendation(
                    null, "HOTEL", hotel.getId(), hotel.getHotelName(),
                    "Popular choice among travelers", 0.6
            );
            rec.setAlgorithmUsed("POPULARITY");
            rec.setCategory(inferCategoryFromDestination(hotel.getLocation()));
            rec.setImageUrl(hotel.getHotelImage());
            rec.setPrice(hotel.getCurrentPrice() > 0 ? hotel.getCurrentPrice() : hotel.getPricePerNight());
            recommendations.add(rec);
        }

        return recommendations;
    }



    public void handleRecommendationFeedback(String userId, String recommendationId, String feedback) {

        Optional<Recommendation> recOptional = recommendationRepository.findById(recommendationId);

        if (recOptional.isPresent()) {
            Recommendation rec = recOptional.get();
            rec.setUserFeedback(feedback);
            rec.setFeedbackAt(LocalDateTime.now());
            recommendationRepository.save(rec);

            userInteractionService.logRecommendationFeedback(userId, recommendationId, feedback);

            if ("NOT_HELPFUL".equals(feedback)) {
                adjustSimilarRecommendations(rec);
            }
        }
    }

    public void markRecommendationClicked(String recommendationId) {
        Optional<Recommendation> recOptional = recommendationRepository.findById(recommendationId);
        if (recOptional.isPresent()) {
            Recommendation rec = recOptional.get();
            rec.setStatus("CLICKED");
            recommendationRepository.save(rec);
        }
    }

    public void markRecommendationBooked(String recommendationId) {
        Optional<Recommendation> recOptional = recommendationRepository.findById(recommendationId);
        if (recOptional.isPresent()) {
            Recommendation rec = recOptional.get();
            rec.setStatus("BOOKED");
            rec.setUserFeedback("HELPFUL");
            recommendationRepository.save(rec);
        }
    }



    private void cleanupExpiredRecommendations() {
        List<Recommendation> expired = recommendationRepository
                .findByExpiresAtBeforeAndStatus(LocalDateTime.now(), "ACTIVE");

        for (Recommendation rec : expired) {
            rec.setStatus("EXPIRED");
            recommendationRepository.save(rec);
        }
    }

    private void adjustSimilarRecommendations(Recommendation rec) {

        List<Recommendation> similar = recommendationRepository
                .findByUserIdAndStatus(rec.getUserId(), "ACTIVE");

        similar = similar.stream()
                .filter(r -> rec.getCategory() != null && rec.getCategory().equals(r.getCategory()))
                .collect(Collectors.toList());

        for (Recommendation similarRec : similar) {
            if (!similarRec.getId().equals(rec.getId())) {
                double newConfidence = similarRec.getConfidenceScore() * 0.8;
                similarRec.setConfidenceScore(Math.max(0.3, newConfidence));
                recommendationRepository.save(similarRec);
            }
        }
    }

    private String inferCategoryFromDestination(String destination) {
        if (destination == null) return "GENERAL";

        String lowerDest = destination.toLowerCase();

        if (lowerDest.contains("goa") || lowerDest.contains("bali") || lowerDest.contains("maldives")) {
            return "BEACH";
        }
        if (lowerDest.contains("manali") || lowerDest.contains("shimla") || lowerDest.contains("darjeeling")) {
            return "MOUNTAIN";
        }
        if (lowerDest.contains("delhi") || lowerDest.contains("agra") || lowerDest.contains("jaipur")) {
            return "HERITAGE";
        }
        if (lowerDest.contains("rishikesh") || lowerDest.contains("bir")) {
            return "ADVENTURE";
        }
        if (lowerDest.contains("mumbai") || lowerDest.contains("bangalore")) {
            return "LUXURY";
        }

        return "GENERAL";
    }

    private String getPopularDestinationForCategory(String category) {
        switch (category) {
            case "BEACH": return "Goa";
            case "MOUNTAIN": return "Manali";
            case "HERITAGE": return "Jaipur";
            case "ADVENTURE": return "Rishikesh";
            case "LUXURY": return "Mumbai";
            default: return "Delhi";
        }
    }

    private String getReasonForDestinationRecommendation(String category) {
        switch (category) {
            case "BEACH": return "You love beach destinations! Try this paradise.";
            case "MOUNTAIN": return "You enjoy mountain views. Explore this hill station.";
            case "HERITAGE": return "You appreciate heritage sites. Visit this historic city.";
            case "ADVENTURE": return "You're an adventure seeker! Try this destination.";
            case "LUXURY": return "You prefer luxury travel. Experience this premium destination.";
            default: return "Based on your travel preferences";
        }
    }

    private String getDestinationImageUrl(String destination) {
        Map<String, String> destinationImages = new HashMap<>();

        destinationImages.put("Goa", "https://images.unsplash.com/photo-1512343879784-960f40e4bff3");
        destinationImages.put("Manali", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23");
        destinationImages.put("Jaipur", "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a");
        destinationImages.put("Rishikesh", "https://images.unsplash.com/photo-1544735716-392fe2489ffa");
        destinationImages.put("Mumbai", "https://images.unsplash.com/photo-1570168007204-d5f0a4b47d36");
        destinationImages.put("Delhi", "https://images.unsplash.com/photo-1587474260584-136574528ed5");
        return destinationImages.getOrDefault(destination, "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e");
    }
}