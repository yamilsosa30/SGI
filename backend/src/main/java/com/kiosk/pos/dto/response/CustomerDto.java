package com.kiosk.pos.dto.response;

import java.math.BigDecimal;

public record CustomerDto(
    Long id,
    String name,
    String phone,
    String email,
    String address,
    BigDecimal creditLimit,
    BigDecimal currentDebt) {}
