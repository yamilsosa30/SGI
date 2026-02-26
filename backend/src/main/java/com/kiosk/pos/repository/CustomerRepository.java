package com.kiosk.pos.repository;

import com.kiosk.pos.model.Customer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
  Optional<Customer> findByPhone(String phone);

  List<Customer> findByNameContainingIgnoreCase(String name);

  @Query("SELECT c FROM Customer c WHERE c.currentDebt > 0")
  List<Customer> findCustomersWithDebt();
}
