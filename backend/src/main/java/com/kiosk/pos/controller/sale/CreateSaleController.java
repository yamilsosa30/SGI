package com.kiosk.pos.controller.sale;

import com.kiosk.pos.dto.request.SaleRequest;
import com.kiosk.pos.model.Sale;
import com.kiosk.pos.service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreateSaleController {

  private final SaleService saleService;

  public CreateSaleController(final SaleService saleService) {
    this.saleService = saleService;
  }

  @PostMapping
  public ResponseEntity<?> execute(@RequestBody final SaleRequest saleRequest) {
    try {
      Sale sale = saleService.processSale(saleRequest);
      return ResponseEntity.ok(sale);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
