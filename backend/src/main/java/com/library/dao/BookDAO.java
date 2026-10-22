package com.library.dao;

import com.library.model.Book;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * In-memory catalogue. There is deliberately NO database in this project:
 * the seed list below is the single source of truth and lives for the
 * lifetime of the servlet container.
 */
public class BookDAO {

    private static final BookDAO INSTANCE = new BookDAO();
    public static BookDAO getInstance() { return INSTANCE; }

    private final List<Book> books = new ArrayList<>();

    private BookDAO() { seed(); }

    private void seed() {
        books.add(new Book(1, "Wings of Fire", "A. P. J. Abdul Kalam",
                "9788173711466", 1999, "Universities Press",
                "Biography & Inspiration",
                "The autobiography of Dr. A. P. J. Abdul Kalam, written with Arun Tiwari. It traces a boy from Rameswaram "
              + "who sold newspapers on the beach, studied aeronautical engineering at MIT Chennai, and went on to lead "
              + "India's first satellite launch vehicle (SLV-3) and the Pokhran-II tests. A book about curiosity, "
              + "discipline and the teachers who shape a life.",
                "/covers/wings-of-fire.svg", 4, 4.8, 180, "English", "MU-ENG-BIO-01",
                Arrays.asList("Autobiography", "ISRO", "Aerospace", "Bestseller")));

        books.add(new Book(2, "Ignited Minds", "A. P. J. Abdul Kalam",
                "9780143424123", 2002, "Penguin Books",
                "Biography & Inspiration",
                "Subtitled 'Unleashing the Power within India', this book records Dr. Kalam's conversations with students, "
              + "scientists and schoolchildren across the country. It argues that India's greatest untapped resource is "
              + "its youth, and that a developed nation is built in classrooms before it is built in factories.",
                "/covers/ignited-minds.svg", 3, 4.6, 208, "English", "MU-ENG-BIO-02",
                Arrays.asList("Youth", "Education", "Vision 2020")));

        books.add(new Book(3, "India 2020: A Vision for the New Millennium", "A. P. J. Abdul Kalam & Y. S. Rajan",
                "9780143423683", 1998, "Penguin Books",
                "Biography & Inspiration",
                "A technology roadmap for the country, co-authored with Dr. Y. S. Rajan. The authors assess agriculture, "
              + "energy, information technology, health and strategic industries, and set out the capabilities India "
              + "would need to become a developed nation by 2020. Frequently prescribed for general studies and "
              + "professional-ethics reading lists.",
                "/covers/india-2020.svg", 3, 4.5, 336, "English", "MU-ENG-BIO-03",
                Arrays.asList("Policy", "Technology", "Nation Building")));

        books.add(new Book(4, "My Journey: Transforming Dreams into Actions", "A. P. J. Abdul Kalam",
                "9788129124913", 2013, "Rupa Publications",
                "Biography & Inspiration",
                "A collection of intimate episodes rather than a chronological memoir - the boat his father built, the "
              + "sister who fed him, the failure of his first hovercraft, the Ramzan evenings in Rameswaram. Short, "
              + "warm chapters that show how ordinary discipline produces extraordinary outcomes.",
                "/covers/my-journey.svg", 3, 4.7, 160, "English", "MU-ENG-BIO-04",
                Arrays.asList("Memoir", "Motivation", "Short Reads")));

        books.add(new Book(5, "Turning Points: A Journey Through Challenges", "A. P. J. Abdul Kalam",
                "9789350293478", 2012, "HarperCollins India",
                "Biography & Inspiration",
                "The sequel to Wings of Fire, covering the years from the Pokhran-II tests of 1998 to the Rashtrapati "
              + "Bhavan. It explains, decision by decision, how the nuclear programme was argued, defended and finally "
              + "accepted - a rare look at scientific leadership inside government.",
                "/covers/turning-points.svg", 2, 4.4, 192, "English", "MU-ENG-BIO-05",
                Arrays.asList("Politics", "Defence", "Leadership")));

        books.add(new Book(6, "Target 3 Billion", "A. P. J. Abdul Kalam & Srijan Pal Singh",
                "9780143417309", 2011, "Penguin Books",
                "Biography & Inspiration",
                "A blueprint for rural development built around the 'Providing Urban Amenities in Rural Areas' (PURA) "
              + "model. The authors argue that the three billion people of the developing world can be lifted by "
              + "decentralised energy, water, connectivity and entrepreneurship rather than by aid.",
                "/covers/target-3-billion.svg", 2, 4.2, 298, "English", "MU-ENG-BIO-06",
                Arrays.asList("Rural Development", "Sustainability", "PURA")));

        books.add(new Book(7, "Data Structures Using C", "Reema Thareja",
                "9780198099307", 2014, "Oxford University Press",
                "Computer Engineering",
                "The standard second-year text for MU Computer Engineering (Data Structures & Algorithms). Covers arrays, "
              + "linked lists, stacks, queues, trees, AVL and B-trees, graphs, hashing and sorting with full C programs "
              + "and dry runs before every algorithm.",
                "/covers/data-structures-c.svg", 6, 4.6, 656, "English", "MU-CE-DS-11",
                Arrays.asList("Data Structures", "C", "Semester 3", "MU Syllabus")));

        books.add(new Book(8, "Database System Concepts", "Abraham Silberschatz, Henry F. Korth & S. Sudarshan",
                "9780073523323", 2010, "McGraw-Hill",
                "Computer Engineering",
                "The canonical database text, known simply as 'Silberschatz'. Relational algebra, SQL, normalisation up to "
              + "BCNF, transactions, concurrency control, recovery and storage - the exact syllabus for MU's Database "
              + "Management Systems course, with worked exercises at the end of every chapter.",
                "/covers/dbms-concepts.svg", 5, 4.7, 1376, "English", "MU-CE-DB-12",
                Arrays.asList("DBMS", "SQL", "Semester 4", "Reference")));

        books.add(new Book(9, "Operating System Concepts", "Abraham Silberschatz, Peter B. Galvin & Greg Gagne",
                "9780471417439", 2004, "John Wiley & Sons",
                "Computer Engineering",
                "Known as the 'dinosaur book'. Process and thread scheduling, synchronisation and semaphores, deadlock "
              + "detection, paging and virtual memory, file systems, I/O and protection. MU's OS paper follows this "
              + "book's chapter order almost exactly.",
                "/covers/os-concepts.svg", 5, 4.5, 952, "English", "MU-CE-OS-13",
                Arrays.asList("Operating Systems", "Concurrency", "Semester 5", "Reference")));

        books.add(new Book(10, "Computer Networks", "Andrew S. Tanenbaum",
                "9780130384881", 2002, "Pearson Education",
                "Computer Engineering",
                "The layered-network classic. Physical media, data-link framing and error control, Ethernet, routing "
              + "algorithms, congestion control, IPv4/IPv6, TCP, DNS and network security - each layer explained with "
              + "its design trade-offs rather than only its protocol fields.",
                "/covers/computer-networks.svg", 4, 4.6, 891, "English", "MU-CE-CN-14",
                Arrays.asList("Networking", "TCP/IP", "Semester 5")));

        books.add(new Book(11, "Software Engineering: A Practitioner's Approach", "Roger S. Pressman",
                "9780077227807", 2005, "McGraw-Hill",
                "Computer Engineering",
                "Process models, requirement engineering, design quality, testing strategy and software project "
              + "management. The recommended text for MU's Software Engineering paper and the usual reference for the "
              + "final-year project report format.",
                "/covers/software-engineering.svg", 4, 4.3, 912, "English", "MU-CE-SE-15",
                Arrays.asList("SDLC", "Testing", "Semester 6")));

        books.add(new Book(12, "Introduction to Automata Theory, Languages and Computation", "John E. Hopcroft, Rajeev Motwani & Jeffrey D. Ullman",
                "9780321210296", 2001, "Pearson Education",
                "Computer Engineering",
                "Finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, "
              + "decidability and complexity. The reference for MU's Theory of Computation paper, famous for its "
              + "clean, proof-first exposition.",
                "/covers/automata-theory.svg", 4, 4.4, 521, "English", "MU-CE-TC-16",
                Arrays.asList("Theory of Computation", "Automata", "Semester 5")));

        books.add(new Book(13, "Computer Organization and Design", "David A. Patterson & John L. Hennessy",
                "9780123744937", 2008, "Morgan Kaufmann",
                "Computer Engineering",
                "The hardware/software interface. Instruction-set design, MIPS datapath and pipelining, cache hierarchy, "
              + "memory technology, I/O and multiprocessors, with the quantitative reasoning MU expects in Computer "
              + "Organization & Architecture.",
                "/covers/computer-organization.svg", 4, 4.7, 1080, "English", "MU-CE-COA-17",
                Arrays.asList("Architecture", "Pipelining", "Semester 4")));

        books.add(new Book(14, "Introduction to Algorithms", "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein",
                "9780262031417", 2009, "MIT Press",
                "Computer Engineering",
                "Known as 'CLRS'. Sorting and order statistics, dynamic programming, greedy algorithms, graph "
              + "algorithms, NP-completeness and approximation, each with correctness proofs and complexity analysis. "
              + "The benchmark reference for MU's Analysis of Algorithms paper.",
                "/covers/introduction-algorithms.svg", 3, 4.8, 1292, "English", "MU-CE-AA-18",
                Arrays.asList("Algorithms", "CLRS", "Reference")));

        books.add(new Book(15, "Discrete Mathematics and Its Applications", "Kenneth H. Rosen",
                "9780072899054", 2003, "Tata McGraw-Hill",
                "Computer Engineering",
                "Logic and proofs, sets and functions, induction, counting, relations, graphs and trees, Boolean algebra "
              + "and modelling computation. The prescribed text for MU's Discrete Mathematics (Applied Mathematics III) "
              + "paper, with several thousand graded exercises.",
                "/covers/discrete-mathematics.svg", 6, 4.5, 901, "English", "MU-CE-DM-19",
                Arrays.asList("Discrete Maths", "Graph Theory", "Semester 3")));
    }

    public List<Book> findAll() { return new ArrayList<>(books); }

    public Book findById(int id) {
        for (Book b : books) if (b.getId() == id) return b;
        return null;
    }

    /** Free-text search across title, author, ISBN, category and tags. */
    public List<Book> search(String q, String category, Boolean onlyAvailable) {
        String needle = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return books.stream()
                .filter(b -> needle.isEmpty()
                        || b.getTitle().toLowerCase(Locale.ROOT).contains(needle)
                        || b.getAuthor().toLowerCase(Locale.ROOT).contains(needle)
                        || b.getIsbn().contains(needle)
                        || b.getPublisher().toLowerCase(Locale.ROOT).contains(needle)
                        || (b.getTags() != null && b.getTags().stream()
                                .anyMatch(t -> t.toLowerCase(Locale.ROOT).contains(needle))))
                .filter(b -> category == null || category.isEmpty()
                        || "All".equalsIgnoreCase(category)
                        || category.equalsIgnoreCase(b.getCategory()))
                .filter(b -> onlyAvailable == null || !onlyAvailable || b.getAvailableCopies() > 0)
                .collect(Collectors.toList());
    }

    public List<String> categories() {
        return books.stream().map(Book::getCategory).distinct().sorted().collect(Collectors.toList());
    }

    public void add(Book book) {
        int nextId = books.stream().mapToInt(Book::getId).max().orElse(0) + 1;
        book.setId(nextId);
        if (book.getAvailableCopies() == 0) book.setAvailableCopies(book.getTotalCopies());
        books.add(book);
    }

    public boolean remove(int id) {
        return books.removeIf(b -> b.getId() == id);
    }
}
