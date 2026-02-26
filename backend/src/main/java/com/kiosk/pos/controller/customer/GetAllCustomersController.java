package com.kiosk.pos.controller.customer;

import com.kiosk.pos.dto.response.CustomerDto;
import com.kiosk.pos.service.CustomerService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Lista los clientes, con opción de filtrar por nombre.
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetAllCustomersController {

  private final CustomerService customerService;

  public GetAllCustomersController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping
  public List<CustomerDto> listar(@RequestParam(value = "q", required = false) String query) {
    return customerService.getAll(query).stream()
        .map(c -> new CustomerDto(
            c.getId(),
            c.getName(),
            c.getPhone(),
            c.getEmail(),
            c.getAddress(),
            c.getCreditLimit(),
            c.getCurrentDebt()))
        .toList();
  }
}
