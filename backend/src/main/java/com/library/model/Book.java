package com.library.model;

import java.util.List;

/** A single catalogue record. Plain in-memory object - no database. */
public class Book {
    private int id;
    private String title;
    private String author;
    private String isbn;
    private int year;
    private String publisher;
    private String category;
    private String description;
    private String coverUrl;
    private int totalCopies;
    private int availableCopies;
    private double rating;
    private int pages;
    private String language;
    private String shelf;
    private List<String> tags;

    public Book() { }

    public Book(int id, String title, String author, String isbn, int year, String publisher,
                String category, String description, String coverUrl, int totalCopies,
                double rating, int pages, String language, String shelf, List<String> tags) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.publisher = publisher;
        this.category = category;
        this.description = description;
        this.coverUrl = coverUrl;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
        this.rating = rating;
        this.pages = pages;
        this.language = language;
        this.shelf = shelf;
        this.tags = tags;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public int getTotalCopies() { return totalCopies; }
    public void setTotalCopies(int totalCopies) { this.totalCopies = totalCopies; }
    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getShelf() { return shelf; }
    public void setShelf(String shelf) { this.shelf = shelf; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    /** Derived flag the UI uses for the "Available / All copies out" pill. */
    public boolean isAvailable() { return availableCopies > 0; }
}
