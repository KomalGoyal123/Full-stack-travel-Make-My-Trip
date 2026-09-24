package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "flightStatus")
public class FlightStatus {

    @Id
    private String id;
    private String flightId;
    private String status;            // e.g. On Time, Delayed, Boarding
    private String reason;            // e.g. Weather, Technical issue
    private String delayReason;       // Specific reason for delay
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private LocalDateTime revisedDeparture;
    private LocalDateTime revisedArrival;
    private LocalDateTime eta;        // Dynamic estimated arrival time

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }

    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public LocalDateTime getRevisedDeparture() { return revisedDeparture; }
    public void setRevisedDeparture(LocalDateTime revisedDeparture) { this.revisedDeparture = revisedDeparture; }

    public LocalDateTime getRevisedArrival() { return revisedArrival; }
    public void setRevisedArrival(LocalDateTime revisedArrival) { this.revisedArrival = revisedArrival; }

    public LocalDateTime getEta() { return eta; }
    public void setEta(LocalDateTime eta) { this.eta = eta; }
}
