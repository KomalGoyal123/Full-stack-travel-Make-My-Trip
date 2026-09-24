package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.services.DynamicPricingService;
import com.makemytrip.makemytrip.services.PriceFreezeService;
import com.makemytrip.makemytrip.services.PriceHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pricing")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://your-app.netlify.app",
        "https://your-app.vercel.app"
})
public class DynamicPricingController {

    @Autowired
    private DynamicPricingService dynamicPricingService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private PriceFreezeService priceFreezeService;



    @GetMapping("/live/{entityType}/{entityId}")
    public DynamicPrice getLivePrice(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {

        return dynamicPricingService
                .getLivePrice(entityId, entityType);
    }



    @PostMapping("/update/{entityType}/{entityId}")
    public DynamicPrice updatePrice(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {

        return dynamicPricingService
                .updateDynamicPrice(entityId, entityType);
    }



    @GetMapping("/history/{entityId}")
    public List<PriceHistory> getPriceHistory(
            @PathVariable String entityId
    ) {

        return priceHistoryService
                .getEntityHistory(entityId);
    }



    @GetMapping("/trend/{entityId}")
    public Map<String, Object> getPriceTrend(
            @PathVariable String entityId
    ) {

        String trend =
                priceHistoryService.getPriceTrend(entityId);

        double averagePrice =
                priceHistoryService
                        .getAverageHistoricalPrice(entityId);

        double highestPrice =
                priceHistoryService
                        .getHighestPrice(entityId);

        double lowestPrice =
                priceHistoryService
                        .getLowestPrice(entityId);

        return Map.of(
                "trend", trend,
                "averagePrice", averagePrice,
                "highestPrice", highestPrice,
                "lowestPrice", lowestPrice
        );
    }



    @PostMapping("/freeze")
    public PriceFreeze freezePrice(
            @RequestBody Map<String, Object> request
    ) {

        String userId =
                (String) request.get("userId");

        String entityId =
                (String) request.get("entityId");

        String entityType =
                (String) request.get("entityType");

        int freezeMinutes =
                Integer.parseInt(
                        request.get("freezeMinutes").toString()
                );

        return priceFreezeService.freezePrice(
                userId,
                entityId,
                entityType,
                freezeMinutes
        );
    }



    @GetMapping("/freeze/user/{userId}")
    public List<PriceFreeze> getUserFreezes(
            @PathVariable String userId
    ) {

        return priceFreezeService
                .getUserFreezes(userId);
    }



    @GetMapping("/freeze/active/{userId}")
    public List<PriceFreeze> getActiveFreezes(
            @PathVariable String userId
    ) {

        return priceFreezeService
                .getActiveFreezes(userId);
    }



    @PutMapping("/freeze/cancel/{freezeId}")
    public PriceFreeze cancelFreeze(
            @PathVariable String freezeId
    ) {

        return priceFreezeService
                .cancelFreeze(freezeId);
    }



    @GetMapping(
            value = "/stream/{entityType}/{entityId}",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter streamLivePricing(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {

        SseEmitter emitter =
                new SseEmitter(Long.MAX_VALUE);

        new Thread(() -> {

            try {

                while (true) {

                    DynamicPrice updatedPrice =
                            dynamicPricingService
                                    .updateDynamicPrice(
                                            entityId,
                                            entityType
                                    );

                    emitter.send(
                            SseEmitter.event()
                                    .name("price-update")
                                    .data(updatedPrice)
                    );

                    Thread.sleep(15000);
                }

            } catch (IOException | InterruptedException e) {

                emitter.completeWithError(e);

            } finally {

                emitter.complete();
            }

        }).start();

        return emitter;
    }



    @GetMapping("/health")
    public Map<String, Object> healthCheck() {

        return Map.of(
                "status", "ACTIVE",
                "service", "Dynamic Pricing Engine",
                "timestamp", LocalDateTime.now()
        );
    }
}