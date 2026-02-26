package com.kiosk.pos.controller.dashboard;

import com.kiosk.pos.dto.response.AlertDTO;
import com.kiosk.pos.model.Product;
import com.kiosk.pos.service.ProductService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetDashboardAlertsController {

  private final ProductService productService;

  public GetDashboardAlertsController(final ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/alerts")
  public List<AlertDTO> execute() {
    List<AlertDTO> list = new ArrayList<>();

    // Stock bajo
    for (Product p : productService.getLowStockProducts()) {
      String msg =
          p.getName()
              + " - Stock bajo ("
              + p.getStock()
              + "/min "
              + (p.getMinStock() == null ? 0 : p.getMinStock())
              + ")";
      list.add(new AlertDTO(p.getId(), "LOW_STOCK", msg, "high", p.getId()));
    }

    // Por vencer
    for (Product p : productService.getExpiringProducts()) {
      String msg = p.getName() + " - Vence pronto";
      list.add(new AlertDTO(p.getId(), "NEAR_EXPIRY", msg, "medium", p.getId()));
    }

    // Stock negativo (requiere actualización)
    for (Product p : productService.getNegativeStockProducts()) {
      String msg = p.getName() + " - Stock negativo (" + p.getStock() + "). Actualizar inventario.";
      list.add(new AlertDTO(p.getId(), "NEGATIVE_STOCK", msg, "high", p.getId()));
    }

    return list;
  }
}
