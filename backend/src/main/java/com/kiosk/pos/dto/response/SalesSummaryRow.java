package com.kiosk.pos.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalesSummaryRow(
    String label, LocalDate startDate, LocalDate endDate, long transactions, BigDecimal total) {}
