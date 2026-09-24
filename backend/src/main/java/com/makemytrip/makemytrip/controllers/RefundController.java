package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Refund;
import com.makemytrip.makemytrip.repositories.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/refunds")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://your-app.netlify.app",
        "https://your-app.vercel.app"
})
public class RefundController {

    @Autowired
    private RefundRepository refundRepository;




    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Refund>> getRefundsByUserId(@PathVariable String userId) {
        List<Refund> refunds = refundRepository.findByUserId(userId);
        return ResponseEntity.ok(refunds);
    }




    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Refund>> getRefundsByBookingId(@PathVariable String bookingId) {
        List<Refund> refunds = refundRepository.findByBookingId(bookingId);
        return ResponseEntity.ok(refunds);
    }


    @PostMapping
    public ResponseEntity<Refund> createRefund(@RequestBody Refund refund) {
        Refund savedRefund = refundRepository.save(refund);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRefund);
    }
}
