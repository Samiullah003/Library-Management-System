package com.library.model;

/** Registered member. Password is stored as a BCrypt hash, never in clear text. */
public class User {
    private int id;
    private String name;
    private String email;
    private String passwordHash;
    private String role;          // STUDENT | LIBRARIAN
    private String memberId;      // e.g. MU-2026-0142
    private String department;
    private String joinedOn;

    public User() { }

    public User(int id, String name, String email, String passwordHash, String role,
                String memberId, String department, String joinedOn) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.memberId = memberId;
        this.department = department;
        this.joinedOn = joinedOn;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getJoinedOn() { return joinedOn; }
    public void setJoinedOn(String joinedOn) { this.joinedOn = joinedOn; }
}
