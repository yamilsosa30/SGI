package com.kiosk.pos.controller.purchase;

import com.kiosk.pos.dto.request.PurchaseRequest;
import com.kiosk.pos.model.Purchase;
import com.kiosk.pos.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreatePurchaseController {

  private final PurchaseService purchaseService;

  public CreatePurchaseController(final PurchaseService purchaseService) {
    this.purchaseService = purchaseService;
  }

  @PostMapping
  public ResponseEntity<?> execute(@RequestBody final PurchaseRequest request) {
    try {
      Purchase purchase = purchaseService.createPending(request);
      return ResponseEntity.ok(purchase);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
