package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String userId;
    private String hotelId;
    private String flightId;

    private int rating;          // 1–5 stars
    private String text;
    private List<String> photos;

    private List<String> replies;
    private boolean flagged;
    private LocalDateTime createdAt;


    private int helpfulCount;
    private List<String> helpfulUserIds;
    private String moderationStatus;

    public Review() {
        this.createdAt = LocalDateTime.now();
        this.moderationStatus = "PENDING";
        this.helpfulCount = 0;
    }


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }

    public List<String> getReplies() { return replies; }
    public void setReplies(List<String> replies) { this.replies = replies; }

    public boolean isFlagged() { return flagged; }
    public void setFlagged(boolean flagged) { this.flagged = flagged; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }

    public List<String> getHelpfulUserIds() { return helpfulUserIds; }
    public void setHelpfulUserIds(List<String> helpfulUserIds) { this.helpfulUserIds = helpfulUserIds; }

    public String getModerationStatus() { return moderationStatus; }
    public void setModerationStatus(String moderationStatus) { this.moderationStatus = moderationStatus; }
}

