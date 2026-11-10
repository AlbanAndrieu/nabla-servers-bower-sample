package com.test.project.sample;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.Set;

/**
 * JAX-RS application registering the REST resources.
 */
@ApplicationPath("/")
@SuppressWarnings("PMD.AtLeastOneConstructor")
public final class MyApplication extends Application {

  @Override
  public Set<Class<?>> getClasses() {
    return Set.of(BookResource.class);
  }
}
