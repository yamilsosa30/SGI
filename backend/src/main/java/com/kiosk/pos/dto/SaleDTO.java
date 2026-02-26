package com.kiosk.pos.dto;

import com.kiosk.pos.model.PaymentMethod;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para las ventas, con soporte para productos por peso
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private List<SaleItemDTO> items;
    private PaymentMethod paymentMethod;
    private Long customerId;
    private Boolean isCredit;
    private BigDecimal total;
    
    /**
     * Calcula el total de la venta basado en los items.
     * @return El total calculado de la venta
     */
    public BigDecimal calculateTotal() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return items.stream()
                .map(SaleItemDTO::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
