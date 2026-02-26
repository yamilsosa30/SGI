package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.response.CustomerDto;
import com.kiosk.pos.dto.request.CustomerPaymentDto;
import com.kiosk.pos.service.CustomerService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class RegisterCustomerPaymentController {

  private final CustomerService customerService;

  public RegisterCustomerPaymentController(final CustomerService customerService) {
    this.customerService = customerService;
  }

  @PostMapping("/{id}/payments")
  public ResponseEntity<?> execute(
      @PathVariable final Long id, @RequestBody final CustomerPaymentDto dto) {
    try {
      var savedCustomer = customerService.registerPayment(id, dto.amount(), dto.note());
      return ResponseEntity.ok(
          new CustomerDto(
              savedCustomer.getId(),
              savedCustomer.getName(),
              savedCustomer.getPhone(),
              savedCustomer.getEmail(),
              savedCustomer.getAddress(),
              savedCustomer.getCreditLimit(),
              savedCustomer.getCurrentDebt()));
    } catch (IllegalArgumentException e) {
      HttpStatus status =
          e.getMessage().contains("no encontrado")
              ? HttpStatus.NOT_FOUND
              : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("message", e.getMessage()));
    }
  }
}
