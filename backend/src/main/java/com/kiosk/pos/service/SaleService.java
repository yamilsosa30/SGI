package com.kiosk.pos.service;

import com.kiosk.pos.dto.request.SaleItemRequest;
import com.kiosk.pos.dto.request.SaleRequest;
import com.kiosk.pos.model.Sale;
import com.kiosk.pos.model.SaleItem;
import com.kiosk.pos.repository.CustomerRepository;
import com.kiosk.pos.repository.ProductRepository;
import com.kiosk.pos.repository.SaleRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SaleService {

  private final SaleRepository saleRepository;

  private final ProductRepository productRepository;

  private final CustomerRepository customerRepository;

  private final ProductService productService;

  @Transactional
  public Sale processSale(SaleRequest saleRequest) {
    Sale sale = new Sale();
    sale.setPaymentMethod(saleRequest.getPaymentMethod());
    sale.setIsCredit(saleRequest.getIsCredit());

    // Asociar cliente si se envía y validar fiado
    if (saleRequest.getCustomerId() != null) {
      customerRepository.findById(saleRequest.getCustomerId()).ifPresent(sale::setCustomer);
    }

    boolean isCredit = saleRequest.getIsCredit();
    if (isCredit && sale.getCustomer() == null) {
      throw new IllegalArgumentException("Venta a crédito requiere cliente");
    }

    List<SaleItem> saleItems = new ArrayList<>();

    for (SaleItemRequest itemRequest : saleRequest.getItems()) {
      productRepository
          .findById(itemRequest.getProductId())
          .ifPresent(
              product -> {
                // Determinar si el producto se vende por peso (autoridad del servidor)
                boolean soldByWeight = productService.isSoldByWeight(product);

                SaleItem saleItem =
                    SaleItem.builder()
                        .sale(sale)
                        .product(product)
                        .quantity(itemRequest.getQuantity())
                        .unitPrice(itemRequest.getUnitPrice())
                        .build();
                saleItems.add(saleItem);

                // Actualizar stock según si es producto por peso o no
                if (soldByWeight) {
                  // Stock y descuento en kg con 3 decimales
                  BigDecimal currentStockKg =
                      product.getStock() != null ? product.getStock() : BigDecimal.ZERO;
                  BigDecimal soldKg =
                      BigDecimal.valueOf(itemRequest.getQuantity())
                          .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
                  BigDecimal newStockKg =
                      currentStockKg.subtract(soldKg).setScale(2, RoundingMode.HALF_UP);
                  product.setStock(newStockKg);
                  productRepository.save(product);
                } else {
                  // Para productos normales, actualizar stock normalmente
                  productService.updateStock(product.getId(), itemRequest.getQuantity());
                }

                // Calcular y asignar el subtotal del ítem considerando venta por peso
                if (soldByWeight) {
                  // gramos a kilos con 2 decimales
                  BigDecimal weightInKg =
                      BigDecimal.valueOf(itemRequest.getQuantity())
                          .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
                  BigDecimal subtotal =
                      itemRequest
                          .getUnitPrice()
                          .multiply(weightInKg)
                          .setScale(2, RoundingMode.HALF_UP);
                  saleItem.setSubtotal(subtotal);
                } else {
                  BigDecimal subtotal =
                      itemRequest
                          .getUnitPrice()
                          .multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
                          .setScale(2, RoundingMode.HALF_UP);
                  saleItem.setSubtotal(subtotal);
                }
              });
    }

    sale.setItems(saleItems);

    // Total de la venta basado en los subtotales asignados a los ítems
    BigDecimal calculatedTotal =
        saleItems.stream().map(SaleItem::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    sale.setTotal(calculatedTotal.setScale(2, RoundingMode.HALF_UP));

    // Si es fiado, actualizar deuda del cliente con validación de límite
    if (isCredit) {
      var customer = sale.getCustomer();
      var currentDebt =
          customer.getCurrentDebt() != null ? customer.getCurrentDebt() : BigDecimal.ZERO;
      var creditLimit = customer.getCreditLimit();
      var newDebt = currentDebt.add(sale.getTotal() != null ? sale.getTotal() : BigDecimal.ZERO);
      if (creditLimit != null
          && creditLimit.compareTo(BigDecimal.ZERO) > 0
          && newDebt.compareTo(creditLimit) > 0) {
        throw new IllegalArgumentException("El monto supera el límite de crédito del cliente");
      }
      customer.setCurrentDebt(newDebt);
      customerRepository.save(customer);
    }

    return saleRepository.save(sale);
  }

  public List<Sale> getAllSales() {
    return saleRepository.findAll();
  }

  public List<Sale> getTodaySales() {
    LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
    LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
    return saleRepository.findBySaleDateBetween(startOfDay, endOfDay);
  }

  public BigDecimal getTodayTotal() {
    LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
    LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
    BigDecimal total = saleRepository.getTotalSalesBetween(startOfDay, endOfDay);
    return total != null ? total : BigDecimal.ZERO;
  }

  public Long getTodayTransactionCount() {
    LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
    LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
    return saleRepository.getTransactionCountBetween(startOfDay, endOfDay);
  }

  public List<Sale> getCreditSales() {
    return saleRepository.findByIsCreditTrue();
  }

  public List<Sale> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {
    LocalDateTime start = startDate.atStartOfDay();
    LocalDateTime end = endDate.atTime(LocalTime.MAX);
    return saleRepository.findBySaleDateBetween(start, end);
  }

  @Transactional
  public void deleteSale(Long saleId) {
    var saleOpt = saleRepository.findById(saleId);
    if (saleOpt.isEmpty()) {
      throw new IllegalArgumentException("Venta no encontrada");
    }
    var sale = saleOpt.get();
    // Revertir stock
    if (sale.getItems() != null) {
      for (SaleItem it : sale.getItems()) {
        var product = it.getProduct();
        if (product == null) continue;
        boolean byWeight = productService.isSoldByWeight(product);
        if (byWeight) {
          BigDecimal kg =
              BigDecimal.valueOf(it.getQuantity())
                  .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
          BigDecimal current = product.getStock() != null ? product.getStock() : BigDecimal.ZERO;
          product.setStock(current.add(kg).setScale(2, RoundingMode.HALF_UP));
          productRepository.save(product);
        } else {
          productService.increaseStock(product.getId(), it.getQuantity());
        }
      }
    }
    // Revertir deuda si fue a crédito
    if (Boolean.TRUE.equals(sale.getIsCredit()) && sale.getCustomer() != null) {
      var c = sale.getCustomer();
      var currentDebt = c.getCurrentDebt() != null ? c.getCurrentDebt() : BigDecimal.ZERO;
      var total = sale.getTotal() != null ? sale.getTotal() : BigDecimal.ZERO;
      var newDebt = currentDebt.subtract(total);
      if (newDebt.compareTo(BigDecimal.ZERO) < 0) newDebt = BigDecimal.ZERO;
      c.setCurrentDebt(newDebt);
      customerRepository.save(c);
    }
    // Eliminar venta (items en cascade)
    saleRepository.delete(sale);
  }
}
