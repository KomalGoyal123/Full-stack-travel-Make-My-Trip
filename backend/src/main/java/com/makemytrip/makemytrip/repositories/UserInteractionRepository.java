package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.UserInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserInteractionRepository extends MongoRepository<UserInteraction, String> {

    List<UserInteraction> findByUserIdOrderByInteractedAtDesc(String userId);

    List<UserInteraction> findByUserIdAndActionTypeOrderByInteractedAtDesc(String userId, String actionType);

    List<UserInteraction> findByUserIdAndEntityTypeOrderByInteractedAtDesc(String userId, String entityType);

    List<UserInteraction> findByUserIdAndEntityId(String userId, String entityId);

    List<UserInteraction> findByUserIdAndActionType(String userId, String actionType);

    List<UserInteraction> findByUserIdAndActionTypeAndEntityType(String userId, String actionType, String entityType);

    List<UserInteraction> findByUserIdAndDestination(String userId, String destination);

    List<UserInteraction> findByUserIdAndCategory(String userId, String category);

    List<UserInteraction> findByRecommendationId(String recommendationId);

    List<UserInteraction> findByUserIdAndActionTypeAndFeedbackValue(
            String userId, String actionType, String feedbackValue);

    List<UserInteraction> findByUserIdAndActionTypeAndSearchKeywordNotNull(
            String userId, String actionType);

    List<UserInteraction> findByUserIdAndActionTypeAndInteractedAtAfter(
            String userId, String actionType, LocalDateTime since);

    List<UserInteraction> findByUserIdAndInteractedAtAfter(String userId, LocalDateTime since);

    List<UserInteraction> findByUserIdAndInteractedAtBetween(
            String userId, LocalDateTime start, LocalDateTime end);

    List<UserInteraction> findTop10ByUserIdOrderByInteractedAtDesc(String userId);

    void deleteByUserId(String userId);

    void deleteByInteractedAtBefore(LocalDateTime date);

    void deleteByRecommendationId(String recommendationId);

    long countByUserIdAndEntityIdAndActionType(String userId, String entityId, String actionType);

    long countByUserIdAndActionType(String userId, String actionType);


    long countByUserIdAndActionTypeAndFeedbackValue(String userId, String actionType, String feedbackValue);
}