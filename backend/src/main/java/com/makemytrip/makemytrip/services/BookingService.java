package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRespository flightRespository;

    @Autowired
    private HotelRespository hotelRespository;

    @Autowired
    private RefundRepository refundRepository;


    @Autowired
    private DynamicPricingService dynamicPricingService;

    @Autowired
    private PriceFreezeService priceFreezeService;


    @Autowired
    private UserInteractionService userInteractionService;


    public Booking bookFlight(
            String userId,
            String flightId,
            SeatInfo seatPref,
            int seats,
            double price
    ) {

        Optional<Users> usersOptional =
                userRepository.findById(userId);

        Optional<Flight> flightOptional =
                flightRespository.findById(flightId);

        if (usersOptional.isPresent()
                && flightOptional.isPresent()) {

            Users user = usersOptional.get();

            Flight flight = flightOptional.get();

            Optional<PriceFreeze> activeFreeze =
                    priceFreezeService.getActiveFreeze(
                            userId,
                            flightId
                    );

            if (activeFreeze.isPresent()) {

                price = activeFreeze
                        .get()
                        .getLockedPrice();

                System.out.println(
                        "Using frozen flight price => "
                                + price
                );

            } else {

                DynamicPrice dynamicPrice =
                        dynamicPricingService
                                .getLivePrice(
                                        flightId,
                                        "FLIGHT"
                                );

                price = dynamicPrice
                        .getCurrentPrice();

                System.out.println(
                        "Using dynamic flight price => "
                                + price
                );
            }


            if (seatPref == null
                    || seatPref.getSeatNumber() == null
                    || seatPref.getSeatNumber().isEmpty()) {

                throw new RuntimeException(
                        "Seat number is missing from frontend"
                );
            }


            if (flight.getAvailableSeats() < seats) {

                throw new RuntimeException(
                        "Not enough seats available"
                );
            }


            if (flight.getSeats() == null
                    || flight.getSeats().isEmpty()) {

                List<SeatInfo> generatedSeats =
                        new ArrayList<>();

                for (int row = 1; row <= 10; row++) {

                    for (char col = 'A'; col <= 'F'; col++) {

                        SeatInfo seat = new SeatInfo();

                        seat.setSeatNumber(
                                row + String.valueOf(col)
                        );

                        seat.setBooked(false);



                        if (col == 'A' || col == 'F') {

                            seat.setSeatCategory("WINDOW");
                        }

                        else if (col == 'C'
                                || col == 'D') {

                            seat.setSeatCategory("AISLE");
                        }

                        else {

                            seat.setSeatCategory("MIDDLE");
                        }



                        if (row <= 2) {

                            seat.setSeatType("BUSINESS");
                            seat.setExtraPrice(5000);
                            seat.setBusiness(true);
                        }

                        else if (row <= 5) {

                            seat.setSeatType("PREMIUM");
                            seat.setExtraPrice(2500);
                            seat.setPremium(true);
                        }

                        else {

                            seat.setSeatType("ECONOMY");
                            seat.setExtraPrice(0);
                        }

                        generatedSeats.add(seat);
                    }
                }

                flight.setSeats(generatedSeats);

                flightRespository.save(flight);


                flight = flightRespository
                        .findById(flightId)
                        .get();

                System.out.println(
                        "Dynamic seat map generated"
                );
            }



            boolean seatFound = false;

            for (SeatInfo seat : flight.getSeats()) {

                if (
                        seat.getSeatNumber() != null
                                &&
                                seat.getSeatNumber()
                                        .equalsIgnoreCase(
                                                seatPref.getSeatNumber()
                                        )
                ) {

                    System.out.println(
                            "Checking seat => "
                                    + seat.getSeatNumber()
                                    + " booked => "
                                    + seat.isBooked()
                    );


                    if (seat.isBooked()) {

                        throw new RuntimeException(
                                "Seat already booked"
                        );
                    }

                    seat.setBooked(true);


                    if (flight.getBookedSeats() == null) {

                        flight.setBookedSeats(new ArrayList<>());
                    }

                    if (!flight.getBookedSeats().contains(seat.getSeatNumber())) {

                        flight.getBookedSeats().add(seat.getSeatNumber());
                    }

                    if (flight.getBookedSeats() == null) {

                        flight.setBookedSeats(
                                new ArrayList<>()
                        );
                    }

                    if (!flight.getBookedSeats().contains(
                            seat.getSeatNumber()
                    )) {

                        flight.getBookedSeats().add(
                                seat.getSeatNumber()
                        );
                    }


                    seatPref.setSeatNumber(
                            seat.getSeatNumber()
                    );

                    seatPref.setSeatType(
                            seat.getSeatType()
                    );

                    seatPref.setSeatCategory(
                            seat.getSeatCategory()
                    );

                    seatPref.setExtraPrice(
                            seat.getExtraPrice()
                    );

                    seatPref.setPremium(
                            seat.isPremium()
                    );

                    seatPref.setBusiness(
                            seat.isBusiness()
                    );

                    seatPref.setSelected(true);

                    seatPref.setStatus("SELECTED");


                    price += seat.getExtraPrice();

                    seatFound = true;

                    System.out.println(
                            "Seat selected => "
                                    + seat.getSeatNumber()
                    );

                    break;
                }
            }



            if (!seatFound) {

                throw new RuntimeException(
                        "Seat not found"
                );
            }


            flight.setAvailableSeats(
                    flight.getAvailableSeats() - seats
            );

            flightRespository.save(flight);



            Booking booking = new Booking();

            booking.setType("Flight");

            booking.setBookingId(
                    java.util.UUID.randomUUID().toString()
            );

            booking.setDate(
                    LocalDateTime.now().toString()
            );

            booking.setQuantity(seats);

            booking.setSeatPref(seatPref);

            booking.setTotalPrice(price);

            booking.setStatus("CONFIRMED");



            if (user.getBookings() == null) {

                user.setBookings(
                        new ArrayList<>()
                );
            }

            user.getBookings().add(booking);

            userRepository.save(user);



            if (activeFreeze.isPresent()) {

                priceFreezeService.markFreezeAsUsed(
                        activeFreeze.get().getId(),
                        booking.getBookingId()
                );
            }



            try {
                userInteractionService.logBooking(userId, "FLIGHT", flightId, price);
                System.out.println("Booking interaction logged successfully for flight: " + flightId);
            } catch (Exception e) {
                System.out.println("Failed to log booking interaction: " + e.getMessage());
            }

            return booking;
        }

        throw new RuntimeException(
                "User or Flight not found"
        );
    }



    public Booking bookhotel(
            String userId,
            String hotelId,
            RoomType roomPref,
            int rooms,
            double price
    ) {

        Optional<Users> usersOptional =
                userRepository.findById(userId);

        Optional<Hotel> hotelOptional =
                hotelRespository.findById(hotelId);

        if (usersOptional.isPresent()
                && hotelOptional.isPresent()) {

            Users user = usersOptional.get();

            Hotel hotel = hotelOptional.get();



            Optional<PriceFreeze> activeFreeze =
                    priceFreezeService.getActiveFreeze(
                            userId,
                            hotelId
                    );

            if (activeFreeze.isPresent()) {

                price = activeFreeze
                        .get()
                        .getLockedPrice();

                System.out.println(
                        "Using frozen hotel price => "
                                + price
                );

            } else {

                DynamicPrice dynamicPrice =
                        dynamicPricingService
                                .getLivePrice(
                                        hotelId,
                                        "HOTEL"
                                );

                price = dynamicPrice
                        .getCurrentPrice();

                System.out.println(
                        "Using dynamic hotel price => "
                                + price
                );
            }



            if (roomPref == null
                    || roomPref.getRoomType() == null
                    || roomPref.getRoomType().isEmpty()) {

                throw new RuntimeException(
                        "Room type is missing from frontend"
                );
            }



            if (hotel.getAvailableRooms() < rooms) {

                throw new RuntimeException(
                        "Not enough rooms available"
                );
            }



            boolean roomFound = false;

            for (RoomType roomType
                    : hotel.getRoomTypes()) {

                if (
                        roomType.getRoomType() != null
                                &&
                                roomType.getRoomType()
                                        .equalsIgnoreCase(
                                                roomPref.getRoomType()
                                        )
                ) {



                    if (roomType.getAvailableRooms()
                            < rooms) {

                        throw new RuntimeException(
                                "Selected room unavailable"
                        );
                    }


                    roomType.setAvailableRooms(
                            roomType.getAvailableRooms()
                                    - rooms
                    );



                    if (
                            roomType.getRoomType()
                                    .equalsIgnoreCase("SUITE")
                                    ||
                                    roomType.getRoomType()
                                            .equalsIgnoreCase("DELUXE")
                    ) {

                        price += roomType.getPrice();
                    }



                    roomType.setSelected(true);

                    roomType.setStatus("BOOKED");

                    roomFound = true;

                    break;
                }
            }



            if (!roomFound) {

                throw new RuntimeException(
                        "Room type not found"
                );
            }


            hotel.setAvailableRooms(
                    hotel.getAvailableRooms() - rooms
            );

            hotelRespository.save(hotel);



            Booking booking = new Booking();

            booking.setType("Hotel");

            booking.setBookingId(
                    java.util.UUID.randomUUID().toString()
            );

            booking.setDate(
                    LocalDateTime.now().toString()
            );

            booking.setQuantity(rooms);

            booking.setRoomPref(roomPref);

            booking.setTotalPrice(price);

            booking.setStatus("CONFIRMED");



            if (user.getBookings() == null) {

                user.setBookings(
                        new java.util.ArrayList<>()
                );
            }

            user.getBookings().add(booking);

            userRepository.save(user);



            if (activeFreeze.isPresent()) {

                priceFreezeService.markFreezeAsUsed(
                        activeFreeze.get().getId(),
                        booking.getBookingId()
                );
            }


            try {
                userInteractionService.logBooking(userId, "HOTEL", hotelId, price);
                System.out.println("Booking interaction logged successfully for hotel: " + hotelId);
            } catch (Exception e) {
                System.out.println("Failed to log booking interaction: " + e.getMessage());
            }

            return booking;
        }

        throw new RuntimeException(
                "User or Hotel not found"
        );
    }



    public Refund cancelBooking(
            String userId,
            String bookingId,
            String reason
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Booking booking = user.getBookings()
                .stream()
                .filter(b ->
                        b.getBookingId()
                                .equals(bookingId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));

        booking.setStatus("CANCELLED");

        userRepository.save(user);


        LocalDateTime bookingTime =
                LocalDateTime.parse(
                        booking.getDate()
                );

        long hoursSinceBooking =
                Duration.between(
                        bookingTime,
                        LocalDateTime.now()
                ).toHours();

        double refundAmount;

        String timeline;

        if (hoursSinceBooking <= 24) {

            refundAmount =
                    booking.getTotalPrice() * 0.5;

            timeline = "1-2 business days";

        } else if (hoursSinceBooking <= 72) {

            refundAmount =
                    booking.getTotalPrice() * 0.75;

            timeline = "2-3 business days";

        } else if (hoursSinceBooking <= 168) {

            refundAmount =
                    booking.getTotalPrice() * 0.9;

            timeline = "3-5 business days";

        } else {

            refundAmount =
                    booking.getTotalPrice();

            timeline = "5-7 business days";
        }



        Refund refund = new Refund();

        refund.setBookingId(bookingId);

        refund.setUserId(userId);

        refund.setAmount(refundAmount);

        refund.setReason(reason);

        refund.setStatus("PENDING");

        refund.setCreatedAt(LocalDateTime.now());

        refund.setExpectedCompletionDate(
                LocalDateTime.now().plusDays(3)
        );

        refund.setTimeline(timeline);

        booking.setRefund(refund);

        return refundRepository.save(refund);
    }



    public Refund updateRefundStatus(
            String bookingId,
            String newStatus
    ) {

        List<Refund> refunds =
                refundRepository.findByBookingId(
                        bookingId
                );

        if (refunds.isEmpty()) {

            throw new RuntimeException(
                    "Refund not found"
            );
        }

        Refund refund =
                refunds.get(refunds.size() - 1);

        refund.setStatus(newStatus);

        return refundRepository.save(refund);
    }
}
