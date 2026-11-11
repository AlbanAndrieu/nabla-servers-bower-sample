package com.test.project.sample;

import static com.test.project.sample.HasPrivateDefaultConstructor.hasPrivateDefaultConstructor;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import org.junit.Test;

/**
 * Unit tests of {@link Book}.
 */
@SuppressWarnings("PMD.AtLeastOneConstructor")
public final class BookUTest {

  /** ISBN of the sample book. */
  private static final Integer ISBN = 1_000;

  /** Title of the sample book. */
  private static final String TITLE = "Bible";

  /** Author of the sample book. */
  private static final String AUTHOR = "God";

  /** A book needs an ISBN. */
  @Test(expected = IllegalArgumentException.class)
  public void testNullIsbn() {
    new Book(null, null, null);
  }

  /** The ISBN-only constructor leaves title and author empty. */
  @Test
  public void testConstructorWithIsbn() {
    final Book book = new Book(0);
    assertEquals(Integer.valueOf(0), book.getIsbn());
    assertEquals(null, book.getTitle());
  }

  /** MOXy writes /rest/books through the private no-arg constructor. */
  @Test
  public void testPrivateDefaultConstructor() {
    assertThat(Book.class, hasPrivateDefaultConstructor());
  }

  /** Getters return the constructor values. */
  @Test
  public void testGetters() {
    final Book book = new Book(ISBN, TITLE, AUTHOR);
    assertEquals(ISBN, book.getIsbn());
    assertEquals(TITLE, book.getTitle());
    assertEquals(AUTHOR, book.getAuthor());
  }
}
