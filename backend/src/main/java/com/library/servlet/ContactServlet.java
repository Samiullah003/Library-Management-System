package com.library.servlet;

import com.library.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** POST /api/contact - stores enquiries in memory and returns a reference number. */
@WebServlet(urlPatterns = "/api/contact")
public class ContactServlet extends HttpServlet {

    private final List<Map<String, Object>> messages = new ArrayList<>();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, Object> body = JsonUtil.readBody(req);
        String name = JsonUtil.str(body, "name");
        String email = JsonUtil.str(body, "email");
        String message = JsonUtil.str(body, "message");

        if (name == null || name.isEmpty() || email == null || email.isEmpty()
                || message == null || message.isEmpty()) {
            JsonUtil.fail(resp, 400, "Name, email and message are all required");
            return;
        }

        Map<String, Object> stored = new LinkedHashMap<>(body);
        stored.put("receivedAt", LocalDateTime.now().withNano(0).toString());
        stored.put("reference", "ENQ-" + (1000 + messages.size() + 1));
        messages.add(stored);

        JsonUtil.ok(resp, "Thank you " + name + ", your enquiry " + stored.get("reference")
                + " has reached the circulation desk.", stored);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonUtil.ok(resp, messages);
    }
}
