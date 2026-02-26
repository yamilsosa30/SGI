package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.request.CustomerCreateUpdateDto;
import com.kiosk.pos.dto.response.CustomerDto;
import com.kiosk.pos.service.CustomerService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Modifica los datos de un cliente.
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class UpdateCustomerController {

  private final CustomerService customerService;

  public UpdateCustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody CustomerCreateUpdateDto dto) {
    try {
      var guardado = customerService.update(
          id, dto.name(), dto.phone(), dto.email(), dto.address(), dto.creditLimit());
      return ResponseEntity.ok(new CustomerDto(
          guardado.getId(),
          guardado.getName(),
          guardado.getPhone(),
          guardado.getEmail(),
          guardado.getAddress(),
          guardado.getCreditLimit(),
          guardado.getCurrentDebt()));
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("Ya existe")
          ? HttpStatus.CONFLICT
          : e.getMessage().contains("no encontrado")
              ? HttpStatus.NOT_FOUND
              : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
