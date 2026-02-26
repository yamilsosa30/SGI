package com.kiosk.pos.repository;

import com.kiosk.pos.model.SaleItem;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

  @Query(
      "SELECT si.product.id, si.product.name, SUM(si.quantity), SUM(si.subtotal) "
          + "FROM SaleItem si "
          + "WHERE si.sale.saleDate BETWEEN :start AND :end "
          + "GROUP BY si.product.id, si.product.name "
          + "ORDER BY SUM(si.quantity) DESC")
  List<Object[]> aggregateTopProducts(LocalDateTime start, LocalDateTime end);

  @Query(
      "SELECT si FROM SaleItem si "
          + "WHERE si.sale.saleDate BETWEEN :start AND :end "
          + "ORDER BY si.sale.saleDate ASC, si.id ASC")
  List<SaleItem> findItemsBetween(LocalDateTime start, LocalDateTime end);
}
