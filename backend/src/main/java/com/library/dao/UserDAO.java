package com.library.dao;

import com.library.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** In-memory member register. Passwords are BCrypt-hashed, never plain text. */
public class UserDAO {

    private static final UserDAO INSTANCE = new UserDAO();
    public static UserDAO getInstance() { return INSTANCE; }

    private final List<User> users = new ArrayList<>();
    private int sequence = 100;

    private UserDAO() {
        users.add(new User(1, "Priya Sharma", "priya@library.edu",
                BCrypt.hashpw("priya123", BCrypt.gensalt()), "STUDENT",
                "MU-2026-0101", "Computer Engineering", "2023-07-12"));
        users.add(new User(2, "Rohan Mehta", "rohan@library.edu",
                BCrypt.hashpw("rohan123", BCrypt.gensalt()), "STUDENT",
                "MU-2026-0102", "Information Technology", "2024-01-08"));
        users.add(new User(3, "Ms. Anjali Deshmukh", "librarian@library.edu",
                BCrypt.hashpw("admin123", BCrypt.gensalt()), "LIBRARIAN",
                "MU-STAFF-0007", "Central Library", "2019-06-01"));
    }

    public User findByEmail(String email) {
        if (email == null) return null;
        for (User u : users) if (u.getEmail().equalsIgnoreCase(email.trim())) return u;
        return null;
    }

    public User findById(int id) {
        for (User u : users) if (u.getId() == id) return u;
        return null;
    }

    public boolean emailExists(String email) { return findByEmail(email) != null; }

    public User create(String name, String email, String password, String department) {
        int id = ++sequence;
        String memberId = String.format("MU-2026-%04d", sequence);
        User user = new User(id, name, email.toLowerCase().trim(),
                BCrypt.hashpw(password, BCrypt.gensalt()), "STUDENT",
                memberId, department == null || department.isEmpty() ? "Computer Engineering" : department,
                LocalDate.now().toString());
        users.add(user);
        return user;
    }

    /** Returns the user when the password matches, otherwise null. */
    public User authenticate(String email, String password) {
        User user = findByEmail(email);
        if (user == null || password == null) return null;
        try {
            return BCrypt.checkpw(password, user.getPasswordHash()) ? user : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public List<User> findAll() { return new ArrayList<>(users); }
}
