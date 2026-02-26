package com.kiosk.pos.controller.supplier;

import com.kiosk.pos.dto.request.SupplierCreateUpdateDto;
import com.kiosk.pos.dto.response.SupplierDto;
import com.kiosk.pos.service.SupplierService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Actualiza los datos de un proveedor.
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class UpdateSupplierController {

  private final SupplierService supplierService;

  public UpdateSupplierController(SupplierService supplierService) {
    this.supplierService = supplierService;
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody SupplierCreateUpdateDto dto) {
    try {
      var guardado = supplierService.update(id, dto.name(), dto.phone(), dto.email(), dto.address());
      return ResponseEntity.ok(new SupplierDto(
          guardado.getId(), guardado.getName(), guardado.getPhone(), guardado.getEmail(), guardado.getAddress()));
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
