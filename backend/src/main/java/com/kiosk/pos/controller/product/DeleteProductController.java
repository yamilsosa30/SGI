package com.kiosk.pos.controller.product;

import com.kiosk.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Elimina (desactiva) un producto del sistema.
 * No borra físicamente, solo lo marca como inactivo.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class DeleteProductController {

  private final ProductService productService;

  public DeleteProductController(ProductService productService) {
    this.productService = productService;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    return productService.getProductById(id)
        .map(p -> {
          productService.deleteProduct(id);
          return ResponseEntity.ok().<Void>build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}
