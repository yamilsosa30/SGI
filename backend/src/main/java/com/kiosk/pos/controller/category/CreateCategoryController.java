package com.kiosk.pos.controller.category;

import com.kiosk.pos.dto.request.CategoryCreateUpdateDto;
import com.kiosk.pos.dto.response.CategoryDto;
import com.kiosk.pos.service.CategoryService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Crea una nueva categoría para organizar productos.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class CreateCategoryController {

  private final CategoryService categoryService;

  public CreateCategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PostMapping
  public ResponseEntity<?> nueva(@RequestBody CategoryCreateUpdateDto dto) {
    try {
      var guardada = categoryService.createCategory(dto.name(), dto.description());
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(new CategoryDto(guardada.getId(), guardada.getName(), guardada.getDescription()));
    } catch (IllegalArgumentException e) {
      // Si ya existe, devolvemos 409 en lugar de 400
      HttpStatus status = e.getMessage().contains("Ya existe") ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
