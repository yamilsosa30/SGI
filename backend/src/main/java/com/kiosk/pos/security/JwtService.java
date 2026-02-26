package com.kiosk.pos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  @Value("${security.jwt.secret}")
  private String secret;

  @Value("${security.jwt.expiration-ms:28800000}") // 8h
  private long expirationMs;

  private Key signingKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(signingKey()).build().parseClaimsJws(token).getBody();
  }

  public String generateToken(String username, Map<String, Object> extraClaims) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(signingKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String token, String username) {
    final String user = extractUsername(token);
    return (user.equals(username) && !isTokenExpired(token));
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }
}
