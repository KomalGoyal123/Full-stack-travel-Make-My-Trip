package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationRepository extends MongoRepository<Recommendation, String> {

    List<Recommendation> findByUserIdOrderByGeneratedAtDesc(String userId);

    List<Recommendation> findByUserIdAndStatusOrderByConfidenceScoreDesc(String userId, String status);

    List<Recommendation> findByUserIdAndStatus(String userId, String status);

    List<Recommendation> findTop10ByUserIdAndStatusOrderByConfidenceScoreDesc(String userId, String status);

    List<Recommendation> findByUserIdAndEntityTypeAndStatus(
            String userId, String entityType, String status);

    List<Recommendation> findByUserIdAndEntityTypeAndStatusOrderByConfidenceScoreDesc(
            String userId, String entityType, String status);

    List<Recommendation> findByUserIdAndCategoryAndStatus(
            String userId, String category, String status);

    List<Recommendation> findByUserIdAndUserFeedback(String userId, String userFeedback);

    List<Recommendation> findByUserIdAndUserFeedbackIsNullAndStatusNot(String userId, String status);

    List<Recommendation> findByUserIdAndAlgorithmUsed(String userId, String algorithmUsed);

    List<Recommendation> findByAlgorithmUsedAndUserFeedback(String algorithmUsed, String userFeedback);

    List<Recommendation> findByEntityId(String entityId);

    void deleteByEntityId(String entityId);

    List<Recommendation> findByUserIdAndGeneratedAtAfter(String userId, LocalDateTime since);

    List<Recommendation> findByExpiresAtBeforeAndStatus(LocalDateTime now, String status);


    List<Recommendation> findByUserIdAndGeneratedAtBetween(
            String userId, LocalDateTime start, LocalDateTime end);


    void deleteByUserId(String userId);


    void deleteByExpiresAtBefore(LocalDateTime date);


    void deleteByStatus(String status);

    long countByUserId(String userId);

    long countByUserIdAndStatus(String userId, String status);


    long countByUserIdAndUserFeedback(String userId, String userFeedback);


    long countByAlgorithmUsedAndUserFeedback(String algorithmUsed, String userFeedback);


    List<Recommendation> findByUserIdAndStatusAndCategory(String userId, String status, String category);
}