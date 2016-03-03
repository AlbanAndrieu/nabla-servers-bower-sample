package com.test.project.sample;

import org.junit.Assert;
import org.junit.Test;

public class BookUTest {


    public static final Integer DEFAULT_EXPECTED_ISBN = new Integer(1_000);
    public static final String DEFAULT_TITLE = "Bible";
    public static final String DEFAULT_AUTHOR = "God";

    @Test(expected = AssertionError.class)
    public final void testEmptyContructor()
    {

        final Book book = new Book();
        Assert.assertNotNull(book);

    }

    @Test(expected = IllegalArgumentException.class)
    public final void testProductNull()
    {

        //@SuppressWarnings("null")
        final Book book = new Book(null, null, null);
        Assert.assertNotNull(book);

    }

    @Test
    public final void testGetter()
    {

        final Book book = new Book(DEFAULT_EXPECTED_ISBN, DEFAULT_TITLE, DEFAULT_AUTHOR);

        Assert.assertEquals(book.getIsbn(), BookUTest.DEFAULT_EXPECTED_ISBN);
        Assert.assertEquals(book.getTitle(), BookUTest.DEFAULT_TITLE);
        Assert.assertEquals(book.getAuthor(), BookUTest.DEFAULT_AUTHOR);
    }

}
