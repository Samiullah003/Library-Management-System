package com.library.util;

import com.library.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/** Session helpers - the browser's JSESSIONID cookie is the source of truth. */
public final class AuthHelper {

    public static final String SESSION_USER = "libraryUser";

    private AuthHelper() { }

    public static User currentUser(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) return null;
        Object u = session.getAttribute(SESSION_USER);
        return (u instanceof User) ? (User) u : null;
    }

    public static boolean isLibrarian(User user) {
        return user != null && "LIBRARIAN".equalsIgnoreCase(user.getRole());
    }
}
