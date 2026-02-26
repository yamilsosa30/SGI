package com.kiosk.pos.controller.category;

import com.kiosk.pos.service.CategoryService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Borra una categoría. No se puede borrar si tiene productos asociados.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class DeleteCategoryController {

  private final CategoryService categoryService;

  public DeleteCategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> borrar(@PathVariable Long id) {
    try {
      categoryService.deleteCategory(id);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
      HttpStatus status = e.getMessage().contains("tiene productos") 
          ? HttpStatus.CONFLICT 
          : HttpStatus.NOT_FOUND;
      return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
  }
}
