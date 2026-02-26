package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.request.CustomerCreateUpdateDto;
import com.kiosk.pos.dto.response.CustomerDto;
import com.kiosk.pos.service.CustomerService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Registra un nuevo cliente en el sistema.
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreateCustomerController {

  private final CustomerService customerService;

  public CreateCustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @PostMapping
  public ResponseEntity<?> nuevo(@RequestBody CustomerCreateUpdateDto dto) {
    try {
      var guardado = customerService.create(
          dto.name(), dto.phone(), dto.email(), dto.address(), dto.creditLimit());
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(new CustomerDto(
              guardado.getId(),
              guardado.getName(),
              guardado.getPhone(),
              guardado.getEmail(),
              guardado.getAddress(),
              guardado.getCreditLimit(),
              guardado.getCurrentDebt()));
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("Ya existe") ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
