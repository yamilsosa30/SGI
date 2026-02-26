package com.kiosk.pos.controller.sale;

import com.kiosk.pos.service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class DeleteSaleController {

  private final SaleService saleService;

  public DeleteSaleController(final SaleService saleService) {
    this.saleService = saleService;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> execute(@PathVariable final Long id) {
    try {
      saleService.deleteSale(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
