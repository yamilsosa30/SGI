package com.kiosk.pos.service;

import com.kiosk.pos.model.Product;
import com.kiosk.pos.repository.ProductRepository;
import com.kiosk.pos.util.Constants;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductRepository productRepository;

  // Lista para almacenar productos con stock negativo después de ventas
  private final List<Product> negativeStockProducts = new ArrayList<>();

  // Palabras a ignorar al armar el prefijo (conectores comunes)
  private static final String[] STOP_WORDS = {
    "DE", "DEL", "LA", "EL", "LOS", "LAS", "Y", "CON", "SIN", "POR", "PARA", "EN", "THE", "A", "AN",
    "AL", "UN", "UNA", "UNO"
  };

  public List<Product> getAllActiveProducts() {
    return productRepository.findByActiveTrue();
  }

  public Optional<Product> getProductById(Long id) {
    return productRepository.findById(id);
  }

  public Optional<Product> getProductByBarcode(String barcode) {
    return productRepository.findByBarcode(barcode);
  }

  public List<Product> searchProductsByName(String name) {
    return productRepository.findByNameContainingIgnoreCase(name);
  }

  public List<Product> getLowStockProducts() {
    return productRepository.findLowStockProducts();
  }

  public List<Product> getExpiringProducts() {
    LocalDate nextWeek = LocalDate.now().plusDays(7);
    return productRepository.findExpiringProducts(nextWeek);
  }

  public Product saveProduct(Product product) {
    // Si no se envía código de barras, lo generamos automáticamente (memorizable y único)
    if (product.getBarcode() == null || product.getBarcode().isBlank()) {
      product.setBarcode(generateUniqueBarcode(product.getName()));
    }
    // Normalizar escala a 2 decimales
    if (product.getStock() != null) {
      product.setStock(product.getStock().setScale(2, java.math.RoundingMode.HALF_UP));
    }
    if (product.getMinStock() != null) {
      product.setMinStock(product.getMinStock().setScale(2, java.math.RoundingMode.HALF_UP));
    }
    // Validación: si NO es por peso, el stock debe ser entero (sin decimales)
    boolean byWeight = isSoldByWeight(product);
    if (!byWeight) {
      if (product.getStock() != null && product.getStock().stripTrailingZeros().scale() > 0) {
        throw new IllegalArgumentException(
            "Para productos no 'Por peso', el stock debe ser entero");
      }
      if (product.getMinStock() != null && product.getMinStock().stripTrailingZeros().scale() > 0) {
        throw new IllegalArgumentException(
            "Para productos no 'Por peso', el stock mínimo debe ser entero");
      }
    }
    return productRepository.save(product);
  }

  public void deleteProduct(Long id) {
    productRepository
        .findById(id)
        .ifPresent(
            product -> {
              product.setActive(false);
              productRepository.save(product);
            });
  }

  public void updateStock(Long productId, Integer quantity) {
    productRepository
        .findById(productId)
        .ifPresent(
            product -> {
              BigDecimal current =
                  product.getStock() != null ? product.getStock() : BigDecimal.ZERO;
              BigDecimal delta = quantity != null ? BigDecimal.valueOf(quantity) : BigDecimal.ZERO;
              BigDecimal newStock = current.subtract(delta);
              product.setStock(newStock);

              // Verificar si el stock quedó negativo y registrarlo para alertas
              if (newStock.compareTo(BigDecimal.ZERO) < 0) {
                if (!negativeStockProducts.contains(product)) {
                  negativeStockProducts.add(product);
                }
              }

              productRepository.save(product);
            });
  }

  public void increaseStock(Long productId, Integer quantity) {
    productRepository
        .findById(productId)
        .ifPresent(
            product -> {
              BigDecimal current =
                  product.getStock() != null ? product.getStock() : BigDecimal.ZERO;
              BigDecimal inc = quantity != null ? BigDecimal.valueOf(quantity) : BigDecimal.ZERO;
              product.setStock(current.add(inc));
              productRepository.save(product);
            });
  }

  /**
   * Genera un código de barras único y secuencial basado en el nombre. Formato: PREFIX-NNN (NNN con
   * ceros a la izquierda). Si NNN supera 999, usa 4 dígitos y así sucesivamente. Ejemplos: COC-001,
   * COC-002, COCL-001, COCLZ-001
   */
  private String generateUniqueBarcode(String productName) {
    String prefix = buildNamePrefix(productName);
    String prefixWithHyphen = prefix + "-";
    List<String> existing = productRepository.findBarcodesStartingWith(prefixWithHyphen);
    int next = 1;
    for (String bc : existing) {
      if (bc == null) continue;
      if (!bc.startsWith(prefixWithHyphen)) continue;
      String suffix = bc.substring(prefixWithHyphen.length());
      if (suffix.matches("\\d+")) {
        try {
          int val = Integer.parseInt(suffix);
          if (val >= next) next = val + 1;
        } catch (NumberFormatException ignored) {
        }
      }
    }
    return prefixWithHyphen + formatSequence(next);
  }

  // Construye un prefijo memorizable:
  // - Primer token: hasta 3 letras (ignora números), p.ej. COCA -> COC
  // - Tokens siguientes: 1 letra inicial de cada uno (si no es conector y tiene letras), p.ej.
  // LITRO -> L, ZERO -> Z
  // - Ignora conectores y tokens sin letras (p.ej., "750cc")
  // - Máximo 6 caracteres
  private String buildNamePrefix(String name) {
    if (name == null || name.isBlank()) return "PRD";
    String norm =
        Normalizer.normalize(name, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .replaceAll("[^A-Za-z0-9 ]", " ")
            .toUpperCase()
            .trim();
    if (norm.isBlank()) return "PRD";
    String[] tokens = norm.split("\\s+");
    StringBuilder prefix = new StringBuilder();

    // tomar primer token con letras
    int idx = 0;
    while (idx < tokens.length && lettersOnly(tokens[idx]).isEmpty()) idx++;
    if (idx < tokens.length) {
      String first = lettersOnly(tokens[idx]);
      prefix.append(first.substring(0, Math.min(3, first.length())));
      idx++;
    }
    // tokens siguientes: agregar 1 letra inicial si no es stopword, no contiene dígitos y tiene
    // letras
    for (; idx < tokens.length && prefix.length() < 6; idx++) {
      String t = tokens[idx];
      if (t.matches(".*\\d.*")) continue; // ignorar tokens con números (p.ej., 750cc)
      String letters = lettersOnly(t);
      if (letters.isEmpty()) continue;
      if (isStopWord(letters)) continue;
      prefix.append(letters.charAt(0));
    }
    if (prefix.length() == 0) return "PRD";
    if (prefix.length() > 6) return prefix.substring(0, 6);
    return prefix.toString();
  }

  private String formatSequence(int seq) {
    if (seq < 1000) return String.format("%03d", seq);
    if (seq < 10000) return String.format("%04d", seq);
    if (seq < 100000) return String.format("%05d", seq);
    return String.valueOf(seq);
  }

  private boolean isStopWord(String tokenUpperLetters) {
    for (String s : STOP_WORDS) {
      if (s.equals(tokenUpperLetters)) return true;
    }
    return false;
  }

  private String lettersOnly(String s) {
    if (s == null) return "";
    return s.replaceAll("[^A-Z]", "");
  }

  /**
   * Verifica si un producto se vende por peso (pertenece a la categoría "Por peso")
   *
   * @param product El producto a verificar
   * @return true si el producto se vende por peso, false en caso contrario
   */
  public boolean isSoldByWeight(Product product) {
    if (product == null || product.getCategory() == null) {
      return false;
    }
    return Constants.Categories.WEIGHT_CATEGORY_NAME.equals(product.getCategory().getName());
  }

  public List<Product> getNegativeStockProducts() {
    return new ArrayList<>(negativeStockProducts);
  }

  public void clearNegativeStockProduct(Long productId) {
    negativeStockProducts.removeIf(p -> p.getId().equals(productId));
  }
}
