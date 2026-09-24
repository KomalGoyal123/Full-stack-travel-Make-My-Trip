package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "price_history")
public class PriceHistory {

    @Id
    private String id;

    private String entityId;

    private String entityType;

    private double oldPrice;

    private double newPrice;

    private double priceDifference;

    private double percentageChange;

    private String changeReason;

    private String triggerType;

    private String description;


    private LocalDateTime changedAt;


    public PriceHistory() {
        this.changedAt = LocalDateTime.now();
    }

    public PriceHistory(
            String entityId,
            String entityType,
            double oldPrice,
            double newPrice,
            double priceDifference,
            double percentageChange,
            String changeReason,
            String triggerType,
            String description
    ) {
        this.entityId = entityId;
        this.entityType = entityType;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
        this.priceDifference = priceDifference;
        this.percentageChange = percentageChange;
        this.changeReason = changeReason;
        this.triggerType = triggerType;
        this.description = description;
        this.changedAt = LocalDateTime.now();
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public double getNewPrice() {
        return newPrice;
    }

    public void setNewPrice(double newPrice) {
        this.newPrice = newPrice;
    }

    public double getPriceDifference() {
        return priceDifference;
    }

    public void setPriceDifference(double priceDifference) {
        this.priceDifference = priceDifference;
    }

    public double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public String getChangeReason() {
        return changeReason;
    }

    public void setChangeReason(String changeReason) {
        this.changeReason = changeReason;
    }

    public String getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}