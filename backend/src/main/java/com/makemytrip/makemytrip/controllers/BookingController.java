package com.makemytrip.makemytrip.controllers;
import com.makemytrip.makemytrip.models.Refund;
import com.makemytrip.makemytrip.models.RoomType;
import com.makemytrip.makemytrip.models.SeatInfo;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



class CancelRequest {

    private String userId;

    private String bookingId;

    private String reason;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}



@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class BookingController {

    @Autowired
    private BookingService bookingService;



    @PostMapping("/flight")
    public ResponseEntity<?> bookFlight(
            @RequestBody Map<String, Object> body
    ) {

        try {

            String userId =
                    (String) body.get("userId");

            String flightId =
                    (String) body.get("flightId");

            int seats =
                    Integer.parseInt(
                            body.get("seats").toString()
                    );

            double price =
                    Double.parseDouble(
                            body.get("price").toString()
                    );


            Map<String, Object> seatData =
                    (Map<String, Object>) body.get("seatPref");

            if (seatData == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Seat preference is required");
            }

            SeatInfo seatInfo = new SeatInfo();


            Object seatNumber =
                    seatData.get("seatNumber");

            if (seatNumber == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Seat number is missing");
            }

            seatInfo.setSeatNumber(
                    seatNumber.toString()
            );



            Object seatTypeObj =
                    seatData.get("seatType");

            String seatType =
                    seatTypeObj != null
                            ? seatTypeObj.toString()
                            : "ECONOMY";

            seatInfo.setSeatType(seatType);



            Object extraPriceObj =
                    seatData.get("extraPrice");

            double extraPrice = 0;

            if (extraPriceObj != null) {

                extraPrice =
                        Double.parseDouble(
                                extraPriceObj.toString()
                        );
            }

            seatInfo.setExtraPrice(extraPrice);



            if (seatType.equalsIgnoreCase("BUSINESS")) {

                seatInfo.setBusiness(true);
            }

            if (seatType.equalsIgnoreCase("PREMIUM")) {

                seatInfo.setPremium(true);
            }

            Users.Booking booking =
                    bookingService.bookFlight(
                            userId,
                            flightId,
                            seatInfo,
                            seats,
                            price
                    );

            return ResponseEntity.ok(booking);

        } catch (Exception e) {

            System.out.println(
                    "========== FLIGHT BOOKING ERROR =========="
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("ERROR => " + e.getMessage());
        }
    }



    @PostMapping("/hotel")
    public ResponseEntity<?> bookHotel(
            @RequestBody Map<String, Object> body
    ) {

        try {

            String userId =
                    (String) body.get("userId");

            String hotelId =
                    (String) body.get("hotelId");

            int rooms =
                    Integer.parseInt(
                            body.get("quantity").toString()
                    );

            double price =
                    Double.parseDouble(
                            body.get("total").toString()
                    );



            Map<String, Object> roomMap =
                    (Map<String, Object>) body.get("roomPref");

            if (roomMap == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Room preference is required");
            }

            RoomType roomType = new RoomType();



            Object roomTypeObj =
                    roomMap.get("type");

            if (roomTypeObj == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Room type is missing");
            }

            roomType.setRoomType(
                    roomTypeObj.toString()
            );



            Object roomPriceObj =
                    roomMap.get("price");

            double roomPrice = 0;

            if (roomPriceObj != null) {

                roomPrice =
                        Double.parseDouble(
                                roomPriceObj.toString()
                        );
            }

            roomType.setPrice(roomPrice);

            Users.Booking booking =
                    bookingService.bookhotel(
                            userId,
                            hotelId,
                            roomType,
                            rooms,
                            price
                    );

            return ResponseEntity.ok(booking);

        } catch (Exception e) {

            System.out.println(
                    "========== HOTEL BOOKING ERROR =========="
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("ERROR => " + e.getMessage());
        }
    }



    @PostMapping("/cancel")
    public ResponseEntity<Refund> cancelBooking(
            @RequestBody CancelRequest request
    ) {

        Refund refund =
                bookingService.cancelBooking(
                        request.getUserId(),
                        request.getBookingId(),
                        request.getReason()
                );

        return ResponseEntity.ok(refund);
    }



    @PutMapping("/refund/{bookingId}/status")
    public ResponseEntity<Refund> updateRefundStatus(
            @PathVariable String bookingId,
            @RequestParam String status
    ) {

        return ResponseEntity.ok(
                bookingService.updateRefundStatus(
                        bookingId,
                        status
                )
        );
    }
}

