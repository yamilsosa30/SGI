package com.kiosk.pos.dto.response;

public record AlertDTO(Long id, String type, String message, String priority, Long productId) {}
