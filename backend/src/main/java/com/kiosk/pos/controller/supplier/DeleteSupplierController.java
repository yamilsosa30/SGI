package com.kiosk.pos.controller.supplier;

import com.kiosk.pos.service.SupplierService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Borra un proveedor del sistema.
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class DeleteSupplierController {

  private final SupplierService supplierService;

  public DeleteSupplierController(SupplierService supplierService) {
    this.supplierService = supplierService;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> borrar(@PathVariable Long id) {
    try {
      supplierService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("error", e.getMessage()));
    }
  }
}
