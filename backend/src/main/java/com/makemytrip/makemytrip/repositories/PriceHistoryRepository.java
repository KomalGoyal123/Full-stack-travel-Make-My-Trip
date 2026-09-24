package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.PriceHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends MongoRepository<PriceHistory, String> {


    List<PriceHistory> findByEntityIdOrderByChangedAtDesc(
            String entityId
    );


    List<PriceHistory> findByEntityTypeOrderByChangedAtDesc(
            String entityType
    );

    List<PriceHistory> findByTriggerTypeOrderByChangedAtDesc(
            String triggerType
    );

    List<PriceHistory> findByEntityIdAndEntityTypeOrderByChangedAtDesc(
            String entityId,
            String entityType
    );

    void deleteByEntityId(String entityId);
}