package com.kiosk.pos.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class PurchaseRequest {
  private Long supplierId;
  private List<PurchaseItemRequest> items;
}
