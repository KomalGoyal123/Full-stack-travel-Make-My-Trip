package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByHotelId(String hotelId);

    List<Review> findByFlightId(String flightId);

    List<Review> findByHotelIdOrderByCreatedAtDesc(String hotelId);

    List<Review> findByFlightIdOrderByCreatedAtDesc(String flightId);

    List<Review> findByHotelIdAndRating(String hotelId, int rating);

    List<Review> findByFlightIdAndRating(String flightId, int rating);

    List<Review> findByFlaggedTrue();

    List<Review> findByHotelIdOrderByHelpfulCountDesc(String hotelId);

    List<Review> findByFlightIdOrderByHelpfulCountDesc(String flightId);

    List<Review> findByModerationStatus(String moderationStatus);
}
