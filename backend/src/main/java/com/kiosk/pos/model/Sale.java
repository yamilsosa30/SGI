package com.kiosk.pos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "sales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "sale_date", nullable = false)
  private LocalDateTime saleDate;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal total;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false)
  private PaymentMethod paymentMethod;

  @ManyToOne
  @JsonIgnoreProperties("sales")
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JsonManagedReference
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<SaleItem> items;

  @Column(name = "is_credit")
  private Boolean isCredit = false;

  @PrePersist
  public void prePersist() {
    if (this.saleDate == null) {
      this.saleDate = LocalDateTime.now();
    }
  }
}
