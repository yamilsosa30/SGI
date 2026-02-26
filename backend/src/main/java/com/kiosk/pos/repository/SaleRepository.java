package com.kiosk.pos.repository;

import com.kiosk.pos.model.Sale;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
  List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);

  @Query("SELECT SUM(s.total) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end")
  BigDecimal getTotalSalesBetween(LocalDateTime start, LocalDateTime end);

  @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end")
  Long getTransactionCountBetween(LocalDateTime start, LocalDateTime end);

  List<Sale> findByIsCreditTrue();
}
