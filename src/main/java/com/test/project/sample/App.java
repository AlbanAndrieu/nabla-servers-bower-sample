package com.test.project.sample;

import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.server.Server;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Embedded Jetty launcher serving {@link BookResource} without the war.
 */
public final class App {

  /** Port of the embedded server. */
  private static final int PORT = 8080;

  /** Logger. */
  private static final Logger LOGGER = LoggerFactory.getLogger(App.class);

  /** Launcher only. */
  private App() {
  }

  /**
   * Starts Jetty and blocks until it stops.
   *
   * @param args ignored
   * @throws Exception when Jetty cannot start
   */
  public static void main(final String[] args) throws Exception {
    final ServletContextHandler context =
        new ServletContextHandler(ServletContextHandler.SESSIONS);
    context.setContextPath("/");

    final ServletHolder jersey =
        context.addServlet(ServletContainer.class, "/*");
    jersey.setInitOrder(0);
    jersey.setInitParameter("jersey.config.server.provider.classnames",
        BookResource.class.getCanonicalName());

    final Server server = new Server(PORT);
    server.setHandler(context);
    try {
      server.start();
      LOGGER.info("Listening on port {}", PORT);
      server.join();
    } finally {
      server.destroy();
    }
  }
}
