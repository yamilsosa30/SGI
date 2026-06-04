package com.kiosk.pos.security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final UserDetailsService userDetailsService;

  public SecurityConfig(
      JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsService userDetailsService) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.userDetailsService = userDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/api/auth/**")
                    .permitAll()
                    .requestMatchers("/actuator/health", "/actuator/info")
                    .permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    // Ventas y reportes (GET): admin y cajero
                    .requestMatchers(HttpMethod.GET, "/api/sales/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    .requestMatchers(HttpMethod.POST, "/api/sales/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    // Productos/Categorías/Proveedores/Clientes/Purchases: GET visibles a ambos
                    .requestMatchers(
                        HttpMethod.GET,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/suppliers/**",
                        "/api/customers/**",
                        "/api/purchases/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    // Reportes y Dashboard: GET visibles a ambos
                    .requestMatchers(HttpMethod.GET, "/api/reports/**", "/api/dashboard/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    // Cobros de clientes (pagos) desde caja: permitir a ambos
                    .requestMatchers(HttpMethod.POST, "/api/customers/*/payments")
                    .hasAnyRole("ADMIN", "CASHIER")
                    // Gestión de clientes: permitir alta/edición también a CAJERO (no borrar)
                    .requestMatchers(HttpMethod.POST, "/api/customers/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    .requestMatchers(HttpMethod.PUT, "/api/customers/**")
                    .hasAnyRole("ADMIN", "CASHIER")
                    // Administración
                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")
                    // Gestión (POST/PUT) de otros recursos: solo admin
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/suppliers/**",
                        "/api/purchases/**")
                    .hasRole("ADMIN")
                    .requestMatchers(
                        HttpMethod.PUT,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/suppliers/**",
                        "/api/purchases/**")
                    .hasRole("ADMIN")
                    .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/suppliers/**",
                        "/api/customers/**",
                        "/api/purchases/**")
                    .hasRole("ADMIN")
                    .anyRequest()
                    .authenticated())
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // ATENCIÓN: No seguro para producción. A pedido, se usa texto plano en BD.
    return NoOpPasswordEncoder.getInstance();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Usar patrones para permitir localhost y red local (ej. 192.168.x.x)
    configuration.setAllowedOriginPatterns(
        List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://192.168.*.*:*",
            "http://10.*.*.*:*",
            "http://172.*.*.*:*",
            "http://*.local:*"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
