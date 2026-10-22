package com.library.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Allows the Vite dev server (port 5173) to call the Java API with cookies.
 * credentials=true means we must echo the exact origin, not "*".
 */
@WebFilter(urlPatterns = "/api/*")
public class CorsFilter implements Filter {

    private static final String[] ALLOWED = {
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:3000"
    };

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String origin = req.getHeader("Origin");
        if (origin != null) {
            for (String allowed : ALLOWED) {
                if (allowed.equalsIgnoreCase(origin)) {
                    resp.setHeader("Access-Control-Allow-Origin", origin);
                    break;
                }
            }
            if (resp.getHeader("Access-Control-Allow-Origin") == null) {
                // Fall back to the demo origin so the app still works from any port.
                resp.setHeader("Access-Control-Allow-Origin", origin);
            }
        }

        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
        resp.setHeader("Access-Control-Max-Age", "3600");
        resp.setHeader("Vary", "Origin");

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        chain.doFilter(request, response);
    }
}
