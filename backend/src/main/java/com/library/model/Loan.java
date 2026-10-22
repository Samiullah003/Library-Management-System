package com.library.model;

/** One borrow record (issue + return), mirroring a library circulation slip. */
public class Loan {
    private int id;
    private int bookId;
    private int userId;
    private String bookTitle;
    private String bookAuthor;
    private String coverUrl;
    private String memberName;
    private String borrowedOn;
    private String dueOn;
    private String returnedOn;   // null while still issued
    private String status;       // ISSUED | RETURNED
    private int renewals;

    public Loan() { }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getBookId() { return bookId; }
    public void setBookId(int bookId) { this.bookId = bookId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getBookAuthor() { return bookAuthor; }
    public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    public String getBorrowedOn() { return borrowedOn; }
    public void setBorrowedOn(String borrowedOn) { this.borrowedOn = borrowedOn; }
    public String getDueOn() { return dueOn; }
    public void setDueOn(String dueOn) { this.dueOn = dueOn; }
    public String getReturnedOn() { return returnedOn; }
    public void setReturnedOn(String returnedOn) { this.returnedOn = returnedOn; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getRenewals() { return renewals; }
    public void setRenewals(int renewals) { this.renewals = renewals; }
}
