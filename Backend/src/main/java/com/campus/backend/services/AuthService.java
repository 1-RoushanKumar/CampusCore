package com.campus.backend.services;

import com.campus.backend.dtos.AuthRequest;
import com.campus.backend.dtos.AuthResponse;
import com.campus.backend.dtos.UserDto;
import com.campus.backend.entity.User;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.UserRepository;
import com.campus.backend.security.jwt.JwtHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtHelper jwtHelper;
    private final UserDetailsService userDetailsService; // CustomUserDetailsService

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtHelper jwtHelper,
                       UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public UserDto registerUser(UserDto userDto, Role role) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        userDto.setId(savedUser.getId());
        userDto.setRole(savedUser.getRole());
        userDto.setPassword(null); // Clear password for DTO response
        return userDto;
    }

    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        String token = jwtHelper.generateToken(userDetails);

        User user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
