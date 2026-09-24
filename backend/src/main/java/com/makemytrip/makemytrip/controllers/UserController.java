package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.UserServices;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://your-app.netlify.app",
        "https://your-app.vercel.app"
})
public class UserController {
    @Autowired
    private UserServices userServices;

    @PostMapping("/login")
    public ResponseEntity<Users> login(@RequestBody Users loginRequest) {
        Users user = userServices.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(403).build(); // Forbidden if login fails
    }


    @PostMapping("/signup")
    public  ResponseEntity<Users> signup(@RequestBody Users user){
        return ResponseEntity.ok(userServices.signup(user));
    }

    @GetMapping("/email")
    public ResponseEntity<Users> getuserbyemail(@RequestParam String email){
        Users user = userServices.getUserByEmail(email);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/edit")
    public Users editprofile(@RequestParam String id ,@RequestBody Users updatedUser){
        return userServices.editprofile(id,updatedUser);
    }

    @GetMapping("/profile")
    public ResponseEntity<Users> profile(@RequestParam String email) {
        Users user = userServices.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
}

