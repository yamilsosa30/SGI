package com.kiosk.pos.dto.request;

import java.math.BigDecimal;

public record CustomerPaymentDto(BigDecimal amount, String note) {}
