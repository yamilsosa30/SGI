package com.kiosk.pos.controller.supplier;

import com.kiosk.pos.dto.response.SupplierDto;
import com.kiosk.pos.service.SupplierService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Busca un proveedor por su ID.
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetSupplierByIdController {

  private final SupplierService supplierService;

  public GetSupplierByIdController(SupplierService supplierService) {
    this.supplierService = supplierService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> porId(@PathVariable Long id) {
    return supplierService.getById(id)
        .<ResponseEntity<?>>map(s -> ResponseEntity.ok(new SupplierDto(
            s.getId(), s.getName(), s.getPhone(), s.getEmail(), s.getAddress())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "No encontré el proveedor " + id)));
  }
}
