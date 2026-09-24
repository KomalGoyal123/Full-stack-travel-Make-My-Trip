package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.UserPreferences;
import com.makemytrip.makemytrip.services.UserPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preferences")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://make-my-trip-full-stake.netlify.app",
        "https://your-app.vercel.app"
})
public class UserPreferencesController {

    @Autowired
    private UserPreferencesService service;


    @PostMapping
    public UserPreferences savePreference(@RequestBody UserPreferences preference) {
        if (preference.getUserId() == null || preference.getUserId().isEmpty()) {
            throw new RuntimeException("UserId is required");
        }
        return service.savePreference(preference);
    }


    @GetMapping("/{userId}")
    public List<UserPreferences> getPreferences(@PathVariable String userId) {
        return service.getPreferences(userId);
    }


    @DeleteMapping("/{userId}")
    public String deletePreferences(@PathVariable String userId) {
        service.deletePreferences(userId);
        return "Preferences deleted successfully for userId: " + userId;
    }


    @PutMapping("/{userId}")
    public UserPreferences updatePreference(
            @PathVariable String userId,
            @RequestBody UserPreferences updatedPref) {

        List<UserPreferences> existingPrefs = service.getPreferences(userId);
        if (existingPrefs.isEmpty()) {
            throw new RuntimeException("No preferences found for userId: " + userId);
        }

        UserPreferences pref = existingPrefs.get(0);

        if (updatedPref.getFlightSeatPref() != null) {
            pref.setFlightSeatPref(updatedPref.getFlightSeatPref());
        }


        if (updatedPref.getHotelRoomPref() != null) {
            pref.setHotelRoomPref(updatedPref.getHotelRoomPref());
        }

        return service.savePreference(pref);
    }
}

