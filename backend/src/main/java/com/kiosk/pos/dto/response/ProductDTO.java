package com.kiosk.pos.dto.response;

import com.kiosk.pos.model.Category;
import com.kiosk.pos.model.Product;
import com.kiosk.pos.service.ProductService;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para productos que incluye información adicional como si se vende por peso
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String barcode;
    private BigDecimal price;
    private BigDecimal stock;
    private BigDecimal minStock;
    private LocalDate expiryDate;
    private Category category;
    private Boolean active;
    private Boolean soldByWeight;

    /**
     * Convierte un Product a ProductDTO
     * @param product El producto a convertir
     * @param productService Servicio de productos para determinar si se vende por peso
     * @return El DTO con la información adicional
     */
    public static ProductDTO fromProduct(Product product, ProductService productService) {
        if (product == null) return null;
        
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .barcode(product.getBarcode())
                .price(product.getPrice())
                .stock(product.getStock())
                .minStock(product.getMinStock())
                .expiryDate(product.getExpiryDate())
                .category(product.getCategory())
                .active(product.getActive())
                .soldByWeight(productService.isSoldByWeight(product))
                .build();
    }
}
