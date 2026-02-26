package com.kiosk.pos.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para los items de una venta, con soporte para productos por peso
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItemDTO {
    private Long productId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Boolean soldByWeight;
    
    /**
     * Obtiene la cantidad efectiva para el cálculo del precio.
     * Si el producto se vende por peso, convierte los gramos a kilos.
     * @return La cantidad efectiva para el cálculo del precio
     */
    public BigDecimal getEffectiveQuantity() {
        if (Boolean.TRUE.equals(soldByWeight)) {
            // Convertir gramos a kilos (dividir por 1000)
            return BigDecimal.valueOf(quantity).divide(BigDecimal.valueOf(1000));
        } else {
            return BigDecimal.valueOf(quantity);
        }
    }
    
    /**
     * Calcula el subtotal del item.
     * @return El subtotal del item
     */
    public BigDecimal calculateSubtotal() {
        return unitPrice.multiply(getEffectiveQuantity());
    }
}
