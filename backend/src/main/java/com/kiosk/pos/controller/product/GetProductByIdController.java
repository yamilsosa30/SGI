package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Busca un producto por su ID.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetProductByIdController {

  private final ProductService productService;

  public GetProductByIdController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductDTO> buscarPorId(@PathVariable Long id) {
    return productService.getProductById(id)
        .map(p -> ResponseEntity.ok(ProductDTO.fromProduct(p, productService)))
        .orElse(ResponseEntity.notFound().build());
  }
}
