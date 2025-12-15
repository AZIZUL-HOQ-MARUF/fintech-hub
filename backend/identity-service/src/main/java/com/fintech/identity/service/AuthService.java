package com.fintech.identity.service;

import com.fintech.common.util.JwtUtils;
import com.fintech.identity.dto.AuthRequest;
import com.fintech.identity.dto.AuthResponse;
import com.fintech.identity.entity.Role;
import com.fintech.identity.entity.User;
import com.fintech.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(AuthRequest request) {
                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .build();
                userRepository.save(user);

                Map<String, Object> claims = new HashMap<>();
                claims.put("userId", user.getId());
                var jwtToken = jwtUtils.generateToken(claims, user.getEmail());
                var refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

                return AuthResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .build();
        }

        public AuthResponse login(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();

                Map<String, Object> claims = new HashMap<>();
                claims.put("userId", user.getId());
                var jwtToken = jwtUtils.generateToken(claims, user.getEmail());
                var refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

                return AuthResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .build();
        }

        public AuthResponse refreshToken(String token) {
                String username = jwtUtils.extractUsername(token);
                if (username != null && jwtUtils.isTokenValid(token, username)) {
                        var user = userRepository.findByEmail(username).orElseThrow();
                        Map<String, Object> claims = new HashMap<>();
                        claims.put("userId", user.getId());
                        var accessToken = jwtUtils.generateToken(claims, user.getEmail());
                        // Optionally rotate refresh token
                        return AuthResponse.builder()
                                        .accessToken(accessToken)
                                        .refreshToken(token) // Return same refresh token or rotate
                                        .build();
                }
                throw new RuntimeException("Invalid Refresh Token");
        }
}
