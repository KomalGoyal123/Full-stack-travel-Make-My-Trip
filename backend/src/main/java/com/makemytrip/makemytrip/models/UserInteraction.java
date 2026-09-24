package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_interactions")
public class UserInteraction {

    @Id
    private String id;


    private String userId;

    private String actionType;

    private String entityType;

    private String entityId;

    private String destination;

    private String category;

    private String searchKeyword;

    private String recommendationId;

    private String feedbackValue;

    private LocalDateTime interactedAt;



    public UserInteraction() {
        this.interactedAt = LocalDateTime.now();
    }

    public UserInteraction(String userId, String actionType, String entityType, String entityId) {
        this.userId = userId;
        this.actionType = actionType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.interactedAt = LocalDateTime.now();
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

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSearchKeyword() {
        return searchKeyword;
    }

    public void setSearchKeyword(String searchKeyword) {
        this.searchKeyword = searchKeyword;
    }

    public String getRecommendationId() {
        return recommendationId;
    }

    public void setRecommendationId(String recommendationId) {
        this.recommendationId = recommendationId;
    }

    public String getFeedbackValue() {
        return feedbackValue;
    }

    public void setFeedbackValue(String feedbackValue) {
        this.feedbackValue = feedbackValue;
    }

    public LocalDateTime getInteractedAt() {
        return interactedAt;
    }

    public void setInteractedAt(LocalDateTime interactedAt) {
        this.interactedAt = interactedAt;
    }
}