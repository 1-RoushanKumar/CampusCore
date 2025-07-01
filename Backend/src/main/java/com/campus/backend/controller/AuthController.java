package com.campus.backend.controller;

import com.campus.backend.dtos.AuthRequest;
import com.campus.backend.dtos.AuthResponse;
import com.campus.backend.dtos.UserDto;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Allow all origins for CORS; adjust as needed for security
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserDto> registerAdmin(@Valid @RequestBody UserDto userDto) {
        UserDto registeredUser = authService.registerUser(userDto, Role.ROLE_ADMIN);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    // Educators and Students will be created by Admin through AdminController, not via direct registration
    // This design choice is based on the prompt "Admin can: Create login credentials for all users"
}
