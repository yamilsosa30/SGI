package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Búsqueda de productos por nombre (para el autocompletado del POS).
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class SearchProductsController {

  private final ProductService productService;

  public SearchProductsController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/search")
  public List<ProductDTO> buscar(@RequestParam String query) {
    return productService.searchProductsByName(query).stream()
        .map(p -> ProductDTO.fromProduct(p, productService))
        .toList();
  }
}
