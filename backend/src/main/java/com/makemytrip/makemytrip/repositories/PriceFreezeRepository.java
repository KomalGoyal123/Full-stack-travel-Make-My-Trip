package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.PriceFreeze;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceFreezeRepository extends MongoRepository<PriceFreeze, String> {


    List<PriceFreeze> findByUserIdOrderByCreatedAtDesc(
            String userId
    );


    List<PriceFreeze> findByUserIdAndStatusOrderByCreatedAtDesc(
            String userId,
            String status
    );

    Optional<PriceFreeze> findByUserIdAndEntityIdAndStatus(
            String userId,
            String entityId,
            String status
    );

    List<PriceFreeze> findByExpiresAtBeforeAndStatus(
            LocalDateTime time,
            String status
    );


    List<PriceFreeze> findByEntityTypeOrderByCreatedAtDesc(
            String entityType
    );


    boolean existsByUserIdAndEntityIdAndStatus(
            String userId,
            String entityId,
            String status
    );


    void deleteByEntityId(String entityId);
}