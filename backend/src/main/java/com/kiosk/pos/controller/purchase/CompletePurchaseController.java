package com.kiosk.pos.controller.purchase;

import com.kiosk.pos.model.Purchase;
import com.kiosk.pos.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CompletePurchaseController {

  private final PurchaseService purchaseService;

  public CompletePurchaseController(final PurchaseService purchaseService) {
    this.purchaseService = purchaseService;
  }

  @PutMapping("/{id}/complete")
  public ResponseEntity<?> execute(@PathVariable final Long id) {
    try {
      Purchase purchase = purchaseService.complete(id);
      return ResponseEntity.ok(purchase);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.notFound().build();
    }
  }
}
