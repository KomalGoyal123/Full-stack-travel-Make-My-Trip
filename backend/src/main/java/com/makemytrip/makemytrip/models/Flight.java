package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Document(collection = "flight")
public class Flight {

    @Id
    private String _id;

    private String flightName;
    private String from;
    private String to;
    private String departureTime;
    private String arrivalTime;


    private double price;


    private double basePrice;

    private double currentPrice;

    private double dynamicPriceChangePercent;

    private boolean dynamicPricingEnabled = true;

    private String pricingReason;

    private LocalDateTime priceLastUpdated;

    private int availableSeats;

    private List<String> bookedSeats = new ArrayList<>();



    private List<SeatInfo> seats = new ArrayList<>();

    private double premiumSeatExtraPrice = 2500;


    private double businessSeatExtraPrice = 5000;

    private boolean liveSeatAvailability = true;

    private String flightImage;

    private double rating = 4.5;

    private List<String> amenities = Arrays.asList(
            "WiFi",
            "Entertainment",
            "Meal",
            "Extra Legroom"
    );



    public Flight() {

        if (this.seats == null || this.seats.isEmpty()) {
            generateDefaultSeats();
        }


        this.basePrice = this.price;
        this.currentPrice = this.price;
        this.dynamicPricingEnabled = true;
        this.dynamicPriceChangePercent = 0;
        this.pricingReason = "Initial pricing";
        this.priceLastUpdated = LocalDateTime.now();
    }




    private void generateDefaultSeats() {

        List<SeatInfo> generatedSeats = new ArrayList<>();

        String[] seatLetters = {"A", "B", "C", "D", "E", "F"};

        // 10 rows × 6 seats
        for (int row = 1; row <= 10; row++) {

            for (String letter : seatLetters) {

                SeatInfo seat = new SeatInfo();

                String seatNumber = row + letter;

                seat.setSeatNumber(seatNumber);

                if (letter.equals("A") || letter.equals("F")) {
                    seat.setSeatCategory("WINDOW");
                }

                else if (letter.equals("C") || letter.equals("D")) {
                    seat.setSeatCategory("AISLE");
                }

                else {
                    seat.setSeatCategory("MIDDLE");
                }

                // ECONOMY / PREMIUM / BUSINESS

                if (row == 1) {

                    seat.setSeatType("BUSINESS");
                }

                else if (row <= 5) {

                    seat.setSeatType("PREMIUM");
                }

                else {

                    seat.setSeatType("ECONOMY");
                }

                // Premium seats
                if (row <= 2) {
                    seat.setPremium(true);
                    seat.setExtraPrice(premiumSeatExtraPrice);
                }

                // Business seats
                if (row == 1) {
                    seat.setBusiness(true);
                    seat.setExtraPrice(businessSeatExtraPrice);
                }

                seat.setBooked(false);

                generatedSeats.add(seat);
            }
        }

        this.seats = generatedSeats;
    }



    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public String getFlightName() {
        return flightName;
    }

    public void setFlightName(String flightName) {
        this.flightName = flightName;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public List<String> getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(List<String> bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public List<SeatInfo> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatInfo> seats) {
        this.seats = seats;
    }

    public double getPremiumSeatExtraPrice() {
        return premiumSeatExtraPrice;
    }

    public void setPremiumSeatExtraPrice(double premiumSeatExtraPrice) {
        this.premiumSeatExtraPrice = premiumSeatExtraPrice;
    }

    public double getBusinessSeatExtraPrice() {
        return businessSeatExtraPrice;
    }

    public void setBusinessSeatExtraPrice(double businessSeatExtraPrice) {
        this.businessSeatExtraPrice = businessSeatExtraPrice;
    }

    public boolean isLiveSeatAvailability() {
        return liveSeatAvailability;
    }

    public void setLiveSeatAvailability(boolean liveSeatAvailability) {
        this.liveSeatAvailability = liveSeatAvailability;
    }

    public String getFlightImage() {
        return flightImage;
    }

    public void setFlightImage(String flightImage) {
        this.flightImage = flightImage;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }
}
