package com.kiosk.pos.controller.category;

import com.kiosk.pos.dto.response.CategoryDto;
import com.kiosk.pos.service.CategoryService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Devuelve todas las categorías disponibles.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class GetAllCategoriesController {

  private final CategoryService categoryService;

  public GetAllCategoriesController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public List<CategoryDto> todas() {
    return categoryService.getAllCategories().stream()
        .map(c -> new CategoryDto(c.getId(), c.getName(), c.getDescription()))
        .toList();
  }
}
