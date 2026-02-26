package com.kiosk.pos.controller.report;

import com.kiosk.pos.dto.SummaryPeriod;
import com.kiosk.pos.service.ReportService;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetProfitSummaryPdfController {

  private final ReportService reportService;

  public GetProfitSummaryPdfController(final ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping(value = "/profit-summary.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
  public ResponseEntity<byte[]> execute(
      @RequestParam(defaultValue = "DAILY") final SummaryPeriod period,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate to) {
    byte[] pdf = reportService.generateProfitSummaryPdf(period, from, to);
    String filename = "ganancias-" + period.name().toLowerCase() + ".pdf";
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
  }
}
