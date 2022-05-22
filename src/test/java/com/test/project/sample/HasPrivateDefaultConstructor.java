package com.test.project.sample;

import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.hamcrest.Matcher;

/**
 * Tests whether a class has a private default constructor (aka: shut sonar up).
 */
public class HasPrivateDefaultConstructor extends BaseMatcher<Class<?>> {

    /**
     * Create a new {@link HasPrivateDefaultConstructor}.
     */
    public HasPrivateDefaultConstructor() {
    }

    @Override
    public boolean matches(final Object item) {
        try {
            final Class<?> clazz = (Class<?>) item;
            final Constructor<?> constructor = clazz.getDeclaredConstructor();
            constructor.setAccessible(true);
            return Modifier.isPrivate(constructor.getModifiers()) && clazz.isInstance(constructor.newInstance());
        } catch (final NoSuchMethodException | InstantiationException | ClassCastException e) {
            return false;
        } catch (final SecurityException | ReflectiveOperationException e) {
            return true;
        }
    }

    @Override
    public void describeTo(final Description description) {
        description.appendText("class has private default constructor");
    }

    /**
     * Creates a matcher that matches when the examined class has a private default constructor.
     *
     * For example:
     *
     * <pre>
     * assertThat(HasPrivateDefaultConstructor.class, not(hasPrivateDefaultConstructor()));
     * </pre>
     */
    public static Matcher<Class<?>> hasPrivateDefaultConstructor() {
        return new HasPrivateDefaultConstructor();
    }

}
