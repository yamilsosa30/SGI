package com.kiosk.pos.controller.category;

import com.kiosk.pos.dto.request.CategoryCreateUpdateDto;
import com.kiosk.pos.dto.response.CategoryDto;
import com.kiosk.pos.service.CategoryService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Modifica los datos de una categoría existente.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class UpdateCategoryController {

  private final CategoryService categoryService;

  public UpdateCategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody CategoryCreateUpdateDto dto) {
    try {
      var guardada = categoryService.updateCategory(id, dto.name(), dto.description());
      return ResponseEntity.ok(new CategoryDto(guardada.getId(), guardada.getName(), guardada.getDescription()));
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("Ya existe") 
          ? HttpStatus.CONFLICT 
          : e.getMessage().contains("no encontrada") 
              ? HttpStatus.NOT_FOUND 
              : HttpStatus.BAD_REQUEST;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
