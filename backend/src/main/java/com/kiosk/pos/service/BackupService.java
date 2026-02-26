package com.kiosk.pos.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BackupService {

  @Value("${spring.datasource.url}")
  private String jdbcUrl;

  @Value("${spring.datasource.username}")
  private String dbUser;

  @Value("${spring.datasource.password}")
  private String dbPass;

  public Process runMysqlDump() throws IOException {
    // Parse jdbc url: jdbc:mysql://host:port/dbname?params
    String url = jdbcUrl.replace("jdbc:mysql://", "");
    String hostPort = url.split("/", 2)[0];
    String db = url.split("/", 2)[1].split("\\?", 2)[0];
    String host = hostPort.contains(":") ? hostPort.split(":")[0] : hostPort;
    String port = hostPort.contains(":") ? hostPort.split(":")[1] : "3306";

    List<String> cmd = new ArrayList<>();
    cmd.add("mysqldump");
    cmd.add("-h");
    cmd.add(host);
    cmd.add("-P");
    cmd.add(port);
    cmd.add("-u" + dbUser);
    cmd.add("-p" + dbPass);
    cmd.add(db);
    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.redirectErrorStream(true);
    return pb.start();
  }
}
