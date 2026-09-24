package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;
import com.makemytrip.makemytrip.services.MockFlightStatusService;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/flightStatus")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://your-app.netlify.app",
        "https://your-app.vercel.app"
})
public class FlightStatusController {

    private final FlightStatusService service;
    private final MockFlightStatusService mockService;

    public FlightStatusController(
            FlightStatusService service,
            MockFlightStatusService mockService
    ) {
        this.service = service;
        this.mockService = mockService;
    }


    @GetMapping("/{flightId}")
    public FlightStatus getStatus(
            @PathVariable String flightId
    ) {
        return mockService.simulateStatus(flightId);
    }


    @GetMapping("/all")
    public List<FlightStatus> getAllStatuses() {
        return service.getAllStatuses();
    }


    @PostMapping
    public FlightStatus createStatus(
            @RequestBody FlightStatus status
    ) {
        return service.saveStatus(status);
    }


    @GetMapping("/stream/{flightId}")
    public SseEmitter streamFlightStatus(
            @PathVariable String flightId
    ) {


        SseEmitter emitter =
                new SseEmitter(Long.MAX_VALUE);

        new Thread(() -> {

            try {

                while (true) {

                    FlightStatus status =
                            mockService.simulateStatus(flightId);
                    emitter.send(status);
                    Thread.sleep(10000);
                }

            } catch (Exception e) {

                emitter.complete();
            }

        }).start();

        return emitter;
    }
}
