package com.kiosk.pos.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CashflowSummaryRow(
    String label,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal purchases,
    BigDecimal sales,
    BigDecimal net) {}
