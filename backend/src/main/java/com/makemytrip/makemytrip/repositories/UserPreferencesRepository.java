package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.UserPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPreferencesRepository extends MongoRepository<UserPreferences, String> {


    List<UserPreferences> findByUserId(String userId);

    void deleteByUserId(String userId);
}
