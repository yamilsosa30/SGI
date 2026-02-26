package com.kiosk.pos.controller.report;

import com.kiosk.pos.dto.response.TopProductDTO;
import com.kiosk.pos.service.ReportService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetTopProductsController {

  private final ReportService reportService;

  public GetTopProductsController(final ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/top-products")
  public List<TopProductDTO> execute(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate to,
      @RequestParam(defaultValue = "10") final int limit) {
    return reportService.getTopProducts(from, to, limit);
  }
}
