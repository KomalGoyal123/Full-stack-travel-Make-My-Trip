package com.makemytrip.makemytrip.repositories;
import com.makemytrip.makemytrip.models.Flight;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface FlightRespository extends MongoRepository<Flight,String>{


}