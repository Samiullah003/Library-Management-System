package com.library.servlet;

import com.library.dao.LoanDAO;
import com.library.model.Loan;
import com.library.model.User;
import com.library.util.AuthHelper;
import com.library.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * GET  /api/loans            -> loans of the signed-in member (librarian sees all)
 * POST /api/loans            -> body { bookId } borrow a copy
 * POST /api/loans/{id}/return
 * POST /api/loans/{id}/renew
 */
@WebServlet(urlPatterns = {"/api/loans", "/api/loans/*"})
public class LoanServlet extends HttpServlet {

    private final LoanDAO loans = LoanDAO.getInstance();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = AuthHelper.currentUser(req);
        if (user == null) {
            JsonUtil.fail(resp, 401, "Please sign in to view your borrowed books");
            return;
        }
        List<Loan> result = AuthHelper.isLibrarian(user) ? loans.findAll() : loans.findByUser(user.getId());
        JsonUtil.ok(resp, result);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = AuthHelper.currentUser(req);
        if (user == null) {
            JsonUtil.fail(resp, 401, "Please sign in to borrow a book");
            return;
        }

        String path = req.getPathInfo();

        if (path != null && path.endsWith("/return")) {
            int id = idFrom(path, "/return");
            if (id < 0) { JsonUtil.fail(resp, 400, "Invalid loan id"); return; }
            Loan loan = loans.findById(id);
            if (loan == null) { JsonUtil.fail(resp, 404, "Loan not found"); return; }
            if (!AuthHelper.isLibrarian(user) && loan.getUserId() != user.getId()) {
                JsonUtil.fail(resp, 403, "This loan belongs to another member");
                return;
            }
            if (loans.giveBack(id)) JsonUtil.ok(resp, "Book returned. Thank you!", loans.findById(id));
            else JsonUtil.fail(resp, 409, "This copy was already returned");
            return;
        }

        if (path != null && path.endsWith("/renew")) {
            int id = idFrom(path, "/renew");
            if (id < 0) { JsonUtil.fail(resp, 400, "Invalid loan id"); return; }
            Loan loan = loans.findById(id);
            if (loan == null) { JsonUtil.fail(resp, 404, "Loan not found"); return; }
            if (!AuthHelper.isLibrarian(user) && loan.getUserId() != user.getId()) {
                JsonUtil.fail(resp, 403, "This loan belongs to another member");
                return;
            }
            if (loans.renew(id)) JsonUtil.ok(resp, "Loan renewed for 14 more days", loans.findById(id));
            else JsonUtil.fail(resp, 409, "Renewal limit reached (2 renewals per copy)");
            return;
        }

        // borrow
        Map<String, Object> body = JsonUtil.readBody(req);
        int bookId = JsonUtil.intVal(body, "bookId", -1);
        if (bookId <= 0) { JsonUtil.fail(resp, 400, "bookId is required"); return; }

        if (loans.findActiveForUserAndBook(user.getId(), bookId) != null) {
            JsonUtil.fail(resp, 409, "You already have a copy of this book");
            return;
        }
        Loan loan = loans.issue(user.getId(), user.getName(), bookId);
        if (loan == null) {
            JsonUtil.fail(resp, 409, "No copies available right now. Please try again later.");
            return;
        }
        JsonUtil.ok(resp, "Issued. Please return by " + loan.getDueOn(), loan);
    }

    private int idFrom(String path, String suffix) {
        try {
            return Integer.parseInt(path.substring(1, path.length() - suffix.length()));
        } catch (Exception e) {
            return -1;
        }
    }
}
