package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.UserPreferences;
import com.makemytrip.makemytrip.repositories.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepository repository;


    public UserPreferences savePreference(UserPreferences preference) {
        return repository.save(preference);
    }

    public List<UserPreferences> getPreferences(String userId) {
        return repository.findByUserId(userId);
    }


    public void deletePreferences(String userId) {
        repository.deleteByUserId(userId);
    }
}
