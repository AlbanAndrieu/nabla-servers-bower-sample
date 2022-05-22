package com.test.project.sample;

import org.junit.Assert;
import org.junit.Test;

public class JavaCodeTest {
    @Test
    public void test() {
        Assert.assertEquals("Domestic", JavaCode.getCurrencyType(JavaCode.JavaEnum.DOMESTIC));
        Assert.assertEquals("Foreign", JavaCode.getCurrencyType(JavaCode.JavaEnum.FOREIGN));
        Assert.assertEquals("All", JavaCode.getCurrencyType(JavaCode.JavaEnum.ALL));
    }
}
