package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "dynamic_prices")
public class DynamicPrice{

    @Id
    private String id;

    private String entityId;

    private String entityType;

    private double basePrice;

    private double currentPrice;

    private double demandMultiplier;

    private double seasonalMultiplier;

    private double holidayMultiplier;

    private double weekendMultiplier;

    private double occupancyMultiplier;

    private String pricingReason;

    private double priceChangePercent;

    private boolean active;

    private LocalDateTime lastUpdated;



    public DynamicPrice() {
        this.active = true;
        this.lastUpdated = LocalDateTime.now();
    }

    public DynamicPrice(
            String entityId,
            String entityType,
            double basePrice,
            double currentPrice,
            double demandMultiplier,
            double seasonalMultiplier,
            double holidayMultiplier,
            double weekendMultiplier,
            double occupancyMultiplier,
            String pricingReason,
            double priceChangePercent
    ) {
        this.entityId = entityId;
        this.entityType = entityType;
        this.basePrice = basePrice;
        this.currentPrice = currentPrice;
        this.demandMultiplier = demandMultiplier;
        this.seasonalMultiplier = seasonalMultiplier;
        this.holidayMultiplier = holidayMultiplier;
        this.weekendMultiplier = weekendMultiplier;
        this.occupancyMultiplier = occupancyMultiplier;
        this.pricingReason = pricingReason;
        this.priceChangePercent = priceChangePercent;
        this.active = true;
        this.lastUpdated = LocalDateTime.now();
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

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public double getDemandMultiplier() {
        return demandMultiplier;
    }

    public void setDemandMultiplier(double demandMultiplier) {
        this.demandMultiplier = demandMultiplier;
    }

    public double getSeasonalMultiplier() {
        return seasonalMultiplier;
    }

    public void setSeasonalMultiplier(double seasonalMultiplier) {
        this.seasonalMultiplier = seasonalMultiplier;
    }

    public double getHolidayMultiplier() {
        return holidayMultiplier;
    }

    public void setHolidayMultiplier(double holidayMultiplier) {
        this.holidayMultiplier = holidayMultiplier;
    }

    public double getWeekendMultiplier() {
        return weekendMultiplier;
    }

    public void setWeekendMultiplier(double weekendMultiplier) {
        this.weekendMultiplier = weekendMultiplier;
    }

    public double getOccupancyMultiplier() {
        return occupancyMultiplier;
    }

    public void setOccupancyMultiplier(double occupancyMultiplier) {
        this.occupancyMultiplier = occupancyMultiplier;
    }

    public String getPricingReason() {
        return pricingReason;
    }

    public void setPricingReason(String pricingReason) {
        this.pricingReason = pricingReason;
    }

    public double getPriceChangePercent() {
        return priceChangePercent;
    }

    public void setPriceChangePercent(double priceChangePercent) {
        this.priceChangePercent = priceChangePercent;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}