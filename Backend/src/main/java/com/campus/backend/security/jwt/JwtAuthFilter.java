package com.campus.backend.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class); // Changed logger name to JwtAuthFilter.class
    private final JwtHelper jwtHelper;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtHelper jwtHelper, UserDetailsService userDetailsService) {
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Authorization header example: Bearer 23523456asdfgh
        String requestHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        if (requestHeader != null && requestHeader.startsWith("Bearer")) {
            token = requestHeader.substring(7);
            try {
                username = this.jwtHelper.getUsernameFromToken(token);
            } catch (IllegalArgumentException e) {
                // Replaced e.printStackTrace()
                logger.error("Illegal Argument while fetching the username from token: {}", e.getMessage(), e);
            } catch (ExpiredJwtException e) {
                // Replaced e.printStackTrace()
                logger.error("Given jwt token is expired: {}", e.getMessage(), e);
            } catch (MalformedJwtException e) {
                // Replaced e.printStackTrace()
                logger.error("Malformed JWT token or signature changed: {}", e.getMessage(), e);
            } catch (Exception e) {
                // Replaced e.printStackTrace()
                logger.error("An unexpected error occurred during JWT token processing: {}", e.getMessage(), e);
            }
        } else {
            logger.warn("Invalid or missing Authorization header (expected 'Bearer <token>') for request: {}", request.getRequestURI());
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch user detail from username
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            Boolean validateToken = this.jwtHelper.validateToken(token, userDetails);
            if (validateToken) {
                // Set the authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Successfully authenticated user: {}", username); // Use debug for frequent logs
            } else {
                logger.warn("JWT token validation failed for user: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }
}