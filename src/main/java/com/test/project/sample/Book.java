package com.test.project.sample;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;

public class Book {

    private Integer isbn;
    private String title;
    private String author;

    public Book() {
        throw new AssertionError();
    }

    public Book(@Nonnull @Nonnegative Integer aIsbn, String aTitle, String anAuthor) {

        this.isbn = aIsbn;
        this.title = aTitle;
        this.author = anAuthor;

        if (null == this.isbn)
        {
            throw new IllegalArgumentException("ISBN cannot be null");
        }

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getIsbn() {
        return isbn;
    }

    public void setIsbn(Integer isbn) {
        this.isbn = isbn;
    }
}
