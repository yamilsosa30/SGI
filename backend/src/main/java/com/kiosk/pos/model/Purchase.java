package com.kiosk.pos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "purchases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private PurchaseStatus status = PurchaseStatus.PENDING;

  @ManyToOne
  @JoinColumn(name = "supplier_id")
  @JsonIgnoreProperties("purchases")
  private Supplier supplier;

  @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JsonManagedReference
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<PurchaseItem> items;

  @Transient
  public BigDecimal getTotalCost() {
    if (items == null) return BigDecimal.ZERO;
    return items.stream()
        .map(PurchaseItem::getSubtotal)
        .filter(v -> v != null)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  @PrePersist
  public void prePersist() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
    if (this.status == null) {
      this.status = PurchaseStatus.PENDING;
    }
  }
}
