package com.kiosk.pos.controller.sale;

import com.kiosk.pos.service.SaleService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetTodayTransactionCountController {

  private final SaleService saleService;

  public GetTodayTransactionCountController(final SaleService saleService) {
    this.saleService = saleService;
  }

  @GetMapping("/count-today")
  public Long execute() {
    return saleService.getTodayTransactionCount();
  }
}
