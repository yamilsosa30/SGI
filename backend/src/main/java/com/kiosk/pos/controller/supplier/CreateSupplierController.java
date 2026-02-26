package com.kiosk.pos.controller.supplier;

import com.kiosk.pos.dto.request.SupplierCreateUpdateDto;
import com.kiosk.pos.dto.response.SupplierDto;
import com.kiosk.pos.service.SupplierService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Da de alta un nuevo proveedor.
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreateSupplierController {

  private final SupplierService supplierService;

  public CreateSupplierController(SupplierService supplierService) {
    this.supplierService = supplierService;
  }

  @PostMapping
  public ResponseEntity<?> nuevo(@RequestBody SupplierCreateUpdateDto dto) {
    try {
      var guardado = supplierService.create(dto.name(), dto.phone(), dto.email(), dto.address());
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(new SupplierDto(
              guardado.getId(),
              guardado.getName(),
              guardado.getPhone(),
              guardado.getEmail(),
              guardado.getAddress()));
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("Ya existe") ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
