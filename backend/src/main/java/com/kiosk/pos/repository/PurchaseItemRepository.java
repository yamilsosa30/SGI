package com.kiosk.pos.repository;

import com.kiosk.pos.model.PurchaseItem;
import com.kiosk.pos.model.PurchaseStatus;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {

  @Query(
      "SELECT pi FROM PurchaseItem pi "
          + "WHERE pi.product.id IN :productIds "
          + "AND pi.purchase.createdAt <= :at "
          + "AND pi.purchase.status = :status "
          + "ORDER BY pi.purchase.createdAt ASC, pi.id ASC")
  List<PurchaseItem> findAllForProductsUpToDate(
      Collection<Long> productIds, LocalDateTime at, PurchaseStatus status);
}
