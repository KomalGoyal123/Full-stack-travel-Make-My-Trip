package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.repositories.PriceFreezeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PriceFreezeService {

    @Autowired
    private PriceFreezeRepository priceFreezeRepository;

    @Autowired
    private DynamicPricingService dynamicPricingService;


    public PriceFreeze freezePrice(
            String userId,
            String entityId,
            String entityType,
            int freezeMinutes
    ) {

        Optional<PriceFreeze> existingFreeze =
                priceFreezeRepository
                        .findByUserIdAndEntityIdAndStatus(
                                userId,
                                entityId,
                                "ACTIVE"
                        );

        if (existingFreeze.isPresent()) {
            return existingFreeze.get();
        }

        DynamicPrice livePrice =
                dynamicPricingService
                        .getLivePrice(entityId, entityType);

        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .plusMinutes(freezeMinutes);

        PriceFreeze freeze =
                new PriceFreeze(
                        userId,
                        entityId,
                        entityType,
                        livePrice.getCurrentPrice(),
                        livePrice.getBasePrice(),
                        freezeMinutes,
                        expiryTime,
                        "User requested price freeze"
                );

        freeze.setStatus("ACTIVE");

        return priceFreezeRepository.save(freeze);
    }



    public List<PriceFreeze> getUserFreezes(
            String userId
    ) {

        return priceFreezeRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }


    public List<PriceFreeze> getActiveFreezes(
            String userId
    ) {

        updateExpiredFreezes();

        return priceFreezeRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(
                        userId,
                        "ACTIVE"
                );
    }



    public Optional<PriceFreeze> getActiveFreeze(
            String userId,
            String entityId
    ) {

        updateExpiredFreezes();

        return priceFreezeRepository
                .findByUserIdAndEntityIdAndStatus(
                        userId,
                        entityId,
                        "ACTIVE"
                );
    }



    public boolean isFreezeValid(
            String userId,
            String entityId
    ) {

        updateExpiredFreezes();

        Optional<PriceFreeze> freeze =
                getActiveFreeze(userId, entityId);

        return freeze.isPresent();
    }



    public PriceFreeze markFreezeAsUsed(
            String freezeId,
            String bookingId
    ) {

        Optional<PriceFreeze> freezeOptional =
                priceFreezeRepository.findById(freezeId);

        if (freezeOptional.isEmpty()) {
            return null;
        }

        PriceFreeze freeze =
                freezeOptional.get();

        freeze.setStatus("USED");

        freeze.setBookingId(bookingId);

        return priceFreezeRepository.save(freeze);
    }



    public PriceFreeze cancelFreeze(
            String freezeId
    ) {

        Optional<PriceFreeze> freezeOptional =
                priceFreezeRepository.findById(freezeId);

        if (freezeOptional.isEmpty()) {
            return null;
        }

        PriceFreeze freeze =
                freezeOptional.get();

        freeze.setStatus("CANCELLED");

        return priceFreezeRepository.save(freeze);
    }



    public void updateExpiredFreezes() {

        List<PriceFreeze> expiredFreezes =
                priceFreezeRepository
                        .findByExpiresAtBeforeAndStatus(
                                LocalDateTime.now(),
                                "ACTIVE"
                        );

        for (PriceFreeze freeze : expiredFreezes) {

            freeze.setStatus("EXPIRED");

            priceFreezeRepository.save(freeze);
        }
    }



    public PriceFreeze getFreezeById(
            String freezeId
    ) {

        Optional<PriceFreeze> freeze =
                priceFreezeRepository.findById(freezeId);

        return freeze.orElse(null);
    }



    public void deleteEntityFreezes(
            String entityId
    ) {

        priceFreezeRepository.deleteByEntityId(entityId);
    }
}