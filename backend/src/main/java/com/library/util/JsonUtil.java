package com.library.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.library.model.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

/** Tiny JSON helper so servlets stay free of boilerplate. */
public final class JsonUtil {

    private static final Gson GSON = new GsonBuilder()
            .serializeNulls()
            .setPrettyPrinting()
            .create();

    private JsonUtil() { }

    public static Gson gson() { return GSON; }

    public static String toJson(Object obj) { return GSON.toJson(obj); }

    /** Reads the request body and maps it onto a simple Map (null-safe). */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> readBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        if (sb.length() == 0) return new java.util.HashMap<>();
        try {
            Map<String, Object> map = GSON.fromJson(sb.toString(), Map.class);
            return map == null ? new java.util.HashMap<>() : map;
        } catch (Exception e) {
            return new java.util.HashMap<>();
        }
    }

    public static String str(Map<String, Object> body, String key) {
        Object v = body.get(key);
        return v == null ? null : String.valueOf(v).trim();
    }

    public static int intVal(Map<String, Object> body, String key, int fallback) {
        Object v = body.get(key);
        if (v == null) return fallback;
        try {
            return (int) Double.parseDouble(String.valueOf(v));
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    public static void write(HttpServletResponse resp, int status, Object payload) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.write(GSON.toJson(payload));
        }
    }

    public static void ok(HttpServletResponse resp, Object data) throws IOException {
        write(resp, HttpServletResponse.SC_OK, ApiResponse.ok(data));
    }

    public static void ok(HttpServletResponse resp, String message, Object data) throws IOException {
        write(resp, HttpServletResponse.SC_OK, ApiResponse.ok(message, data));
    }

    public static void fail(HttpServletResponse resp, int status, String message) throws IOException {
        write(resp, status, ApiResponse.error(message));
    }
}
