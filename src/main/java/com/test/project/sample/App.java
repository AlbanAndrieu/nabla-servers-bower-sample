package com.test.project.sample;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class App
{

    private static final transient Logger LOGGER = LoggerFactory.getLogger(App.class);

    private App()
    {
    }

    public static void main(String[] args)
    {
        final ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        final Server jettyServer = new Server(8080);
        jettyServer.setHandler(context);

        final ServletHolder jerseyServlet = context.addServlet(org.glassfish.jersey.servlet.ServletContainer.class, "/*");
        jerseyServlet.setInitOrder(0);

        // Tells the Jersey Servlet which REST service/class to load.
        jerseyServlet.setInitParameter("jersey.config.server.provider.classnames", BookResource.class.getCanonicalName());

        try
        {
            jettyServer.start();
            jettyServer.join();
        } catch (Exception e)
        {
            App.LOGGER.info("Jetty failure : ", e);
        } finally
        {
            jettyServer.destroy();
        }
    }
}
