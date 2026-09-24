package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightStatusService {

    private final FlightStatusRepository repository;

    public FlightStatusService(FlightStatusRepository repository) {
        this.repository = repository;
    }

    public FlightStatus getStatus(String flightId) {
        FlightStatus status = repository.findByFlightId(flightId);
        updateEta(status);
        return status;
    }

    public List<FlightStatus> getAllStatuses() {
        List<FlightStatus> statuses = repository.findAll();
        statuses.forEach(this::updateEta);
        return statuses;
    }

    public FlightStatus saveStatus(FlightStatus status) {
        updateEta(status);
        return repository.save(status);
    }

    private void updateEta(FlightStatus status) {
        if (status == null) return;

        if (status.getDelayReason() != null && status.getRevisedArrival() != null) {
            status.setEta(status.getRevisedArrival());
        } else if (status.getArrivalTime() != null) {
            status.setEta(status.getArrivalTime());
        }
    }
}
