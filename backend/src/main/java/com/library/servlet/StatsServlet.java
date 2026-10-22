package com.library.servlet;

import com.library.dao.BookDAO;
import com.library.dao.LoanDAO;
import com.library.dao.UserDAO;
import com.library.model.Book;
import com.library.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * GET /api/stats      -> headline numbers for the dashboard
 * GET /api/categories -> category chips + counts
 */
@WebServlet(urlPatterns = {"/api/stats", "/api/categories"})
public class StatsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BookDAO bookDAO = BookDAO.getInstance();
        LoanDAO loanDAO = LoanDAO.getInstance();

        if ("/api/categories".equals(req.getServletPath())) {
            Map<String, Integer> counts = new LinkedHashMap<>();
            for (Book b : bookDAO.findAll()) {
                counts.merge(b.getCategory(), 1, Integer::sum);
            }
            List<Map<String, Object>> payload = new ArrayList<>();
            for (Map.Entry<String, Integer> e : counts.entrySet()) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("name", e.getKey());
                row.put("count", e.getValue());
                payload.add(row);
            }
            JsonUtil.ok(resp, payload);
            return;
        }

        List<Book> books = bookDAO.findAll();
        int titles = books.size();
        int copies = books.stream().mapToInt(Book::getTotalCopies).sum();
        int available = books.stream().mapToInt(Book::getAvailableCopies).sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("titles", titles);
        stats.put("totalCopies", copies);
        stats.put("availableCopies", available);
        stats.put("issuedCopies", copies - available);
        stats.put("members", UserDAO.getInstance().findAll().size());
        stats.put("activeLoans", loanDAO.activeCount());
        stats.put("overdue", loanDAO.overdueCount());
        stats.put("categories", bookDAO.categories());
        JsonUtil.ok(resp, stats);
    }
}
