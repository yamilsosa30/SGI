package com.kiosk.pos.service;

import com.kiosk.pos.model.Category;
import com.kiosk.pos.repository.CategoryRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  public Optional<Category> getCategoryById(final Long id) {
    return categoryRepository.findById(id);
  }

  public Category createCategory(final String name, final String description) {
    // Validar nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // Validar duplicado
    if (categoryRepository.findByName(name).isPresent()) {
      throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
    }

    Category category = new Category();
    category.setName(name.trim());
    category.setDescription(description);

    return categoryRepository.save(category);
  }

  public Category updateCategory(final Long id, final String name, final String description) {
    // Buscar categoría existente
    Category existing =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

    // Validar nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // Si cambia el nombre, validar duplicado
    if (!existing.getName().equals(name) && categoryRepository.findByName(name).isPresent()) {
      throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
    }

    existing.setName(name.trim());
    existing.setDescription(description);

    return categoryRepository.save(existing);
  }

  public void deleteCategory(final Long id) {
    Category existing =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

    // Validar que no tenga productos asociados
    if (existing.getProducts() != null && !existing.getProducts().isEmpty()) {
      throw new IllegalArgumentException(
          "No se puede eliminar la categoría porque tiene productos asociados");
    }

    categoryRepository.delete(existing);
  }
}
