package com.kiosk.pos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(unique = true, nullable = false)
  private String barcode;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal stock;

  @Column(name = "min_stock", precision = 10, scale = 2)
  private BigDecimal minStock;

  @Column(name = "expiry_date")
  private LocalDate expiryDate;

  @ManyToOne
  @JoinColumn(name = "category_id")
  @JsonIgnoreProperties("products")
  private Category category;

  @Column(nullable = false)
  @Builder.Default
  private Boolean active = true;
}
