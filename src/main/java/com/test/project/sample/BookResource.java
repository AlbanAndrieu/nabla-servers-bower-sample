package com.test.project.sample;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * REST resource listing sample books.
 */
@Path("/books")
public final class BookResource {

  /** Number of sample books. */
  private static final int BOOK_COUNT = 10;

  /** Sample books. */
  private final Set<Book> books = new HashSet<>();

  /** Fills the sample books. */
  public BookResource() {
    for (int i = 0; i < BOOK_COUNT; i++) {
      books.add(new Book(i, "Title " + i, "Author " + i));
    }
  }

  /**
   * Lists the books.
   *
   * @return all books
   */
  @GET
  public Collection<Book> list() {
    return books;
  }

  /**
   * Liveness probe used by the Docker healthcheck.
   *
   * @return Test
   */
  @GET
  @Path("test")
  @Produces(MediaType.TEXT_PLAIN)
  public String test() {
    return "Test";
  }

  @Override
  public String toString() {
    final StringBuilder str = new StringBuilder("books: [");
    for (final Book book : books) {
      str.append("book: [").append(book).append("] ");
    }
    return str.append(" ]").toString();
  }
}
