package com.library.dao;

import com.library.model.Book;
import com.library.model.Loan;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/** Circulation desk: issuing, renewing and returning copies. */
public class LoanDAO {

    private static final LoanDAO INSTANCE = new LoanDAO();
    public static LoanDAO getInstance() { return INSTANCE; }

    public static final int LOAN_DAYS = 14;

    private final List<Loan> loans = new ArrayList<>();
    private int sequence = 1000;

    private LoanDAO() {
        // Two books already on loan so the dashboard is never empty on first run.
        seedLoan(1, 7, "Priya Sharma", "MU-2026-0101", LocalDate.now().minusDays(25));
        seedLoan(2, 8, "Rohan Mehta", "MU-2026-0102", LocalDate.now().minusDays(5));
    }

    private void seedLoan(int userId, int bookId, String name, String memberId, LocalDate borrowedOn) {
        Book book = BookDAO.getInstance().findById(bookId);
        if (book == null) return;
        Loan loan = new Loan();
        loan.setId(++sequence);
        loan.setBookId(bookId);
        loan.setUserId(userId);
        loan.setBookTitle(book.getTitle());
        loan.setBookAuthor(book.getAuthor());
        loan.setCoverUrl(book.getCoverUrl());
        loan.setMemberName(name);
        loan.setBorrowedOn(borrowedOn.toString());
        loan.setDueOn(borrowedOn.plusDays(LOAN_DAYS).toString());
        loan.setStatus("ISSUED");
        loan.setRenewals(0);
        loans.add(loan);
        book.setAvailableCopies(Math.max(0, book.getAvailableCopies() - 1));
    }

    public List<Loan> findByUser(int userId) {
        return loans.stream()
                .filter(l -> l.getUserId() == userId)
                .sorted(Comparator.comparing(Loan::getBorrowedOn).reversed())
                .collect(Collectors.toList());
    }

    public List<Loan> findAll() {
        return loans.stream()
                .sorted(Comparator.comparing(Loan::getBorrowedOn).reversed())
                .collect(Collectors.toList());
    }

    public Loan findActiveForUserAndBook(int userId, int bookId) {
        for (Loan l : loans) {
            if (l.getUserId() == userId && l.getBookId() == bookId && "ISSUED".equals(l.getStatus())) return l;
        }
        return null;
    }

    public Loan findById(int id) {
        for (Loan l : loans) if (l.getId() == id) return l;
        return null;
    }

    public Loan issue(int userId, String memberName, int bookId) {
        Book book = BookDAO.getInstance().findById(bookId);
        if (book == null || book.getAvailableCopies() <= 0) return null;
        Loan loan = new Loan();
        loan.setId(++sequence);
        loan.setBookId(bookId);
        loan.setUserId(userId);
        loan.setBookTitle(book.getTitle());
        loan.setBookAuthor(book.getAuthor());
        loan.setCoverUrl(book.getCoverUrl());
        loan.setMemberName(memberName);
        loan.setBorrowedOn(LocalDate.now().toString());
        loan.setDueOn(LocalDate.now().plusDays(LOAN_DAYS).toString());
        loan.setStatus("ISSUED");
        loan.setRenewals(0);
        loans.add(loan);
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        return loan;
    }

    public boolean giveBack(int loanId) {
        Loan loan = findById(loanId);
        if (loan == null || !"ISSUED".equals(loan.getStatus())) return false;
        loan.setStatus("RETURNED");
        loan.setReturnedOn(LocalDate.now().toString());
        Book book = BookDAO.getInstance().findById(loan.getBookId());
        if (book != null) book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        return true;
    }

    public boolean renew(int loanId) {
        Loan loan = findById(loanId);
        if (loan == null || !"ISSUED".equals(loan.getStatus()) || loan.getRenewals() >= 2) return false;
        loan.setRenewals(loan.getRenewals() + 1);
        loan.setDueOn(LocalDate.parse(loan.getDueOn()).plusDays(LOAN_DAYS).toString());
        return true;
    }

    public long activeCount() {
        return loans.stream().filter(l -> "ISSUED".equals(l.getStatus())).count();
    }

    public long overdueCount() {
        LocalDate today = LocalDate.now();
        return loans.stream()
                .filter(l -> "ISSUED".equals(l.getStatus()))
                .filter(l -> LocalDate.parse(l.getDueOn()).isBefore(today))
                .count();
    }
}
