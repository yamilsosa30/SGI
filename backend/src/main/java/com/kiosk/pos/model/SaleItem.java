package com.kiosk.pos.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kiosk.pos.util.Constants;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sale_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JsonBackReference
  @JoinColumn(name = "sale_id", nullable = false)
  private Sale sale;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @Column(nullable = false)
  private Integer quantity;

  @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal unitPrice;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotal;

  @PrePersist
  @PreUpdate
  public void computeSubtotal() {
    if (unitPrice != null && quantity != null) {
      boolean byWeight = false;
      try {
        byWeight =
            product != null
                && product.getCategory() != null
                && Constants.Categories.WEIGHT_CATEGORY_NAME.equals(
                    product.getCategory().getName());
      } catch (Exception ignored) {
      }

      if (byWeight) {
        // quantity viene en gramos; convertir a kilos para el cálculo del precio (2 decimales)
        BigDecimal weightInKg =
            BigDecimal.valueOf(quantity).divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
        this.subtotal = unitPrice.multiply(weightInKg).setScale(2, RoundingMode.HALF_UP);
      } else {
        this.subtotal =
            unitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
      }
    }
  }
}
