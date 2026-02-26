package com.kiosk.pos.service;

import com.kiosk.pos.dto.request.PurchaseItemRequest;
import com.kiosk.pos.dto.request.PurchaseRequest;
import com.kiosk.pos.model.*;
import com.kiosk.pos.repository.ProductRepository;
import com.kiosk.pos.repository.PurchaseRepository;
import com.kiosk.pos.repository.SupplierRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PurchaseService {

  private final PurchaseRepository purchaseRepository;
  private final SupplierRepository supplierRepository;
  private final ProductRepository productRepository;
  private final ProductService productService;

  @Transactional
  public Purchase createPending(PurchaseRequest request) {
    Purchase purchase = new Purchase();
    purchase.setStatus(PurchaseStatus.PENDING);
    purchase.setCreatedAt(LocalDateTime.now());
    if (request.getSupplierId() != null) {
      supplierRepository.findById(request.getSupplierId()).ifPresent(purchase::setSupplier);
    }

    List<PurchaseItem> items = new ArrayList<>();
    if (request.getItems() != null) {
      for (PurchaseItemRequest it : request.getItems()) {
        productRepository
            .findById(it.getProductId())
            .ifPresent(
                prod -> {
                  PurchaseItem pi =
                      PurchaseItem.builder()
                          .purchase(purchase)
                          .product(prod)
                          .quantity(it.getQuantity())
                          .cost(it.getCost())
                          .build();
                  items.add(pi);
                });
      }
    }
    purchase.setItems(items);
    return purchaseRepository.save(purchase);
  }

  @Transactional
  public Purchase complete(Long id) {
    return purchaseRepository
        .findById(id)
        .map(
            p -> {
              if (p.getItems() != null) {
                p.getItems()
                    .forEach(
                        it ->
                            productService.increaseStock(
                                it.getProduct().getId(), it.getQuantity()));
              }
              p.setStatus(PurchaseStatus.COMPLETED);
              p.setCompletedAt(LocalDateTime.now());
              return purchaseRepository.save(p);
            })
        .orElseThrow(() -> new IllegalArgumentException("Compra no encontrada"));
  }

  @Transactional
  public void cancel(Long id) {
    purchaseRepository
        .findById(id)
        .ifPresent(
            p -> {
              p.setStatus(PurchaseStatus.CANCELED);
              purchaseRepository.save(p);
            });
  }

  public long countPending() {
    return purchaseRepository.countByStatus(PurchaseStatus.PENDING);
  }

  public List<Purchase> findAll() {
    return purchaseRepository.findAllByOrderByCreatedAtDesc();
  }

  public List<Purchase> findPending() {
    return purchaseRepository.findByStatusOrderByCreatedAtDesc(PurchaseStatus.PENDING);
  }
}
