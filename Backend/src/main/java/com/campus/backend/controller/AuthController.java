package com.campus.backend.controller;

import com.campus.backend.dtos.AuthRequest;
import com.campus.backend.dtos.AuthResponse;
import com.campus.backend.dtos.ForgotPasswordRequest;
import com.campus.backend.dtos.UserDto;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
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

    @PostMapping("/forgot-password/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request.getEmail());
        return new ResponseEntity<>("Password reset link sent to your email if it exists.", HttpStatus.OK);
    }

    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return new ResponseEntity<>("Your password has been reset successfully.", HttpStatus.OK);
    }
}