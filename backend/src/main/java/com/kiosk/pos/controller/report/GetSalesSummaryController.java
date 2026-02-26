package com.kiosk.pos.controller.report;

import com.kiosk.pos.dto.response.SalesSummaryRow;
import com.kiosk.pos.dto.SummaryPeriod;
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
public class GetSalesSummaryController {

  private final ReportService reportService;

  public GetSalesSummaryController(final ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/sales-summary")
  public List<SalesSummaryRow> execute(
      @RequestParam(defaultValue = "DAILY") final SummaryPeriod period,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate to) {
    return reportService.getSalesSummary(period, from, to);
  }
}
