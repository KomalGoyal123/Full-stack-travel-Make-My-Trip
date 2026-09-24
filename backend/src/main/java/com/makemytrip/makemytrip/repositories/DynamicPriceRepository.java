package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.DynamicPrice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DynamicPriceRepository extends MongoRepository<DynamicPrice, String> {


    List<DynamicPrice> findByEntityId(String entityId);

    List<DynamicPrice> findByEntityType(String entityType);

    List<DynamicPrice> findByActive(boolean active);

    Optional<DynamicPrice> findByEntityIdAndActive(
            String entityId,
            boolean active
    );

    boolean existsByEntityId(String entityId);

    void deleteByEntityId(String entityId);
}
