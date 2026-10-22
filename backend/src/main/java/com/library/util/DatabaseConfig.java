package com.library.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/** Edit the two JDBC configurations below, or set the documented environment variables. */
public final class DatabaseConfig {
  private DatabaseConfig() {}
  private static final String AUTH_URL = System.getenv().getOrDefault("jdbc:mysql://db.rcoe.co.in:3306/userlmsys_db", "jdbc:mysql://localhost:3306/library_auth?useSSL=false&serverTimezone=UTC");
  private static final String AUTH_USER = System.getenv().getOrDefault("userlmsys", "root");
  private static final String AUTH_PASSWORD = System.getenv().getOrDefault("userlmsys", "CHANGE_ME");
  private static final String BOOKS_URL = System.getenv().getOrDefault("jdbc:mysql://db.rcoe.co.in:3306/booklmsys_db", "jdbc:mysql://localhost:3306/library_books?useSSL=false&serverTimezone=UTC");
  private static final String BOOKS_USER = System.getenv().getOrDefault("booklmsys", "root");
  private static final String BOOKS_PASSWORD = System.getenv().getOrDefault("booklmsys", "CHANGE_ME");
  public static Connection authConnection() throws SQLException { return DriverManager.getConnection(AUTH_URL, AUTH_USER, AUTH_PASSWORD); }
  public static Connection booksConnection() throws SQLException { return DriverManager.getConnection(BOOKS_URL, BOOKS_USER, BOOKS_PASSWORD); }
}
