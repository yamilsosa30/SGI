package com.kiosk.pos.controller;

import com.kiosk.pos.service.BackupService;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*.*:*"})
public class AdminController {

  private static final String SGIK_BACKUP = "sgik-backup-";
  private static final String SQL = ".sql";
  private static final String YYYY_MMDD_HHMM = "yyyyMMdd-HHmm";
  private static final String ATTACHMENT_FILENAME = "attachment; filename=";
  private static final String ERROR = "ERROR: ";
  private final BackupService backupService;

  public AdminController(final BackupService backupService) {
    this.backupService = backupService;
  }

  @PostMapping("/backup")
  public ResponseEntity<byte[]> generateBackup() {
    try {
      Process p = backupService.runMysqlDump();
      InputStream in = p.getInputStream();
      byte[] data = in.readAllBytes();
      String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern(YYYY_MMDD_HHMM));
      String filename = SGIK_BACKUP + ts + SQL;
      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION, ATTACHMENT_FILENAME + filename)
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(data);
    } catch (Exception ex) {
      return ResponseEntity.internalServerError().body((ERROR + ex.getMessage()).getBytes());
    }
  }
}
