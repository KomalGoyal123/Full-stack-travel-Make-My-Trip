package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.FlightStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class MockFlightStatusService {

    private final Random random = new Random();

    @Autowired
    private DynamicPricingService dynamicPricingService;

    public FlightStatus simulateStatus(String flightId) {

        FlightStatus status = new FlightStatus();

        status.setFlightId(flightId);

        LocalDateTime departure =
                LocalDateTime.now().plusHours(2);

        LocalDateTime arrival =
                departure.plusHours(3);

        int pick = random.nextInt(7);

        switch (pick) {

            case 0 -> {

                status.setStatus("Boarding");

                status.setReason(
                        "Passengers are boarding"
                );

                status.setDepartureTime(departure);

                status.setArrivalTime(arrival);

                status.setEta(arrival);
            }

            case 1 -> {

                status.setStatus("Delayed");

                status.setReason(
                        "Weather issue"
                );

                status.setDelayReason(
                        "Heavy rain at departure airport"
                );

                LocalDateTime revisedDeparture =
                        departure.plusHours(1);

                LocalDateTime revisedArrival =
                        arrival.plusHours(1);

                status.setDepartureTime(departure);

                status.setArrivalTime(arrival);

                status.setRevisedDeparture(
                        revisedDeparture
                );

                status.setRevisedArrival(
                        revisedArrival
                );

                status.setEta(revisedArrival);



                DynamicPrice surgePrice =
                        dynamicPricingService
                                .updateDynamicPrice(
                                        flightId,
                                        "FLIGHT"
                                );

                System.out.println(
                        "Dynamic pricing updated for delay => "
                                + surgePrice.getCurrentPrice()
                );
            }

            case 2 -> {

                status.setStatus("On Time");

                status.setReason(
                        "No issues reported"
                );

                status.setDepartureTime(departure);

                status.setArrivalTime(arrival);

                status.setEta(arrival);
            }

            case 3 -> {

                status.setStatus("Departed");

                status.setReason(
                        "Flight has left the gate"
                );

                status.setDepartureTime(
                        departure.minusMinutes(10)
                );

                status.setArrivalTime(arrival);

                status.setEta(arrival);
            }

            case 4 -> {

                status.setStatus("Cancelled");

                status.setReason(
                        "Technical issue with aircraft"
                );

                status.setDepartureTime(departure);

                status.setArrivalTime(arrival);

                status.setEta(null);



                DynamicPrice resetPrice =
                        dynamicPricingService
                                .updateDynamicPrice(
                                        flightId,
                                        "FLIGHT"
                                );

                System.out.println(
                        "Flight cancelled pricing updated => "
                                + resetPrice.getCurrentPrice()
                );
            }

            case 5 -> {

                status.setStatus("Landed");

                status.setReason(
                        "Flight has landed successfully"
                );

                status.setDepartureTime(
                        departure.minusHours(3)
                );

                status.setArrivalTime(
                        LocalDateTime.now()
                );

                status.setEta(
                        LocalDateTime.now()
                );
            }

            case 6 -> {

                status.setStatus("Diverted");

                status.setReason(
                        "Flight diverted to alternate airport"
                );

                LocalDateTime divertedArrival =
                        arrival.plusHours(2);

                status.setDepartureTime(departure);

                status.setArrivalTime(
                        divertedArrival
                );

                status.setEta(divertedArrival);



                DynamicPrice emergencyPrice =
                        dynamicPricingService
                                .updateDynamicPrice(
                                        flightId,
                                        "FLIGHT"
                                );

                System.out.println(
                        "Emergency dynamic pricing => "
                                + emergencyPrice.getCurrentPrice()
                );
            }
        }

        return status;
    }
}
