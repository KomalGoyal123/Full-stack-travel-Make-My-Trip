package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Document(collection = "hotels")
public class Hotel {

    @Id
    private String _id;

    private String hotelName;

    private String location;


    private double pricePerNight;

    private double basePrice;

    private double currentPrice;

    private double dynamicPriceChangePercent;

    private boolean dynamicPricingEnabled = true;

    private String pricingReason;

    private LocalDateTime priceLastUpdated;

    private int availableRooms;

    private String amenities;

    private String hotelImage;

    private List<String> roomImages = new ArrayList<>();

    private String virtualTourUrl;

    private double rating = 4.5;

    private boolean premiumHotel = false;

    private boolean liveAvailability = true;

    private List<RoomType> roomTypes = new ArrayList<>();

    private List<String> tags = Arrays.asList(
            "Luxury",
            "Family Friendly",
            "Free WiFi",
            "Pool",
            "Breakfast Included"
    );

    public Hotel() {

        if (this.roomTypes == null || this.roomTypes.isEmpty()) {
            generateDefaultRoomTypes();
        }

        this.basePrice = this.pricePerNight;
        this.currentPrice = this.pricePerNight;
        this.dynamicPricingEnabled = true;
        this.dynamicPriceChangePercent = 0;
        this.pricingReason = "Initial pricing";
        this.priceLastUpdated = LocalDateTime.now();
    }





    private void generateDefaultRoomTypes() {

        List<RoomType> generatedRooms = new ArrayList<>();


        RoomType standard = new RoomType();

        standard.setRoomType("STANDARD");

        standard.setPrice(pricePerNight);

        standard.setAvailableRooms(10);

        standard.setPremium(false);

        standard.setRoomSize("250 sq ft");

        standard.setBedType("Queen Bed");

        standard.setDescription(
                "Comfortable standard room with modern amenities."
        );

        standard.setRoomImages(Arrays.asList(
                "/rooms/standard1.jpg",
                "/rooms/standard2.jpg"
        ));

        generatedRooms.add(standard);



        RoomType deluxe = new RoomType();

        deluxe.setRoomType("DELUXE");

        deluxe.setPrice(pricePerNight + 2500);

        deluxe.setAvailableRooms(6);

        deluxe.setPremium(true);

        deluxe.setRoomSize("400 sq ft");

        deluxe.setBedType("King Bed");

        deluxe.setDescription(
                "Luxury deluxe room with city view and premium interiors."
        );

        deluxe.setRoomImages(Arrays.asList(
                "/rooms/deluxe1.jpg",
                "/rooms/deluxe2.jpg"
        ));

        generatedRooms.add(deluxe);




        RoomType suite = new RoomType();

        suite.setRoomType("SUITE");

        suite.setPrice(pricePerNight + 5000);

        suite.setAvailableRooms(3);

        suite.setPremium(true);

        suite.setRoomSize("650 sq ft");

        suite.setBedType("Luxury King Bed");

        suite.setDescription(
                "Premium suite with living area, luxury bathroom, and balcony."
        );

        suite.setRoomImages(Arrays.asList(
                "/rooms/suite1.jpg",
                "/rooms/suite2.jpg"
        ));

        generatedRooms.add(suite);



        this.roomTypes = generatedRooms;
    }



    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }


    public double getPrice() {
        return currentPrice > 0
                ? currentPrice
                : pricePerNight;
    }

    public void setPrice(double price) {
        this.currentPrice = price;
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

    public double getDynamicPriceChangePercent() {
        return dynamicPriceChangePercent;
    }

    public void setDynamicPriceChangePercent(double dynamicPriceChangePercent) {
        this.dynamicPriceChangePercent = dynamicPriceChangePercent;
    }

    public boolean isDynamicPricingEnabled() {
        return dynamicPricingEnabled;
    }

    public void setDynamicPricingEnabled(boolean dynamicPricingEnabled) {
        this.dynamicPricingEnabled = dynamicPricingEnabled;
    }

    public String getPricingReason() {
        return pricingReason;
    }

    public void setPricingReason(String pricingReason) {
        this.pricingReason = pricingReason;
    }

    public LocalDateTime getPriceLastUpdated() {
        return priceLastUpdated;
    }

    public void setPriceLastUpdated(LocalDateTime priceLastUpdated) {
        this.priceLastUpdated = priceLastUpdated;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getHotelImage() {
        return hotelImage;
    }

    public void setHotelImage(String hotelImage) {
        this.hotelImage = hotelImage;
    }

    public List<String> getRoomImages() {
        return roomImages;
    }

    public void setRoomImages(List<String> roomImages) {
        this.roomImages = roomImages;
    }

    public String getVirtualTourUrl() {
        return virtualTourUrl;
    }

    public void setVirtualTourUrl(String virtualTourUrl) {
        this.virtualTourUrl = virtualTourUrl;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isPremiumHotel() {
        return premiumHotel;
    }

    public void setPremiumHotel(boolean premiumHotel) {
        this.premiumHotel = premiumHotel;
    }

    public boolean isLiveAvailability() {
        return liveAvailability;
    }

    public void setLiveAvailability(boolean liveAvailability) {
        this.liveAvailability = liveAvailability;
    }

    public List<RoomType> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomType> roomTypes) {
        this.roomTypes = roomTypes;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}

