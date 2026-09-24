package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRespository;
import com.makemytrip.makemytrip.repositories.HotelRespository;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://your-app.netlify.app",
        "https://your-app.vercel.app"
})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRespository hotelRespository;

    @Autowired
    private FlightRespository flightRespository;


    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    @PostMapping("/flight")
    public Flight addflight(@RequestBody Flight flight) {
        return flightRespository.save(flight);
    }


    @PostMapping("/hotel")
    public Hotel addhotel(@RequestBody Hotel hotel) {
        return hotelRespository.save(hotel);
    }


    @PutMapping("/flight/{id}")
    public ResponseEntity<Flight> editflight(
            @PathVariable String id,
            @RequestBody Flight updatedFlight
    ) {
        Optional<Flight> flightOptional = flightRespository.findById(id);

        if (flightOptional.isPresent()) {
            Flight flight = flightOptional.get();

            flight.setFlightName(updatedFlight.getFlightName());
            flight.setFrom(updatedFlight.getFrom());
            flight.setTo(updatedFlight.getTo());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            flight.setAvailableSeats(updatedFlight.getAvailableSeats());

            return ResponseEntity.ok(flightRespository.save(flight));
        }

        return ResponseEntity.notFound().build();
    }


    @PutMapping("/hotel/{id}")
    public ResponseEntity<Hotel> editHotel(
            @PathVariable String id,
            @RequestBody Hotel updatedHotel
    ) {
        Optional<Hotel> hotelOptional = hotelRespository.findById(id);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();


            hotel.setHotelName(updatedHotel.getHotelName());
            hotel.setLocation(updatedHotel.getLocation());
            hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
            hotel.setPricePerNight(updatedHotel.getPricePerNight());
            hotel.setAmenities(updatedHotel.getAmenities());

            return ResponseEntity.ok(hotelRespository.save(hotel));
        }

        return ResponseEntity.notFound().build();
    }
}
