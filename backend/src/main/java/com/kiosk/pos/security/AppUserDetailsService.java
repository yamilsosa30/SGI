package com.kiosk.pos.security;

import com.kiosk.pos.model.User;
import com.kiosk.pos.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public AppUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User u =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    String roleName = "ROLE_" + u.getRole().name();
    return new org.springframework.security.core.userdetails.User(
        u.getUsername(),
        u.getPassword(),
        u.getActive(), // enabled
        true,
        true,
        true,
        List.of(new SimpleGrantedAuthority(roleName)));
  }
}
