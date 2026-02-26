package com.kiosk.pos.controller.dashboard;

import com.kiosk.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class ResolveAlertController {

  private final ProductService productService;

  public ResolveAlertController(final ProductService productService) {
    this.productService = productService;
  }

  @PutMapping("/alerts/resolve/{id}")
  public ResponseEntity<?> execute(@PathVariable final Long id, @RequestParam final String type) {
    try {
      if ("NEGATIVE_STOCK".equalsIgnoreCase(type)) {
        productService.clearNegativeStockProduct(id);
        return ResponseEntity.ok().build();
      }
      // Otros tipos de alertas pueden manejarse aquí en el futuro
      return ResponseEntity.badRequest().body("Tipo de alerta no soportado: " + type);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Error al resolver alerta: " + e.getMessage());
    }
  }
}
