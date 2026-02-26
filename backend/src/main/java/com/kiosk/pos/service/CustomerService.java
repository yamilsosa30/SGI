package com.kiosk.pos.service;

import com.kiosk.pos.model.Customer;
import com.kiosk.pos.model.CustomerPayment;
import com.kiosk.pos.repository.CustomerPaymentRepository;
import com.kiosk.pos.repository.CustomerRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

  private final CustomerRepository customerRepository;
  private final CustomerPaymentRepository paymentRepository;

  // GET ALL (sin filtro)
  public List<Customer> getAll() {
    return customerRepository.findAll();
  }

  // GET ALL (con búsqueda por nombre)
  public List<Customer> getAll(final String query) {
    if (query == null || query.isBlank()) {
      return customerRepository.findAll();
    }
    return customerRepository.findByNameContainingIgnoreCase(query);
  }

  // GET BY ID
  public Optional<Customer> getById(final Long id) {
    return customerRepository.findById(id);
  }

  // CREATE
  public Customer create(
      final String name,
      final String phone,
      final String email,
      final String address,
      final BigDecimal creditLimit) {
    // 1. Validación de nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // 2. Validación de teléfono duplicado
    if (phone != null
        && !phone.isBlank()
        && customerRepository.findByPhone(phone).isPresent()) {
      throw new IllegalArgumentException("Ya existe un cliente con ese teléfono");
    }

    // 3. Crear entidad
    Customer customer = new Customer();
    customer.setName(name.trim());
    customer.setPhone(phone);
    customer.setEmail(email);
    customer.setAddress(address);
    customer.setCreditLimit(creditLimit);

    // 4. Guardar y retornar
    return customerRepository.save(customer);
  }

  // UPDATE
  public Customer update(
      final Long id,
      final String name,
      final String phone,
      final String email,
      final String address,
      final BigDecimal creditLimit) {
    // 1. Buscar existente
    Customer existing =
        customerRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

    // 2. Validación de nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // 3. Validación de teléfono duplicado (si cambió)
    if (phone != null && !phone.isBlank()) {
      var byPhone = customerRepository.findByPhone(phone);
      if (byPhone.isPresent() && !byPhone.get().getId().equals(existing.getId())) {
        throw new IllegalArgumentException("Ya existe un cliente con ese teléfono");
      }
    }

    // 4. Actualizar
    existing.setName(name.trim());
    existing.setPhone(phone);
    existing.setEmail(email);
    existing.setAddress(address);
    existing.setCreditLimit(creditLimit);

    // 5. Guardar y retornar
    return customerRepository.save(existing);
  }

  // DELETE
  public void delete(final Long id) {
    // 1. Buscar existente
    Customer existing =
        customerRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

    // 2. Validar relaciones (ventas asociadas)
    if (existing.getSales() != null && !existing.getSales().isEmpty()) {
      throw new IllegalArgumentException(
          "No se puede eliminar el cliente porque tiene ventas asociadas");
    }

    // 3. Eliminar
    customerRepository.delete(existing);
  }

  // REGISTER PAYMENT (Cobro de deuda)
  @Transactional
  public Customer registerPayment(final Long customerId, final BigDecimal amount, final String note) {
    // 1. Validaciones de monto
    if (amount == null) {
      throw new IllegalArgumentException("El monto es obligatorio");
    }
    if (amount.compareTo(BigDecimal.ZERO) <= 0) {
      throw new IllegalArgumentException("El monto debe ser mayor a 0");
    }

    // 2. Buscar cliente
    Customer customer =
        customerRepository
            .findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

    // 3. Validar que el monto no exceda la deuda actual
    BigDecimal currentDebt =
        customer.getCurrentDebt() != null ? customer.getCurrentDebt() : BigDecimal.ZERO;
    if (amount.compareTo(currentDebt) > 0) {
      throw new IllegalArgumentException("El monto excede la deuda actual");
    }

    // 4. Actualizar deuda del cliente
    customer.setCurrentDebt(currentDebt.subtract(amount));
    Customer savedCustomer = customerRepository.save(customer);

    // 5. Registrar el pago
    CustomerPayment payment =
        CustomerPayment.builder()
            .customer(savedCustomer)
            .amount(amount)
            .note(note)
            .build();
    paymentRepository.save(payment);

    return savedCustomer;
  }

  // GET PAYMENTS (Historial de pagos)
  public List<CustomerPayment> getPayments(final Long customerId) {
    // 1. Verificar que el cliente existe
    if (!customerRepository.existsById(customerId)) {
      throw new IllegalArgumentException("Cliente no encontrado");
    }

    // 2. Retornar historial de pagos ordenado por fecha descendente
    return paymentRepository.findByCustomerIdOrderByPaidAtDesc(customerId);
  }
}
