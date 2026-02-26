package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.model.Product;
import com.kiosk.pos.service.ProductService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Actualiza los datos de un producto existente.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class UpdateProductController {

  private final ProductService productService;

  public UpdateProductController(ProductService productService) {
    this.productService = productService;
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Product producto) {
    return productService.getProductById(id)
        .map(existente -> {
          try {
            producto.setId(id);
            Product guardado = productService.saveProduct(producto);
            return ResponseEntity.ok(ProductDTO.fromProduct(guardado, productService));
          } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
          }
        })
        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "No existe el producto con id " + id)));
  }
}
