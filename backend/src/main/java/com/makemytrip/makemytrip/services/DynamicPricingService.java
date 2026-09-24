package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.repositories.DynamicPriceRepository;
import com.makemytrip.makemytrip.repositories.FlightRespository;
import com.makemytrip.makemytrip.repositories.HotelRespository;
import com.makemytrip.makemytrip.repositories.PriceHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DynamicPricingService {

    @Autowired
    private DynamicPriceRepository dynamicPriceRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private FlightRespository flightRespository;

    @Autowired
    private HotelRespository hotelRespository;



    public DynamicPrice getLivePrice(
            String entityId,
            String entityType
    ) {

        List<DynamicPrice> existingPrices =
                dynamicPriceRepository.findByEntityId(entityId);


        if (!existingPrices.isEmpty()) {

            DynamicPrice latestPrice =
                    existingPrices.get(existingPrices.size() - 1);

            return latestPrice;
        }


        return generateDynamicPrice(entityId, entityType);
    }



    public DynamicPrice generateDynamicPrice(
            String entityId,
            String entityType
    ) {

        double basePrice =
                getBasePrice(entityId, entityType);

        double demandMultiplier =
                calculateDemandMultiplier(entityId, entityType);

        double seasonalMultiplier =
                calculateSeasonalMultiplier();

        double holidayMultiplier =
                calculateHolidayMultiplier();

        double weekendMultiplier =
                calculateWeekendMultiplier();

        double occupancyMultiplier =
                calculateOccupancyMultiplier(entityId, entityType);

        double finalPrice =
                basePrice
                        * demandMultiplier
                        * seasonalMultiplier
                        * holidayMultiplier
                        * weekendMultiplier
                        * occupancyMultiplier;

        double roundedPrice =
                Math.round(finalPrice);

        double percentageChange =
                ((roundedPrice - basePrice) / basePrice) * 100;

        String pricingReason =
                buildPricingReason(
                        demandMultiplier,
                        seasonalMultiplier,
                        holidayMultiplier,
                        weekendMultiplier,
                        occupancyMultiplier
                );

        DynamicPrice dynamicPrice =
                new DynamicPrice(
                        entityId,
                        entityType,
                        basePrice,
                        roundedPrice,
                        demandMultiplier,
                        seasonalMultiplier,
                        holidayMultiplier,
                        weekendMultiplier,
                        occupancyMultiplier,
                        pricingReason,
                        percentageChange
                );

        dynamicPrice.setLastUpdated(LocalDateTime.now());

        DynamicPrice savedPrice =
                dynamicPriceRepository.save(dynamicPrice);

        savePriceHistory(
                entityId,
                entityType,
                basePrice,
                roundedPrice,
                pricingReason
        );

        return savedPrice;
    }



    public DynamicPrice updateDynamicPrice(
            String entityId,
            String entityType
    ) {

        List<DynamicPrice> existingPrices =
                dynamicPriceRepository.findByEntityId(entityId);

        double oldPrice = 0.0;

        if (!existingPrices.isEmpty()) {

            DynamicPrice latestPrice =
                    existingPrices.get(existingPrices.size() - 1);

            oldPrice =
                    latestPrice.getCurrentPrice();
        }

        DynamicPrice updated =
                generateDynamicPrice(entityId, entityType);

        savePriceHistory(
                entityId,
                entityType,
                oldPrice,
                updated.getCurrentPrice(),
                "Real-time price update"
        );

        return updated;
    }



    public List<PriceHistory> getPriceHistory(
            String entityId
    ) {

        return priceHistoryRepository
                .findByEntityIdOrderByChangedAtDesc(entityId);
    }



    private double getBasePrice(
            String entityId,
            String entityType
    ) {

        if ("FLIGHT".equalsIgnoreCase(entityType)) {

            Optional<Flight> flight =
                    flightRespository.findById(entityId);

            if (flight.isPresent()) {

                Flight data = flight.get();

                if (data.getPrice() > 0) {
                    return data.getPrice();
                }
            }
        }

        if ("HOTEL".equalsIgnoreCase(entityType)) {

            Optional<Hotel> hotel =
                    hotelRespository.findById(entityId);

            if (hotel.isPresent()) {

                Hotel data = hotel.get();

                if (data.getPrice() > 0) {
                    return data.getPrice();
                }
            }
        }

        return 1000;
    }



    private double calculateDemandMultiplier(
            String entityId,
            String entityType
    ) {

        int randomDemand =
                (int) (Math.random() * 100);

        if (randomDemand > 80) {
            return 1.25;
        }

        if (randomDemand > 60) {
            return 1.15;
        }

        if (randomDemand > 40) {
            return 1.10;
        }

        return 1.0;
    }



    private double calculateSeasonalMultiplier() {

        Month currentMonth =
                LocalDate.now().getMonth();

        if (
                currentMonth == Month.DECEMBER ||
                        currentMonth == Month.JUNE
        ) {

            return 1.20;
        }

        if (
                currentMonth == Month.MAY ||
                        currentMonth == Month.NOVEMBER
        ) {

            return 1.10;
        }

        return 1.0;
    }



    private double calculateHolidayMultiplier() {

        LocalDate today =
                LocalDate.now();

        Month month =
                today.getMonth();

        int day =
                today.getDayOfMonth();

        if (
                (month == Month.DECEMBER && day >= 20) ||
                        (month == Month.JANUARY && day <= 5)
        ) {

            return 1.20;
        }

        return 1.0;
    }



    private double calculateWeekendMultiplier() {

        DayOfWeek day =
                LocalDate.now().getDayOfWeek();

        if (
                day == DayOfWeek.SATURDAY ||
                        day == DayOfWeek.SUNDAY
        ) {

            return 1.10;
        }

        return 1.0;
    }



    private double calculateOccupancyMultiplier(
            String entityId,
            String entityType
    ) {

        int occupancy =
                (int) (Math.random() * 100);

        if (occupancy > 85) {
            return 1.30;
        }

        if (occupancy > 70) {
            return 1.20;
        }

        if (occupancy > 50) {
            return 1.10;
        }

        return 1.0;
    }



    private String buildPricingReason(
            double demand,
            double seasonal,
            double holiday,
            double weekend,
            double occupancy
    ) {

        List<String> reasons =
                new ArrayList<>();

        if (demand > 1.0) {
            reasons.add("High demand");
        }

        if (seasonal > 1.0) {
            reasons.add("Seasonal surge");
        }

        if (holiday > 1.0) {
            reasons.add("Holiday pricing");
        }

        if (weekend > 1.0) {
            reasons.add("Weekend rush");
        }

        if (occupancy > 1.0) {
            reasons.add("Limited availability");
        }

        if (reasons.isEmpty()) {
            return "Normal pricing";
        }

        return String.join(", ", reasons);
    }



    private void savePriceHistory(
            String entityId,
            String entityType,
            double oldPrice,
            double newPrice,
            String reason
    ) {

        double difference =
                newPrice - oldPrice;

        double percentage =
                oldPrice > 0
                        ? ((newPrice - oldPrice) / oldPrice) * 100
                        : 0;

        PriceHistory history =
                new PriceHistory(
                        entityId,
                        entityType,
                        oldPrice,
                        newPrice,
                        difference,
                        percentage,
                        reason,
                        "DYNAMIC_PRICING",
                        "Automatic real-time price update"
                );

        history.setChangedAt(LocalDateTime.now());

        priceHistoryRepository.save(history);
    }
}
