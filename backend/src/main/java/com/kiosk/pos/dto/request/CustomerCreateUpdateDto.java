package com.kiosk.pos.dto.request;

import java.math.BigDecimal;

public record CustomerCreateUpdateDto(
    String name, String phone, String email, String address, BigDecimal creditLimit) {}
