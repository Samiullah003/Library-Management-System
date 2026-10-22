package com.library.servlet;

import com.library.dao.BookDAO;
import com.library.model.Book;
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
 * GET  /api/books          -> list, supports ?q= &category= &available=true
 * GET  /api/books/{id}     -> single record
 * POST /api/books          -> add (librarian only)
 * DELETE /api/books/{id}   -> remove (librarian only)
 */
@WebServlet(urlPatterns = {"/api/books", "/api/books/*"})
public class BookServlet extends HttpServlet {

    private final BookDAO books = BookDAO.getInstance();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getPathInfo();

        if (path != null && path.length() > 1) {
            int id;
            try {
                id = Integer.parseInt(path.substring(1));
            } catch (NumberFormatException e) {
                JsonUtil.fail(resp, 400, "Invalid book id");
                return;
            }
            Book book = books.findById(id);
            if (book == null) {
                JsonUtil.fail(resp, 404, "Book not found");
                return;
            }
            JsonUtil.ok(resp, book);
            return;
        }

        String q = req.getParameter("q");
        String category = req.getParameter("category");
        boolean onlyAvailable = "true".equalsIgnoreCase(req.getParameter("available"));

        List<Book> result = books.search(q, category, onlyAvailable);
        JsonUtil.ok(resp, result);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.isLibrarian(AuthHelper.currentUser(req))) {
            JsonUtil.fail(resp, 403, "Only a librarian can add books. Sign in as librarian@library.edu.");
            return;
        }
        Map<String, Object> body = JsonUtil.readBody(req);
        String title = JsonUtil.str(body, "title");
        String author = JsonUtil.str(body, "author");
        if (title == null || title.isEmpty() || author == null || author.isEmpty()) {
            JsonUtil.fail(resp, 400, "Title and author are required");
            return;
        }
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(orEmpty(JsonUtil.str(body, "isbn")));
        book.setYear(JsonUtil.intVal(body, "year", 2024));
        book.setPublisher(orEmpty(JsonUtil.str(body, "publisher")));
        book.setCategory(JsonUtil.str(body, "category") == null ? "Computer Engineering" : JsonUtil.str(body, "category"));
        book.setDescription(orEmpty(JsonUtil.str(body, "description")));
        book.setCoverUrl(JsonUtil.str(body, "coverUrl") == null ? "/covers/placeholder.svg" : JsonUtil.str(body, "coverUrl"));
        int copies = JsonUtil.intVal(body, "totalCopies", 1);
        book.setTotalCopies(copies);
        book.setAvailableCopies(copies);
        book.setRating(4.0);
        book.setPages(JsonUtil.intVal(body, "pages", 0));
        book.setLanguage("English");
        book.setShelf("MU-NEW-01");
        book.setTags(java.util.Arrays.asList("New Arrival"));

        books.add(book);
        JsonUtil.ok(resp, "Book added to the catalogue", book);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.isLibrarian(AuthHelper.currentUser(req))) {
            JsonUtil.fail(resp, 403, "Only a librarian can remove books.");
            return;
        }
        String path = req.getPathInfo();
        if (path == null || path.length() < 2) {
            JsonUtil.fail(resp, 400, "Book id is required");
            return;
        }
        try {
            int id = Integer.parseInt(path.substring(1));
            boolean removed = books.remove(id);
            if (removed) JsonUtil.ok(resp, "Book removed", null);
            else JsonUtil.fail(resp, 404, "Book not found");
        } catch (NumberFormatException e) {
            JsonUtil.fail(resp, 400, "Invalid book id");
        }
    }

    private String orEmpty(String s) { return s == null ? "" : s; }
}
