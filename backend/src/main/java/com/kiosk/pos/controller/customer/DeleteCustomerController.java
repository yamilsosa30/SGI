package com.kiosk.pos.controller.customer;

import com.kiosk.pos.service.CustomerService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Borra un cliente. No se puede si tiene ventas asociadas.
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class DeleteCustomerController {

  private final CustomerService customerService;

  public DeleteCustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> borrar(@PathVariable Long id) {
    try {
      customerService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("asociadas") ? HttpStatus.CONFLICT : HttpStatus.NOT_FOUND;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
