package com.kiosk.pos.model;

public enum PaymentMethod {
  CASH("Efectivo"),
  CARD_DEBIT("Tarjeta Débito"),
  CARD_CREDIT("Tarjeta Crédito"),
  TRANSFER("Transferencia"),
  FIADO("Fiado");

  private final String displayName;

  PaymentMethod(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}
