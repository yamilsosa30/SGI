package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetExpiringProductsController {

  private final ProductService productService;

  public GetExpiringProductsController(final ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/expiring")
  public List<ProductDTO> execute() {
    return productService.getExpiringProducts().stream()
        .map(p -> ProductDTO.fromProduct(p, productService))
        .toList();
  }
}
