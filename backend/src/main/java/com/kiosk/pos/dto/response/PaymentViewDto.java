package com.kiosk.pos.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentViewDto(Long id, BigDecimal amount, String note, LocalDateTime paidAt) {}
