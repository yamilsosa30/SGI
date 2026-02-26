package com.kiosk.pos.controller.sale;

import com.kiosk.pos.service.SaleService;
import java.math.BigDecimal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetTodayTotalController {

  private final SaleService saleService;

  public GetTodayTotalController(final SaleService saleService) {
    this.saleService = saleService;
  }

  @GetMapping("/total-today")
  public BigDecimal execute() {
    return saleService.getTodayTotal();
  }
}
