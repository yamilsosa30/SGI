package com.kiosk.pos.controller.product;

import com.kiosk.pos.dto.response.ProductDTO;
import com.kiosk.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Busca un producto escaneando su código de barras.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetProductByBarcodeController {

  private final ProductService productService;

  public GetProductByBarcodeController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/barcode/{barcode}")
  public ResponseEntity<ProductDTO> porBarcode(@PathVariable String barcode) {
    return productService.getProductByBarcode(barcode)
        .map(p -> ResponseEntity.ok(ProductDTO.fromProduct(p, productService)))
        .orElse(ResponseEntity.notFound().build());
  }
}
