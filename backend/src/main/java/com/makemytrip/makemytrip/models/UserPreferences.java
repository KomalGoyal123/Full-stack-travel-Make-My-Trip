package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_preferences")
public class UserPreferences {

    @Id
    private String id;

    private String userId;
    private String flightSeatPref;
    private String hotelRoomPref;


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFlightSeatPref() { return flightSeatPref; }
    public void setFlightSeatPref(String flightSeatPref) { this.flightSeatPref = flightSeatPref; }

    public String getHotelRoomPref() { return hotelRoomPref; }
    public void setHotelRoomPref(String hotelRoomPref) { this.hotelRoomPref = hotelRoomPref; }
}

