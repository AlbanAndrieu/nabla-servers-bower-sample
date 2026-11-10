package com.test.project.sample;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;

/**
 * A book listed by {@link BookResource}.
 */
public final class Book {

  /** ISBN, never null. */
  private Integer isbn;

  /** Title. */
  private String title;

  /** Author. */
  private String author;

  /** MOXy needs it to write the JSON of /rest/books. */
  private Book() {
  }

  /**
   * Book without title nor author.
   *
   * @param anIsbn ISBN
   */
  public Book(@Nonnull @Nonnegative final Integer anIsbn) {
    this(anIsbn, null, null);
  }

  /**
   * Book.
   *
   * @param anIsbn ISBN
   * @param aTitle title
   * @param anAuthor author
   */
  public Book(@Nonnull @Nonnegative final Integer anIsbn,
      final String aTitle, final String anAuthor) {
    if (anIsbn == null) {
      throw new IllegalArgumentException("ISBN cannot be null");
    }
    this.isbn = anIsbn;
    this.title = aTitle;
    this.author = anAuthor;
  }

  /**
   * Title.
   *
   * @return the title
   */
  public String getTitle() {
    return title;
  }

  /**
   * Sets the title.
   *
   * @param aTitle the title
   */
  public void setTitle(final String aTitle) {
    this.title = aTitle;
  }

  /**
   * Author.
   *
   * @return the author
   */
  public String getAuthor() {
    return author;
  }

  /**
   * Sets the author.
   *
   * @param anAuthor the author
   */
  public void setAuthor(final String anAuthor) {
    this.author = anAuthor;
  }

  /**
   * ISBN.
   *
   * @return the ISBN
   */
  public Integer getIsbn() {
    return isbn;
  }

  /**
   * Sets the ISBN.
   *
   * @param anIsbn the ISBN
   */
  public void setIsbn(final Integer anIsbn) {
    this.isbn = anIsbn;
  }

  @Override
  public String toString() {
    return "isbn: " + isbn + " title: " + title + " author: " + author;
  }
}
