package com.kiosk.pos.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class PurchaseItemRequest {
  private Long productId;

  @JsonProperty("qty")
  @JsonAlias({"quantity"})
  private Integer quantity;

  private BigDecimal cost;
}
