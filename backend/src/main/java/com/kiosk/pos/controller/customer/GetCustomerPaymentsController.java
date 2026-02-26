package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.response.PaymentViewDto;
import com.kiosk.pos.service.CustomerService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetCustomerPaymentsController {

  private final CustomerService customerService;

  public GetCustomerPaymentsController(final CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping("/{id}/payments")
  public ResponseEntity<?> execute(@PathVariable final Long id) {
    try {
      List<PaymentViewDto> payments =
          customerService.getPayments(id).stream()
              .map(p -> new PaymentViewDto(p.getId(), p.getAmount(), p.getNote(), p.getPaidAt()))
              .toList();
      return ResponseEntity.ok(payments);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("message", e.getMessage()));
    }
  }
}
