package com.kiosk.pos.security;

import com.kiosk.pos.model.Role;
import com.kiosk.pos.model.User;
import com.kiosk.pos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataBootstrap {
  private static final Logger log = LoggerFactory.getLogger(DataBootstrap.class);

  @Bean
  CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder encoder) {
    return args -> {
      if (userRepository.count() == 0) {
        User admin =
            User.builder()
                .username("admin")
                .password(encoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build();
        User cashier =
            User.builder()
                .username("cajero")
                .password(encoder.encode("cajero123"))
                .role(Role.CASHIER)
                .active(true)
                .build();
        userRepository.save(admin);
        userRepository.save(cashier);
        log.info("Usuarios iniciales creados: admin/cajero");
      }
    };
  }
}
