package com.kiosk.pos.controller.purchase;

import com.kiosk.pos.model.Purchase;
import com.kiosk.pos.service.PurchaseService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetPendingPurchasesController {

  private final PurchaseService purchaseService;

  public GetPendingPurchasesController(final PurchaseService purchaseService) {
    this.purchaseService = purchaseService;
  }

  @GetMapping("/pending")
  public List<Purchase> execute() {
    return purchaseService.findPending();
  }
}
