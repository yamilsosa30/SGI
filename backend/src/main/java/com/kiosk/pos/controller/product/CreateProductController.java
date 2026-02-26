package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.model.Product;
import com.kiosk.pos.service.ProductService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoint para crear un nuevo producto.
 * El código de barras se genera automáticamente si no se envía uno.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreateProductController {

  private final ProductService productService;

  public CreateProductController(ProductService productService) {
    this.productService = productService;
  }

  @PostMapping
  public ResponseEntity<?> crear(@RequestBody Product producto) {
    try {
      Product guardado = productService.saveProduct(producto);
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(ProductDTO.fromProduct(guardado, productService));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest()
          .body(Map.of("error", e.getMessage()));
    }
  }
}
