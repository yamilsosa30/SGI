package com.kiosk.pos.repository;

import com.kiosk.pos.model.Product;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findByBarcode(String barcode);

  List<Product> findByNameContainingIgnoreCase(String name);

  @Query("SELECT p FROM Product p WHERE p.stock <= p.minStock AND p.active = true")
  List<Product> findLowStockProducts();

  @Query("SELECT p FROM Product p WHERE p.expiryDate <= :date AND p.active = true")
  List<Product> findExpiringProducts(LocalDate date);

  List<Product> findByActiveTrue();

  @Query("SELECT p.barcode FROM Product p WHERE p.barcode LIKE CONCAT(:prefix, '%')")
  List<String> findBarcodesStartingWith(@Param("prefix") String prefix);
}
