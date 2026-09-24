package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "price_freeze")
public class PriceFreeze {

    @Id
    private String id;

    private String userId;

    private String entityId;

    private String entityType;

    private double lockedPrice;

    private double originalPrice;

    private int freezeDurationMinutes;

    private LocalDateTime expiresAt;

    private String status;

    private String freezeReason;

    private String bookingId;

    private LocalDateTime createdAt;

    public PriceFreeze() {
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public PriceFreeze(
            String userId,
            String entityId,
            String entityType,
            double lockedPrice,
            double originalPrice,
            int freezeDurationMinutes,
            LocalDateTime expiresAt,
            String freezeReason
    ) {
        this.userId = userId;
        this.entityId = entityId;
        this.entityType = entityType;
        this.lockedPrice = lockedPrice;
        this.originalPrice = originalPrice;
        this.freezeDurationMinutes = freezeDurationMinutes;
        this.expiresAt = expiresAt;
        this.freezeReason = freezeReason;

        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
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

    public double getLockedPrice() {
        return lockedPrice;
    }

    public void setLockedPrice(double lockedPrice) {
        this.lockedPrice = lockedPrice;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public int getFreezeDurationMinutes() {
        return freezeDurationMinutes;
    }

    public void setFreezeDurationMinutes(int freezeDurationMinutes) {
        this.freezeDurationMinutes = freezeDurationMinutes;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFreezeReason() {
        return freezeReason;
    }

    public void setFreezeReason(String freezeReason) {
        this.freezeReason = freezeReason;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}