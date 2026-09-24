package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRespository;
import com.makemytrip.makemytrip.repositories.HotelRespository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class Rootcontrollers {

    @Autowired
    private HotelRespository hotelRespository;

    @Autowired
    private FlightRespository flightRespository;


    @GetMapping("/")
    public String home() {
        return "✅ Backend running on port 8081";
    }


    @GetMapping("/hotel")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelRespository.findAll());
    }


    @GetMapping("/hotel/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable String id) {
        return hotelRespository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/flight")
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(flightRespository.findAll());
    }


    @GetMapping("/flight/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable String id) {
        return flightRespository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
