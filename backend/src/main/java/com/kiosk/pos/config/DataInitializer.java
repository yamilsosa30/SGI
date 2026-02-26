package com.kiosk.pos.config;

import com.kiosk.pos.model.*;
import com.kiosk.pos.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

  private final CategoryRepository categoryRepository;
  private final ProductRepository productRepository;
  private final CustomerRepository customerRepository;

  @Override
  public void run(String... args) throws Exception {
    // Evitar duplicados si data.sql ya insertó datos
    if (categoryRepository.count() > 0
        || productRepository.count() > 0
        || customerRepository.count() > 0) {
      System.out.println(
          "ℹ️  DataInitializer: Datos existentes detectados. Se omite el sembrado inicial.");
      return;
    }
    // Crear categorías
    Category bebidas = new Category();
    bebidas.setName("Bebidas");
    bebidas.setDescription("Gaseosas, jugos y aguas");
    categoryRepository.save(bebidas);

    Category snacks = new Category();
    snacks.setName("Snacks");
    snacks.setDescription("Papas fritas, galletitas y golosinas");
    categoryRepository.save(snacks);

    Category cigarrillos = new Category();
    cigarrillos.setName("Cigarrillos");
    cigarrillos.setDescription("Productos de tabaco");
    categoryRepository.save(cigarrillos);

    // Crear productos de ejemplo
    Product cocaCola = new Product();
    cocaCola.setName("Coca Cola 500ml");
    cocaCola.setBarcode("7790895001234");
    cocaCola.setPrice(new BigDecimal("350.00"));
    cocaCola.setStock(new BigDecimal("50.00"));
    cocaCola.setMinStock(new BigDecimal("10.00"));
    cocaCola.setExpiryDate(LocalDate.now().plusMonths(6));
    cocaCola.setCategory(bebidas);
    productRepository.save(cocaCola);

    Product pepsi = new Product();
    pepsi.setName("Pepsi 500ml");
    pepsi.setBarcode("7790895001235");
    pepsi.setPrice(new BigDecimal("340.00"));
    pepsi.setStock(new BigDecimal("30.00"));
    pepsi.setMinStock(new BigDecimal("10.00"));
    pepsi.setExpiryDate(LocalDate.now().plusMonths(5));
    pepsi.setCategory(bebidas);
    productRepository.save(pepsi);

    Product agua = new Product();
    agua.setName("Agua Mineral 500ml");
    agua.setBarcode("7790895001236");
    agua.setPrice(new BigDecimal("200.00"));
    agua.setStock(new BigDecimal("100.00"));
    agua.setMinStock(new BigDecimal("20.00"));
    agua.setExpiryDate(LocalDate.now().plusYears(2));
    agua.setCategory(bebidas);
    productRepository.save(agua);

    Product papas = new Product();
    papas.setName("Papas Fritas Lays");
    papas.setBarcode("7790895002234");
    papas.setPrice(new BigDecimal("450.00"));
    papas.setStock(new BigDecimal("25.00"));
    papas.setMinStock(new BigDecimal("5.00"));
    papas.setExpiryDate(LocalDate.now().plusMonths(8));
    papas.setCategory(snacks);
    productRepository.save(papas);

    Product oreo = new Product();
    oreo.setName("Galletitas Oreo");
    oreo.setBarcode("7790895002235");
    oreo.setPrice(new BigDecimal("380.00"));
    oreo.setStock(new BigDecimal("15.00"));
    oreo.setMinStock(new BigDecimal("5.00"));
    oreo.setExpiryDate(LocalDate.now().plusMonths(10));
    oreo.setCategory(snacks);
    productRepository.save(oreo);

    // Producto con stock bajo para testing
    Product stockBajo = new Product();
    stockBajo.setName("Chicles Beldent");
    stockBajo.setBarcode("7790895002236");
    stockBajo.setPrice(new BigDecimal("150.00"));
    stockBajo.setStock(new BigDecimal("3.00")); // Stock bajo
    stockBajo.setMinStock(new BigDecimal("10.00"));
    stockBajo.setExpiryDate(LocalDate.now().plusMonths(12));
    stockBajo.setCategory(snacks);
    productRepository.save(stockBajo);

    // Producto próximo a vencer para testing
    Product proximoVencer = new Product();
    proximoVencer.setName("Yogur Vencimiento Próximo");
    proximoVencer.setBarcode("7790895002237");
    proximoVencer.setPrice(new BigDecimal("250.00"));
    proximoVencer.setStock(new BigDecimal("20.00"));
    proximoVencer.setMinStock(new BigDecimal("5.00"));
    proximoVencer.setExpiryDate(LocalDate.now().plusDays(5)); // Vence pronto
    proximoVencer.setCategory(bebidas);
    productRepository.save(proximoVencer);

    // Crear cliente por defecto
    Customer clienteGeneral = new Customer();
    clienteGeneral.setName("Cliente General");
    clienteGeneral.setEmail("general@kiosk.com");
    clienteGeneral.setPhone("000-000-0000");
    clienteGeneral.setAddress("Sin dirección");
    customerRepository.save(clienteGeneral);

    System.out.println("✅ Datos iniciales cargados correctamente:");
    System.out.println("   - 3 categorías creadas");
    System.out.println("   - 8 productos de ejemplo");
    System.out.println("   - 1 cliente por defecto");
    System.out.println("   - Productos con alertas para testing");
  }
}
