package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.UserInteraction;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.UserInteractionRepository;
import com.makemytrip.makemytrip.repositories.FlightRespository;
import com.makemytrip.makemytrip.repositories.HotelRespository;
import com.makemytrip.makemytrip.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserInteractionService {

    @Autowired
    private UserInteractionRepository userInteractionRepository;

    @Autowired
    private FlightRespository flightRespository;

    @Autowired
    private HotelRespository hotelRespository;

    @Autowired
    private UserRepository userRepository;


    public UserInteraction logView(String userId, String entityType, String entityId) {
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setActionType("VIEW");
        interaction.setEntityType(entityType.toUpperCase());
        interaction.setEntityId(entityId);
        interaction.setInteractedAt(LocalDateTime.now());


        enrichInteractionWithMetadata(interaction, entityType, entityId);

        return userInteractionRepository.save(interaction);
    }


    public UserInteraction logClick(String userId, String entityType, String entityId, String recommendationId) {
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setActionType("CLICK");
        interaction.setEntityType(entityType.toUpperCase());
        interaction.setEntityId(entityId);
        interaction.setRecommendationId(recommendationId);
        interaction.setInteractedAt(LocalDateTime.now());

        enrichInteractionWithMetadata(interaction, entityType, entityId);

        return userInteractionRepository.save(interaction);
    }


    public UserInteraction logBooking(String userId, String entityType, String entityId, double amount) {
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setActionType("BOOK");
        interaction.setEntityType(entityType.toUpperCase());
        interaction.setEntityId(entityId);
        interaction.setInteractedAt(LocalDateTime.now());

        enrichInteractionWithMetadata(interaction, entityType, entityId);

        return userInteractionRepository.save(interaction);
    }


    public UserInteraction logSearch(String userId, String searchKeyword, String destination, String category) {
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setActionType("SEARCH");
        interaction.setSearchKeyword(searchKeyword);
        interaction.setDestination(destination);
        interaction.setCategory(category);
        interaction.setInteractedAt(LocalDateTime.now());

        return userInteractionRepository.save(interaction);
    }


    public UserInteraction logRecommendationFeedback(String userId, String recommendationId, String feedbackValue) {
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setActionType("RATE_RECOMMENDATION");
        interaction.setRecommendationId(recommendationId);
        interaction.setFeedbackValue(feedbackValue);
        interaction.setInteractedAt(LocalDateTime.now());

        return userInteractionRepository.save(interaction);
    }


    private void enrichInteractionWithMetadata(UserInteraction interaction, String entityType, String entityId) {
        if ("FLIGHT".equalsIgnoreCase(entityType)) {
            Optional<Flight> flight = flightRespository.findById(entityId);
            if (flight.isPresent()) {
                Flight f = flight.get();

                interaction.setDestination(f.getTo());

                interaction.setCategory(inferCategoryFromDestination(f.getTo()));
            }
        } else if ("HOTEL".equalsIgnoreCase(entityType)) {
            Optional<Hotel> hotel = hotelRespository.findById(entityId);
            if (hotel.isPresent()) {
                Hotel h = hotel.get();
                interaction.setDestination(h.getLocation());
                interaction.setCategory(inferCategoryFromDestination(h.getLocation()));
            }
        }
    }


    private String inferCategoryFromDestination(String destination) {
        if (destination == null) return "GENERAL";

        String lowerDest = destination.toLowerCase();


        if (lowerDest.contains("goa") || lowerDest.contains("bali") || lowerDest.contains("maldives") ||
                lowerDest.contains("phuket") || lowerDest.contains("kerala") || lowerDest.contains("gokarna")) {
            return "BEACH";
        }

        if (lowerDest.contains("manali") || lowerDest.contains("shimla") || lowerDest.contains("darjeeling") ||
                lowerDest.contains("nainital") || lowerDest.contains("mussoorie") || lowerDest.contains("leh")) {
            return "MOUNTAIN";
        }

        if (lowerDest.contains("delhi") || lowerDest.contains("agra") || lowerDest.contains("jaipur") ||
                lowerDest.contains("varanasi") || lowerDest.contains("udaipur") || lowerDest.contains("jodhpur")) {
            return "HERITAGE";
        }

        if (lowerDest.contains("rishikesh") || lowerDest.contains("bir") || lowerDest.contains("dharamshala")) {
            return "ADVENTURE";
        }

        if (lowerDest.contains("mumbai") || lowerDest.contains("bangalore") || lowerDest.contains("chennai")) {
            return "LUXURY";
        }

        return "GENERAL";
    }


    public List<UserInteraction> getUserInteractions(String userId) {
        return userInteractionRepository.findByUserIdOrderByInteractedAtDesc(userId);
    }


    public List<UserInteraction> getUserBookings(String userId) {
        return userInteractionRepository.findByUserIdAndActionType(userId, "BOOK");
    }


    public List<UserInteraction> getUserViews(String userId) {
        return userInteractionRepository.findByUserIdAndActionType(userId, "VIEW");
    }


    public List<String> getUserDestinations(String userId) {
        List<UserInteraction> interactions = userInteractionRepository.findByUserIdOrderByInteractedAtDesc(userId);
        return interactions.stream()
                .map(UserInteraction::getDestination)
                .filter(dest -> dest != null && !dest.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }


    public List<String> getUserPreferredCategories(String userId) {
        List<UserInteraction> interactions = userInteractionRepository.findByUserIdOrderByInteractedAtDesc(userId);


        java.util.Map<String, Long> categoryCount = interactions.stream()
                .filter(i -> i.getCategory() != null)
                .collect(Collectors.groupingBy(UserInteraction::getCategory, Collectors.counting()));

        return categoryCount.entrySet().stream()
                .sorted(java.util.Map.Entry.<String, Long>comparingByValue().reversed())
                .map(java.util.Map.Entry::getKey)
                .collect(Collectors.toList());
    }


    public List<UserInteraction> getRecentViews(String userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return userInteractionRepository.findByUserIdAndActionTypeAndInteractedAtAfter(
                userId, "VIEW", thirtyDaysAgo);
    }


    public List<UserInteraction> getRecommendationFeedback(String userId) {
        return userInteractionRepository.findByUserIdAndActionType(userId, "RATE_RECOMMENDATION");
    }


    public long getHelpfulFeedbackCount(String userId) {
        return userInteractionRepository.countByUserIdAndActionTypeAndFeedbackValue(
                userId, "RATE_RECOMMENDATION", "HELPFUL");
    }


    public void cleanupOldInteractions() {
        LocalDateTime ninetyDaysAgo = LocalDateTime.now().minusDays(90);
        userInteractionRepository.deleteByInteractedAtBefore(ninetyDaysAgo);
    }
}