package com.kiosk.pos.service;

import com.kiosk.pos.model.Supplier;
import com.kiosk.pos.repository.SupplierRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupplierService {

  private final SupplierRepository supplierRepository;

  // GET ALL
  public List<Supplier> getAll() {
    return supplierRepository.findAll();
  }

  // GET BY ID
  public Optional<Supplier> getById(final Long id) {
    return supplierRepository.findById(id);
  }

  // CREATE
  public Supplier create(
      final String name, final String phone, final String email, final String address) {
    // 1. Validación de nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // 2. Validación de nombre duplicado
    if (supplierRepository.findByName(name).isPresent()) {
      throw new IllegalArgumentException("Ya existe un proveedor con ese nombre");
    }

    // 3. Crear entidad
    Supplier supplier = new Supplier();
    supplier.setName(name.trim());
    supplier.setPhone(phone);
    supplier.setEmail(email);
    supplier.setAddress(address);

    // 4. Guardar y retornar
    return supplierRepository.save(supplier);
  }

  // UPDATE
  public Supplier update(
      final Long id, final String name, final String phone, final String email, final String address) {
    // 1. Buscar existente
    Supplier existing =
        supplierRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado"));

    // 2. Validación de nombre obligatorio
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("El nombre es obligatorio");
    }

    // 3. Validación de nombre duplicado (si cambió)
    if (!existing.getName().equals(name) && supplierRepository.findByName(name).isPresent()) {
      throw new IllegalArgumentException("Ya existe un proveedor con ese nombre");
    }

    // 4. Actualizar
    existing.setName(name.trim());
    existing.setPhone(phone);
    existing.setEmail(email);
    existing.setAddress(address);

    // 5. Guardar y retornar
    return supplierRepository.save(existing);
  }

  // DELETE
  public void delete(final Long id) {
    // 1. Buscar existente
    Supplier existing =
        supplierRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado"));

    // 2. Eliminar (sin validaciones adicionales por ahora)
    supplierRepository.delete(existing);
  }
}
