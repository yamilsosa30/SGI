package com.kiosk.pos.dto.request;

import com.kiosk.pos.model.PaymentMethod;
import java.math.BigDecimal;
import java.util.List;

public class SaleRequest {
  private List<SaleItemRequest> items;
  private PaymentMethod paymentMethod;
  private Long customerId;
  private Boolean isCredit;
  private BigDecimal total;

  // Constructors
  public SaleRequest() {}

  // Getters and Setters
  public List<SaleItemRequest> getItems() {
    return items;
  }

  public void setItems(List<SaleItemRequest> items) {
    this.items = items;
  }

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public Boolean getIsCredit() {
    return isCredit;
  }

  public void setIsCredit(Boolean isCredit) {
    this.isCredit = isCredit;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }
}
