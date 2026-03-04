package com.kiosk.pos.service;

import com.kiosk.pos.dto.SummaryPeriod;
import com.kiosk.pos.dto.response.CashflowSummaryRow;
import com.kiosk.pos.dto.response.ProfitSummaryRow;
import com.kiosk.pos.dto.response.SalesSummaryRow;
import com.kiosk.pos.dto.response.TopProductDTO;
import com.kiosk.pos.model.Purchase;
import com.kiosk.pos.model.PurchaseItem;
import com.kiosk.pos.model.PurchaseStatus;
import com.kiosk.pos.model.Sale;
import com.kiosk.pos.model.SaleItem;
import com.kiosk.pos.repository.PurchaseItemRepository;
import com.kiosk.pos.repository.PurchaseRepository;
import com.kiosk.pos.repository.SaleItemRepository;
import com.kiosk.pos.repository.SaleRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.WeekFields;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

  private final SaleItemRepository saleItemRepository;
  private final SaleRepository saleRepository;
  private final PurchaseItemRepository purchaseItemRepository;
  private final PurchaseRepository purchaseRepository;

  // ============================================================================
  // REPORTE: Productos Más Vendidos
  // ============================================================================

  /**
   * Obtiene los productos más vendidos en un período.
   * @param startDate Fecha de inicio (si es null, usa últimos 30 días)
   * @param endDate Fecha de fin (si es null, usa hoy)
   * @param limit Cantidad máxima de productos a retornar (0 = sin límite)
   * @return Lista de productos con cantidad vendida y revenue total
   */
  public List<TopProductDTO> getTopProducts(LocalDate startDate, LocalDate endDate, int limit) {
    LocalDate s = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
    LocalDate e = (endDate != null) ? endDate : LocalDate.now();
    LocalDateTime start = s.atStartOfDay();
    LocalDateTime end = e.atTime(LocalTime.MAX);

    List<Object[]> rows = saleItemRepository.aggregateTopProducts(start, end);
    List<TopProductDTO> list = new ArrayList<>();
    for (Object[] r : rows) {
      Long productId = (Long) r[0];
      String name = (String) r[1];
      Long qty = (r[2] instanceof Long) ? (Long) r[2] : ((Number) r[2]).longValue();
      BigDecimal revenue = (BigDecimal) r[3];
      list.add(new TopProductDTO(productId, name, qty, revenue));
    }
    if (limit > 0 && list.size() > limit) {
      return list.subList(0, limit);
    }
    return list;
  }

  // ============================================================================
  // REPORTE: Resumen de Ventas
  // ============================================================================

  /**
   * Genera reporte de ventas agrupado por período.
   * @param period Tipo de período (DAILY, WEEKLY, MONTHLY, YEARLY)
   * @param from Fecha inicio
   * @param to Fecha fin
   * @return Lista de ventas por período
   */
  public List<SalesSummaryRow> getSalesSummary(SummaryPeriod period, LocalDate from, LocalDate to) {
    if (period == null) period = SummaryPeriod.DAILY;
    // Rango por defecto según período
    LocalDate end = (to != null) ? to : LocalDate.now();
    LocalDate start;
    switch (period) {
      case WEEKLY -> start = (from != null) ? from : end.minusWeeks(7);
      case MONTHLY -> start = (from != null) ? from : end.minusMonths(12);
      case YEARLY -> start = (from != null) ? from : end.minusYears(5);
      default -> start = (from != null) ? from : end.minusDays(7);
    }

    // Normalizar start <= end
    if (start.isAfter(end)) {
      LocalDate tmp = start;
      start = end;
      end = tmp;
    }

    // Construir buckets
    List<SalesSummaryRow> rows = new ArrayList<>();
    List<Bucket> buckets = buildBuckets(period, start, end);

    // Cargar ventas del rango una sola vez
    List<Sale> sales =
        saleRepository.findBySaleDateBetween(start.atStartOfDay(), end.atTime(LocalTime.MAX));

    // Sumar por bucket
    Map<Bucket, BucketAgg> agg = new LinkedHashMap<>();
    for (Bucket b : buckets) agg.put(b, new BucketAgg());
    for (Sale s : sales) {
      LocalDate d = s.getSaleDate().toLocalDate();
      for (Bucket b : buckets) {
        if ((d.isEqual(b.start) || d.isAfter(b.start)) && (d.isEqual(b.end) || d.isBefore(b.end))) {
          BucketAgg a = agg.get(b);
          a.transactions++;
          a.total = a.total.add(s.getTotal() == null ? BigDecimal.ZERO : s.getTotal());
          break;
        }
      }
    }

    // Convertir a DTO ordenado
    for (Bucket b : buckets) {
      BucketAgg a = agg.get(b);
      rows.add(
          new SalesSummaryRow(
              b.label, b.start, b.end, a.transactions, a.total.setScale(2, RoundingMode.HALF_UP)));
    }
    return rows;
  }

  /**
   * Genera PDF del reporte de ventas.
   */
  public byte[] generateSalesSummaryPdf(SummaryPeriod period, LocalDate from, LocalDate to) {
    List<SalesSummaryRow> summary = getSalesSummary(period, from, to);

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    Document document = new Document(PageSize.A4.rotate());
    try {
      PdfWriter.getInstance(document, baos);
      document.open();

      String title =
          switch (period) {
            case WEEKLY -> "Reporte de Ventas - Semanal";
            case MONTHLY -> "Reporte de Ventas - Mensual";
            case YEARLY -> "Reporte de Ventas - Anual";
            default -> "Reporte de Ventas - Diario";
          };

      Paragraph pTitle = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
      pTitle.setAlignment(Element.ALIGN_LEFT);
      document.add(pTitle);

      String rangeText =
          String.format(
              "Rango: %s a %s",
              (from != null ? from : summary.isEmpty() ? "-" : summary.get(0).startDate()),
              (to != null
                  ? to
                  : summary.isEmpty() ? "-" : summary.get(summary.size() - 1).endDate()));
      Paragraph pRange = new Paragraph(rangeText, FontFactory.getFont(FontFactory.HELVETICA, 10));
      pRange.setSpacingAfter(10f);
      document.add(pRange);

      PdfPTable table = new PdfPTable(5);
      table.setWidthPercentage(100);
      table.setWidths(new float[] {3f, 2.5f, 2.5f, 2f, 2.5f});

      addHeaderCell(table, "Período");
      addHeaderCell(table, "Desde");
      addHeaderCell(table, "Hasta");
      addHeaderCell(table, "Transacciones");
      addHeaderCell(table, "Total");

      long totalTx = 0;
      BigDecimal totalAmt = BigDecimal.ZERO;
      for (SalesSummaryRow r : summary) {
        table.addCell(r.label());
        table.addCell(String.valueOf(r.startDate()));
        table.addCell(String.valueOf(r.endDate()));
        table.addCell(String.valueOf(r.transactions()));
        table.addCell("$" + r.total());
        totalTx += r.transactions();
        totalAmt = totalAmt.add(r.total());
      }

      // Totales
      PdfPCell totalLabel = new PdfPCell(new Phrase("Totales"));
      totalLabel.setColspan(3);
      table.addCell(totalLabel);
      table.addCell(String.valueOf(totalTx));
      table.addCell("$" + totalAmt.setScale(2, RoundingMode.HALF_UP));

      document.add(table);
    } catch (Exception ex) {
      throw new RuntimeException("No se pudo generar PDF", ex);
    } finally {
      document.close();
    }
    return baos.toByteArray();
  }

  // ============================================================================
  // REPORTE: Cashflow (Compras vs Ventas)
  // ============================================================================

  /**
   * Genera reporte de flujo de caja: compras (egresos) vs ventas (ingresos).
   * @param period Tipo de período
   * @param from Fecha inicio
   * @param to Fecha fin
   * @return Lista con compras, ventas y diferencia por período
   */
  public List<CashflowSummaryRow> getCashflowSummary(
      SummaryPeriod period, LocalDate from, LocalDate to) {
    if (period == null) period = SummaryPeriod.DAILY;
    LocalDate end = (to != null) ? to : LocalDate.now();
    LocalDate start;
    switch (period) {
      case WEEKLY -> start = (from != null) ? from : end.minusWeeks(7);
      case MONTHLY -> start = (from != null) ? from : end.minusMonths(12);
      case YEARLY -> start = (from != null) ? from : end.minusYears(5);
      default -> start = (from != null) ? from : end.minusDays(30);
    }
    if (start.isAfter(end)) {
      LocalDate tmp = start;
      start = end;
      end = tmp;
    }

    List<Bucket> buckets = buildBuckets(period, start, end);
    // Estructuras de acumulación
    Map<Bucket, BigDecimal> purchaseTotals = new LinkedHashMap<>();
    Map<Bucket, BigDecimal> salesTotals = new LinkedHashMap<>();
    for (Bucket b : buckets) {
      purchaseTotals.put(b, BigDecimal.ZERO);
      salesTotals.put(b, BigDecimal.ZERO);
    }

    // Obtener ventas y compras del rango
    LocalDateTime startDT = start.atStartOfDay();
    LocalDateTime endDT = end.atTime(LocalTime.MAX);
    List<Sale> sales = saleRepository.findBySaleDateBetween(startDT, endDT);
    List<Purchase> purchases =
        purchaseRepository.findByStatusAndCreatedAtBetween(
            PurchaseStatus.COMPLETED, startDT, endDT);

    // Bucketear ventas (ingresos)
    for (Sale s : sales) {
      if (s.getSaleDate() == null || s.getTotal() == null) continue;
      LocalDate d = s.getSaleDate().toLocalDate();
      for (Bucket b : buckets) {
        if ((d.isEqual(b.start) || d.isAfter(b.start)) && (d.isEqual(b.end) || d.isBefore(b.end))) {
          salesTotals.put(b, salesTotals.get(b).add(s.getTotal()));
          break;
        }
      }
    }

    // Bucketear compras (egresos)
    for (Purchase p : purchases) {
      LocalDateTime t = p.getCreatedAt();
      if (t == null) continue;
      LocalDate d = t.toLocalDate();
      BigDecimal cost = p.getTotalCost() != null ? p.getTotalCost() : BigDecimal.ZERO;
      for (Bucket b : buckets) {
        if ((d.isEqual(b.start) || d.isAfter(b.start)) && (d.isEqual(b.end) || d.isBefore(b.end))) {
          purchaseTotals.put(b, purchaseTotals.get(b).add(cost));
          break;
        }
      }
    }

    List<CashflowSummaryRow> out = new ArrayList<>();
    for (Bucket b : buckets) {
      BigDecimal buy = purchaseTotals.get(b).setScale(2, RoundingMode.HALF_UP);
      BigDecimal sell = salesTotals.get(b).setScale(2, RoundingMode.HALF_UP);
      BigDecimal net = sell.subtract(buy).setScale(2, RoundingMode.HALF_UP);
      out.add(new CashflowSummaryRow(b.label, b.start, b.end, buy, sell, net));
    }
    return out;
  }

  /**
   * Genera PDF del reporte de cashflow.
   */
  public byte[] generateCashflowSummaryPdf(SummaryPeriod period, LocalDate from, LocalDate to) {
    List<CashflowSummaryRow> summary = getCashflowSummary(period, from, to);
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    Document document = new Document(PageSize.A4.rotate());
    try {
      PdfWriter.getInstance(document, baos);
      document.open();

      String title =
          switch (period) {
            case WEEKLY -> "Cashflow Compras vs Ventas - Semanal";
            case MONTHLY -> "Cashflow Compras vs Ventas - Mensual";
            case YEARLY -> "Cashflow Compras vs Ventas - Anual";
            default -> "Cashflow Compras vs Ventas - Diario";
          };

      Paragraph pTitle = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
      pTitle.setAlignment(Element.ALIGN_LEFT);
      document.add(pTitle);

      String rangeText =
          String.format(
              "Rango: %s a %s",
              (from != null ? from : summary.isEmpty() ? "-" : summary.get(0).startDate()),
              (to != null
                  ? to
                  : summary.isEmpty() ? "-" : summary.get(summary.size() - 1).endDate()));
      Paragraph pRange = new Paragraph(rangeText, FontFactory.getFont(FontFactory.HELVETICA, 10));
      pRange.setSpacingAfter(10f);
      document.add(pRange);

      PdfPTable table = new PdfPTable(6);
      table.setWidthPercentage(100);
      table.setWidths(new float[] {3f, 2.2f, 2.2f, 2.4f, 2.4f, 2.4f});

      addHeaderCell(table, "Período");
      addHeaderCell(table, "Desde");
      addHeaderCell(table, "Hasta");
      addHeaderCell(table, "Compras");
      addHeaderCell(table, "Ventas");
      addHeaderCell(table, "Diferencia");

      BigDecimal totalBuy = BigDecimal.ZERO;
      BigDecimal totalSell = BigDecimal.ZERO;
      for (CashflowSummaryRow r : summary) {
        table.addCell(r.label());
        table.addCell(String.valueOf(r.startDate()));
        table.addCell(String.valueOf(r.endDate()));
        table.addCell("$" + r.purchases());
        table.addCell("$" + r.sales());
        table.addCell("$" + r.net());
        totalBuy = totalBuy.add(r.purchases());
        totalSell = totalSell.add(r.sales());
      }

      PdfPCell totalLabel = new PdfPCell(new Phrase("Totales"));
      totalLabel.setColspan(3);
      table.addCell(totalLabel);
      table.addCell("$" + totalBuy.setScale(2, RoundingMode.HALF_UP));
      table.addCell("$" + totalSell.setScale(2, RoundingMode.HALF_UP));
      table.addCell("$" + totalSell.subtract(totalBuy).setScale(2, RoundingMode.HALF_UP));

      document.add(table);
    } catch (Exception ex) {
      throw new RuntimeException("No se pudo generar PDF de cashflow", ex);
    } finally {
      document.close();
    }
    return baos.toByteArray();
  }

  // ============================================================================
  // REPORTE: Ganancias (Profit) - Método FIFO
  // ============================================================================

  /**
   * Calcula ganancias usando método FIFO (First In, First Out).
   * Compara el costo de cada venta con su ingreso para calcular ganancia real.
   * @param period Tipo de período
   * @param from Fecha inicio
   * @param to Fecha fin
   * @return Lista con ingresos, costos y ganancia por período
   */
  public List<ProfitSummaryRow> getProfitSummary(
      SummaryPeriod period, LocalDate from, LocalDate to) {
    if (period == null) period = SummaryPeriod.DAILY;
    LocalDate end = (to != null) ? to : LocalDate.now();
    LocalDate start;
    switch (period) {
      case WEEKLY -> start = (from != null) ? from : end.minusWeeks(7);
      case MONTHLY -> start = (from != null) ? from : end.minusMonths(12);
      case YEARLY -> start = (from != null) ? from : end.minusYears(5);
      default -> start = (from != null) ? from : end.minusDays(7);
    }
    if (start.isAfter(end)) {
      LocalDate tmp = start;
      start = end;
      end = tmp;
    }

    List<Bucket> buckets = buildBuckets(period, start, end);
    Map<Bucket, ProfitAgg> aggPerBucket = new LinkedHashMap<>();
    for (Bucket b : buckets) aggPerBucket.put(b, new ProfitAgg());

    // -----------------------------------------------------------------------------
    // Paso 1: Obtener todos los items de venta del período
    // -----------------------------------------------------------------------------
    LocalDateTime startDT = start.atStartOfDay();
    LocalDateTime endDT = end.atTime(LocalTime.MAX);
    List<SaleItem> items = saleItemRepository.findItemsBetween(startDT, endDT);

    // -----------------------------------------------------------------------------
    // Paso 2: Identificar qué productos se vendieron
    // -----------------------------------------------------------------------------
    Set<Long> productIds = new HashSet<>();
    for (SaleItem si : items) if (si.getProduct() != null) productIds.add(si.getProduct().getId());

    // -----------------------------------------------------------------------------
    // Paso 3: Obtener las compras de esos productos (para calcular costo)
    // -----------------------------------------------------------------------------
    List<PurchaseItem> purchases =
        productIds.isEmpty()
            ? Collections.emptyList()
            : purchaseItemRepository.findAllForProductsUpToDate(
                productIds, endDT, PurchaseStatus.COMPLETED);

    // -----------------------------------------------------------------------------
    // Paso 4: Calcular costo de cada venta usando FIFO
    // FIFO = First In, First Out (primero en entrar, primero en salir)
    // Ejemplo: Si compré 10 unidades a $100 y después 10 a $150,
    //          y vendo 15, las primeras 10 cuestan $100 y las otras 5 cuestan $150
    // -----------------------------------------------------------------------------
    Map<Long, Deque<StockBatch>> fifoByProduct = new HashMap<>();  // Stock disponible por producto
    Map<Long, BigDecimal> lastKnownCost = new HashMap<>();         // Último costo conocido

    int pIndex = 0;
    // -----------------------------------------------------------------------------
    // Paso 5: Procesar cada venta y calcular su costo (COGS)
    // -----------------------------------------------------------------------------
    for (SaleItem si : items) {
      // Ignorar items inválidos
      if (si.getProduct() == null || si.getQuantity() == null || si.getUnitPrice() == null || si.getSale() == null) continue;
      
      long productId = si.getProduct().getId();
      int quantity = si.getQuantity();
      BigDecimal unitRevenue = si.getUnitPrice();
      BigDecimal revenue = unitRevenue.multiply(BigDecimal.valueOf(quantity));

      // Agregar nuevas compras al stock disponible (las que ocurrieron antes de esta venta)
      LocalDateTime saleAt = si.getSale().getSaleDate();
      while (pIndex < purchases.size()) {
        PurchaseItem pi = purchases.get(pIndex);
        if (pi.getPurchase() != null && pi.getPurchase().getCreatedAt() != null
            && !pi.getPurchase().getCreatedAt().isAfter(saleAt)) {
          if (pi.getProduct() != null && pi.getQuantity() != null && pi.getCost() != null) {
            long pPid = pi.getProduct().getId();
            fifoByProduct.computeIfAbsent(pPid, k -> new ArrayDeque<>()).addLast(new StockBatch(pPid, pi.getQuantity(), pi.getCost()));
            lastKnownCost.put(pPid, pi.getCost());
          }
          pIndex++;
        } else {
          break;
        }
      }

      // Calcular costo de esta venta usando FIFO
      BigDecimal cogs = BigDecimal.ZERO;  // COGS = Cost of Goods Sold (Costo de los bienes vendidos)
      Deque<StockBatch> q = fifoByProduct.getOrDefault(productId, new ArrayDeque<>());
      while (quantity > 0) {
        if (!q.isEmpty()) {
          // Usar stock más antiguo primero
          StockBatch batch = q.peekFirst();
          int take = Math.min(quantity, batch.remaining);
          cogs = cogs.add(batch.cost.multiply(BigDecimal.valueOf(take)));
          batch.remaining -= take;
          quantity -= take;
          if (batch.remaining == 0) q.pollFirst();
        } else {
          // No hay stock: usar último costo conocido o 0
          BigDecimal fallback = lastKnownCost.getOrDefault(productId, BigDecimal.ZERO);
          cogs = cogs.add(fallback.multiply(BigDecimal.valueOf(quantity)));
          quantity = 0;
        }
      }

      // Asignar al bucket (período) correspondiente
      LocalDate d = si.getSale().getSaleDate().toLocalDate();
      Bucket target = null;
      for (Bucket b : buckets) {
        if ((d.isEqual(b.start) || d.isAfter(b.start)) && (d.isEqual(b.end) || d.isBefore(b.end))) {
          target = b;
          break;
        }
      }
      if (target == null) continue;
      ProfitAgg agg = aggPerBucket.get(target);
      agg.revenue = agg.revenue.add(revenue);
      agg.cogs = agg.cogs.add(cogs);
      if (si.getSale().getId() != null) agg.saleIds.add(si.getSale().getId());
    }

    List<ProfitSummaryRow> out = new ArrayList<>();
    for (Bucket b : buckets) {
      ProfitAgg a = aggPerBucket.get(b);
      BigDecimal profit = a.revenue.subtract(a.cogs);
      out.add(
          new ProfitSummaryRow(
              b.label,
              b.start,
              b.end,
              a.saleIds.size(),
              a.revenue.setScale(2, RoundingMode.HALF_UP),
              a.cogs.setScale(2, RoundingMode.HALF_UP),
              profit.setScale(2, RoundingMode.HALF_UP)));
    }
    return out;
  }

  /**
   * Genera PDF del reporte de ganancias.
   */
  public byte[] generateProfitSummaryPdf(SummaryPeriod period, LocalDate from, LocalDate to) {
    List<ProfitSummaryRow> summary = getProfitSummary(period, from, to);

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    Document document = new Document(PageSize.A4.rotate());
    try {
      PdfWriter.getInstance(document, baos);
      document.open();

      String title =
          switch (period) {
            case WEEKLY -> "Reporte de Ganancias - Semanal";
            case MONTHLY -> "Reporte de Ganancias - Mensual";
            case YEARLY -> "Reporte de Ganancias - Anual";
            default -> "Reporte de Ganancias - Diario";
          };

      Paragraph pTitle = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
      pTitle.setAlignment(Element.ALIGN_LEFT);
      document.add(pTitle);

      String rangeText =
          String.format(
              "Rango: %s a %s",
              (from != null ? from : summary.isEmpty() ? "-" : summary.get(0).startDate()),
              (to != null
                  ? to
                  : summary.isEmpty() ? "-" : summary.get(summary.size() - 1).endDate()));
      Paragraph pRange = new Paragraph(rangeText, FontFactory.getFont(FontFactory.HELVETICA, 10));
      pRange.setSpacingAfter(10f);
      document.add(pRange);

      PdfPTable table = new PdfPTable(7);
      table.setWidthPercentage(100);
      table.setWidths(new float[] {3f, 2.2f, 2.2f, 2f, 2.4f, 2.4f, 2.4f});

      addHeaderCell(table, "Período");
      addHeaderCell(table, "Desde");
      addHeaderCell(table, "Hasta");
      addHeaderCell(table, "Transacciones");
      addHeaderCell(table, "Ingresos");
      addHeaderCell(table, "Costo");
      addHeaderCell(table, "Ganancia");

      long totalTx = 0;
      BigDecimal totalRev = BigDecimal.ZERO;
      BigDecimal totalCogs = BigDecimal.ZERO;
      for (ProfitSummaryRow r : summary) {
        table.addCell(r.label());
        table.addCell(String.valueOf(r.startDate()));
        table.addCell(String.valueOf(r.endDate()));
        table.addCell(String.valueOf(r.transactions()));
        table.addCell("$" + r.revenue());
        table.addCell("$" + r.cogs());
        table.addCell("$" + r.profit());
        totalTx += r.transactions();
        totalRev = totalRev.add(r.revenue());
        totalCogs = totalCogs.add(r.cogs());
      }

      PdfPCell totalLabel = new PdfPCell(new Phrase("Totales"));
      totalLabel.setColspan(4);
      table.addCell(totalLabel);
      table.addCell("$" + totalRev.setScale(2, RoundingMode.HALF_UP));
      table.addCell("$" + totalCogs.setScale(2, RoundingMode.HALF_UP));
      table.addCell("$" + totalRev.subtract(totalCogs).setScale(2, RoundingMode.HALF_UP));

      document.add(table);
    } catch (Exception ex) {
      throw new RuntimeException("No se pudo generar PDF de ganancias", ex);
    } finally {
      document.close();
    }
    return baos.toByteArray();
  }

  private void addHeaderCell(PdfPTable table, String text) {
    PdfPCell cell =
        new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
    cell.setBackgroundColor(new Color(234, 88, 12));
    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
    table.addCell(cell);
  }

  private List<Bucket> buildBuckets(SummaryPeriod period, LocalDate start, LocalDate end) {
    List<Bucket> list = new ArrayList<>();
    switch (period) {
      case WEEKLY -> {
        WeekFields wf = WeekFields.ISO;
        LocalDate cursor = start.with(wf.dayOfWeek(), 1); // Lunes
        while (!cursor.isAfter(end)) {
          LocalDate weekStart = cursor;
          LocalDate weekEnd = cursor.plusDays(6);
          if (weekStart.isBefore(start)) weekStart = start;
          if (weekEnd.isAfter(end)) weekEnd = end;
          int week = cursor.get(wf.weekOfWeekBasedYear());
          int year = cursor.get(wf.weekBasedYear());
          list.add(new Bucket(String.format("Semana %d-%02d", year, week), weekStart, weekEnd));
          cursor = cursor.plusWeeks(1);
        }
      }
      case MONTHLY -> {
        YearMonth cs = YearMonth.from(start);
        YearMonth ce = YearMonth.from(end);
        YearMonth cursor = cs;
        while (!cursor.isAfter(ce)) {
          LocalDate mStart = cursor.atDay(1);
          LocalDate mEnd = cursor.atEndOfMonth();
          if (mStart.isBefore(start)) mStart = start;
          if (mEnd.isAfter(end)) mEnd = end;
          list.add(
              new Bucket(
                  String.format("%d-%02d", cursor.getYear(), cursor.getMonthValue()),
                  mStart,
                  mEnd));
          cursor = cursor.plusMonths(1);
        }
      }
      case YEARLY -> {
        int ys = start.getYear();
        int ye = end.getYear();
        for (int y = ys; y <= ye; y++) {
          LocalDate yStart = LocalDate.of(y, 1, 1);
          LocalDate yEnd = LocalDate.of(y, 12, 31);
          if (yStart.isBefore(start)) yStart = start;
          if (yEnd.isAfter(end)) yEnd = end;
          list.add(new Bucket(String.valueOf(y), yStart, yEnd));
        }
      }
      default -> { // DAILY
        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
          list.add(new Bucket(cursor.toString(), cursor, cursor));
          cursor = cursor.plusDays(1);
        }
      }
    }
    return list;
  }

  private static class Bucket {
    final String label;
    final LocalDate start;
    final LocalDate end;

    Bucket(String label, LocalDate start, LocalDate end) {
      this.label = label;
      this.start = start;
      this.end = end;
    }
  }

  private static class BucketAgg {
    long transactions = 0;
    BigDecimal total = BigDecimal.ZERO;
  }

  private static class ProfitAgg {
    Set<Long> saleIds = new HashSet<>();
    BigDecimal revenue = BigDecimal.ZERO;
    BigDecimal cogs = BigDecimal.ZERO;
  }

  private static class StockBatch {
    final long productId;
    int remaining;
    final BigDecimal cost;

    StockBatch(long productId, int remaining, BigDecimal cost) {
      this.productId = productId;
      this.remaining = remaining;
      this.cost = cost;
    }
  }
}
