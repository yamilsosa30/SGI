package com.kiosk.pos.controller.supplier;

import com.kiosk.pos.dto.response.SupplierDto;
import com.kiosk.pos.service.SupplierService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Lista todos los proveedores registrados.
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetAllSuppliersController {

  private final SupplierService supplierService;

  public GetAllSuppliersController(SupplierService supplierService) {
    this.supplierService = supplierService;
  }

  @GetMapping
  public List<SupplierDto> todos() {
    return supplierService.getAll().stream()
        .map(s -> new SupplierDto(s.getId(), s.getName(), s.getPhone(), s.getEmail(), s.getAddress()))
        .toList();
  }
}
