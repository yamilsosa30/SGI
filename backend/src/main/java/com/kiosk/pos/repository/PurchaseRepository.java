package com.kiosk.pos.repository;

import com.kiosk.pos.model.Purchase;
import com.kiosk.pos.model.PurchaseStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
  List<Purchase> findAllByOrderByCreatedAtDesc();

  List<Purchase> findByStatusOrderByCreatedAtDesc(PurchaseStatus status);

  long countByStatus(PurchaseStatus status);

  List<Purchase> findByStatusAndCreatedAtBetween(
      PurchaseStatus status, LocalDateTime start, LocalDateTime end);
}
