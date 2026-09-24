package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.repositories.PriceHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class PriceHistoryService {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;



    public PriceHistory saveHistory(
            PriceHistory history
    ) {

        history.setChangedAt(LocalDateTime.now());

        return priceHistoryRepository.save(history);
    }


    public PriceHistory createHistory(
            String entityId,
            String entityType,
            double oldPrice,
            double newPrice,
            String changeReason,
            String triggerType,
            String description
    ) {

        double difference =
                newPrice - oldPrice;

        double percentage =
                oldPrice > 0
                        ? ((newPrice - oldPrice) / oldPrice) * 100
                        : 0;

        PriceHistory history =
                new PriceHistory(
                        entityId,
                        entityType,
                        oldPrice,
                        newPrice,
                        difference,
                        percentage,
                        changeReason,
                        triggerType,
                        description
                );

        history.setChangedAt(LocalDateTime.now());

        return priceHistoryRepository.save(history);
    }



    public List<PriceHistory> getEntityHistory(
            String entityId
    ) {

        return priceHistoryRepository
                .findByEntityIdOrderByChangedAtDesc(entityId);
    }



    public List<PriceHistory> getEntityTypeHistory(
            String entityType
    ) {

        return priceHistoryRepository
                .findByEntityTypeOrderByChangedAtDesc(entityType);
    }


    public List<PriceHistory> getTriggerHistory(
            String triggerType
    ) {

        return priceHistoryRepository
                .findByTriggerTypeOrderByChangedAtDesc(triggerType);
    }


    public String getPriceTrend(
            String entityId
    ) {

        List<PriceHistory> history =
                getEntityHistory(entityId);

        if (history.size() < 2) {
            return "STABLE";
        }

        double latest =
                history.get(0).getNewPrice();

        double previous =
                history.get(1).getNewPrice();

        if (latest > previous) {
            return "INCREASING";
        }

        if (latest < previous) {
            return "DECREASING";
        }

        return "STABLE";
    }


    public double getAverageHistoricalPrice(
            String entityId
    ) {

        List<PriceHistory> history =
                getEntityHistory(entityId);

        if (history.isEmpty()) {
            return 0;
        }

        double total = 0;

        for (PriceHistory item : history) {
            total += item.getNewPrice();
        }

        return total / history.size();
    }



    public double getHighestPrice(
            String entityId
    ) {

        List<PriceHistory> history =
                getEntityHistory(entityId);

        if (history.isEmpty()) {
            return 0;
        }

        return Collections.max(
                history,
                Comparator.comparingDouble(
                        PriceHistory::getNewPrice
                )
        ).getNewPrice();
    }



    public double getLowestPrice(
            String entityId
    ) {

        List<PriceHistory> history =
                getEntityHistory(entityId);

        if (history.isEmpty()) {
            return 0;
        }

        return Collections.min(
                history,
                Comparator.comparingDouble(
                        PriceHistory::getNewPrice
                )
        ).getNewPrice();
    }



    public void deleteHistory(
            String entityId
    ) {

        priceHistoryRepository.deleteByEntityId(entityId);
    }
}