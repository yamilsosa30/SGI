package com.kiosk.pos.dto.response;

import java.math.BigDecimal;

public record TopProductDTO(
    Long productId, String name, Long totalQuantity, BigDecimal totalRevenue) {}
