package com.kiosk.pos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "customer_payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPayment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Customer customer;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal amount;

  @Column(length = 500)
  private String note;

  @Column(name = "paid_at", nullable = false)
  private LocalDateTime paidAt;

  @PrePersist
  public void prePersist() {
    if (this.paidAt == null) {
      this.paidAt = LocalDateTime.now();
    }
  }
}
