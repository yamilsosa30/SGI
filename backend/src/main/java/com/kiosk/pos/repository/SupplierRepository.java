package com.kiosk.pos.repository;

import com.kiosk.pos.model.Supplier;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
  Optional<Supplier> findByName(String name);

  List<Supplier> findByNameContainingIgnoreCase(String name);
}
