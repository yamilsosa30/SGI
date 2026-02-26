package com.kiosk.pos.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "purchase_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JsonBackReference
  @JoinColumn(name = "purchase_id", nullable = false)
  private Purchase purchase;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @Column(nullable = false)
  private Integer quantity;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal cost;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotal;

  @PrePersist
  @PreUpdate
  public void computeSubtotal() {
    if (cost != null && quantity != null) {
      this.subtotal = cost.multiply(BigDecimal.valueOf(quantity));
    }
  }
}
