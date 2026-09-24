package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "recommendations")
public class Recommendation {

    @Id
    private String id;

    private String userId;


    private String entityType;

    private String entityId;

    private String destination;

    private String displayName;

    private String imageUrl;

    private double price;

    private String reason;

    private String reasonDetails;

    private String algorithmUsed;

    private double confidenceScore;

    private String status;

    private String category;

    private List<String> tags = new ArrayList<>();

    private LocalDateTime generatedAt;

    private LocalDateTime expiresAt;

    private String userFeedback;

    private LocalDateTime feedbackAt;


    public Recommendation() {
        this.status = "ACTIVE";
        this.generatedAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }

    public Recommendation(String userId, String entityType, String entityId,
                          String displayName, String reason, double confidenceScore) {
        this.userId = userId;
        this.entityType = entityType;
        this.entityId = entityId;
        this.displayName = displayName;
        this.reason = reason;
        this.confidenceScore = confidenceScore;
        this.status = "ACTIVE";
        this.generatedAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }

    public Recommendation(String userId, String destination, String displayName,
                          String reason, String category, double confidenceScore, boolean isDestination) {
        this.userId = userId;
        this.entityType = "DESTINATION";
        this.destination = destination;
        this.displayName = displayName;
        this.reason = reason;
        this.category = category;
        this.confidenceScore = confidenceScore;
        this.status = "ACTIVE";
        this.generatedAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReasonDetails() {
        return reasonDetails;
    }

    public void setReasonDetails(String reasonDetails) {
        this.reasonDetails = reasonDetails;
    }

    public String getAlgorithmUsed() {
        return algorithmUsed;
    }

    public void setAlgorithmUsed(String algorithmUsed) {
        this.algorithmUsed = algorithmUsed;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getUserFeedback() {
        return userFeedback;
    }

    public void setUserFeedback(String userFeedback) {
        this.userFeedback = userFeedback;
    }

    public LocalDateTime getFeedbackAt() {
        return feedbackAt;
    }

    public void setFeedbackAt(LocalDateTime feedbackAt) {
        this.feedbackAt = feedbackAt;
    }
}