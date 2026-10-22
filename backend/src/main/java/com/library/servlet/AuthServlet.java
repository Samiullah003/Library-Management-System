package com.library.servlet;

import com.library.dao.UserDAO;
import com.library.model.User;
import com.library.util.AuthHelper;
import com.library.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * POST /api/auth/login     -> creates an HttpSession
 * POST /api/auth/register  -> creates a member and signs them in
 * GET  /api/auth/me        -> current session user (null when signed out)
 * POST /api/auth/logout    -> invalidates the session
 */
@WebServlet(urlPatterns = {"/api/auth/login", "/api/auth/register", "/api/auth/me", "/api/auth/logout"})
public class AuthServlet extends HttpServlet {

    private final UserDAO users = UserDAO.getInstance();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonUtil.ok(resp, publicView(AuthHelper.currentUser(req)));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getServletPath();

        if ("/api/auth/logout".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session != null) session.invalidate();
            JsonUtil.ok(resp, "Signed out", null);
            return;
        }

        Map<String, Object> body = JsonUtil.readBody(req);

        if ("/api/auth/login".equals(path)) {
            String email = JsonUtil.str(body, "email");
            String password = JsonUtil.str(body, "password");
            if (email == null || password == null) {
                JsonUtil.fail(resp, 400, "Email and password are required");
                return;
            }
            User user = users.authenticate(email, password);
            if (user == null) {
                JsonUtil.fail(resp, 401, "Incorrect email or password");
                return;
            }
            req.getSession(true).setAttribute(AuthHelper.SESSION_USER, user);
            JsonUtil.ok(resp, "Welcome back, " + user.getName(), publicView(user));
            return;
        }

        // register
        String name = JsonUtil.str(body, "name");
        String email = JsonUtil.str(body, "email");
        String password = JsonUtil.str(body, "password");
        String department = JsonUtil.str(body, "department");

        if (name == null || name.isEmpty() || email == null || email.isEmpty() || password == null) {
            JsonUtil.fail(resp, 400, "Name, email and password are required");
            return;
        }
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            JsonUtil.fail(resp, 400, "Please enter a valid email address");
            return;
        }
        if (password.length() < 6) {
            JsonUtil.fail(resp, 400, "Password must be at least 6 characters");
            return;
        }
        if (users.emailExists(email)) {
            JsonUtil.fail(resp, 409, "An account with this email already exists");
            return;
        }

        User created = users.create(name, email, password, department);
        req.getSession(true).setAttribute(AuthHelper.SESSION_USER, created);
        JsonUtil.ok(resp, "Member registered. Your membership id is " + created.getMemberId(), publicView(created));
    }

    /** Never leak the BCrypt hash to the browser. */
    private Map<String, Object> publicView(User user) {
        if (user == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", user.getId());
        m.put("name", user.getName());
        m.put("email", user.getEmail());
        m.put("role", user.getRole());
        m.put("memberId", user.getMemberId());
        m.put("department", user.getDepartment());
        m.put("joinedOn", user.getJoinedOn());
        return m;
    }
}
