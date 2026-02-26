package com.kiosk.pos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String phone;
  private String email;
  private String address;

  @Column(name = "credit_limit", precision = 10, scale = 2)
  private BigDecimal creditLimit;

  @Column(name = "current_debt", precision = 10, scale = 2)
  @Builder.Default
  private BigDecimal currentDebt = BigDecimal.ZERO;

  @OneToMany(mappedBy = "customer")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<Sale> sales;
}
