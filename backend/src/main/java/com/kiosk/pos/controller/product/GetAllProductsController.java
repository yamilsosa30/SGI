package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Lista todos los productos activos del sistema.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetAllProductsController {

  private final ProductService productService;

  public GetAllProductsController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public List<ProductDTO> listar() {
    return productService.getAllActiveProducts().stream()
        .map(p -> ProductDTO.fromProduct(p, productService))
        .toList();
  }
}
