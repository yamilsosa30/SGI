package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.response.CustomerDto;
import com.kiosk.pos.service.CustomerService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Busca un cliente por su ID.
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetCustomerByIdController {

  private final CustomerService customerService;

  public GetCustomerByIdController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> porId(@PathVariable Long id) {
    return customerService.getById(id)
        .<ResponseEntity<?>>map(c -> ResponseEntity.ok(new CustomerDto(
            c.getId(),
            c.getName(),
            c.getPhone(),
            c.getEmail(),
            c.getAddress(),
            c.getCreditLimit(),
            c.getCurrentDebt())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "No encontré el cliente " + id)));
  }
}
