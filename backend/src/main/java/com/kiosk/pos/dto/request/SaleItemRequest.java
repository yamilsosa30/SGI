package com.kiosk.pos.dto.request;

import java.math.BigDecimal;

public class SaleItemRequest {
  private Long productId;
  private Integer quantity;
  private BigDecimal unitPrice;
  private Boolean soldByWeight;
  private BigDecimal interestRate;

  // Constructors
  public SaleItemRequest() {}

  // Getters and Setters
  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
  }

  public Boolean getSoldByWeight() {
    return soldByWeight;
  }

  public void setSoldByWeight(Boolean soldByWeight) {
    this.soldByWeight = soldByWeight;
  }

  public BigDecimal getInterestRate() {
    return interestRate;
  }

  public void setInterestRate(BigDecimal interestRate) {
    this.interestRate = interestRate;
  }

  /**
   * Obtiene la cantidad efectiva para el cálculo del precio. Si el producto se vende por peso,
   * convierte los gramos a kilos.
   *
   * @return La cantidad efectiva para el cálculo del precio
   */
  public BigDecimal getEffectiveQuantity() {
    if (Boolean.TRUE.equals(soldByWeight)) {
      // Convertir gramos a kilos (dividir por 1000)
      return BigDecimal.valueOf(quantity).divide(BigDecimal.valueOf(1000));
    } else {
      return BigDecimal.valueOf(quantity);
    }
  }

  /**
   * Calcula el subtotal del item.
   *
   * @return El subtotal del item
   */
  public BigDecimal calculateSubtotal() {
    return unitPrice.multiply(getEffectiveQuantity());
  }
}
