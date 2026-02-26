package com.kiosk.pos.controller.category;

import com.kiosk.pos.dto.response.CategoryDto;
import com.kiosk.pos.service.CategoryService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Busca una categoría por su ID.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetCategoryByIdController {

  private final CategoryService categoryService;

  public GetCategoryByIdController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> porId(@PathVariable Long id) {
    return categoryService.getCategoryById(id)
        .<ResponseEntity<?>>map(c -> ResponseEntity.ok(new CategoryDto(c.getId(), c.getName(), c.getDescription())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "No encontré la categoría " + id)));
  }
}
