package com.kiosk.pos.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
  public static void main(String[] args) {
    if (args.length == 0) {
      System.out.println("Usage: HashGenerator <password>");
      return;
    }
    String pwd = args[0];
    String hash = new BCryptPasswordEncoder().encode(pwd);
    System.out.println(hash);
  }
}
