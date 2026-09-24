package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Refund;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RefundRepository extends MongoRepository<Refund, String> {

    List<Refund> findByBookingId(String bookingId);

    List<Refund> findByUserId(String userId);
}

