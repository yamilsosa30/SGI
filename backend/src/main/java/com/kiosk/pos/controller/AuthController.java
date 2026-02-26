package com.kiosk.pos.controller;

import com.kiosk.pos.repository.UserRepository;
import com.kiosk.pos.security.JwtService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class AuthController {

  private record AuthRequest(String username, String password) {}

  private record AuthResponse(String token, String username, String role) {}

  private record MeResponse(String username, String role) {}

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;

  public AuthController(
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      UserRepository userRepository) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    var user = userRepository.findByUsername(request.username()).orElseThrow();
    String token =
        jwtService.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
    return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
    String username = auth.getName();
    var user = userRepository.findByUsername(username).orElse(null);
    if (user == null) return ResponseEntity.status(404).build();
    return ResponseEntity.ok(new MeResponse(user.getUsername(), user.getRole().name()));
  }
}
