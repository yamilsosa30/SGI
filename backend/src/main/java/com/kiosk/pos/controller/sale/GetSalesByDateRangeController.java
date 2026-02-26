package com.kiosk.pos.controller.sale;

import com.kiosk.pos.model.Sale;
import com.kiosk.pos.service.SaleService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetSalesByDateRangeController {

  private final SaleService saleService;

  public GetSalesByDateRangeController(final SaleService saleService) {
    this.saleService = saleService;
  }

  @GetMapping("/date-range")
  public List<Sale> execute(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate startDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate endDate) {
    return saleService.getSalesByDateRange(startDate, endDate);
  }
}
