package com.kiosk.pos.repository;

import com.kiosk.pos.model.CustomerPayment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Long> {
  List<CustomerPayment> findByCustomerIdOrderByPaidAtDesc(Long customerId);
}
