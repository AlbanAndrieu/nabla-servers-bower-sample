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

    public void say(String s)
    {
        System.out.println(s);
    }

    public void version()
    {
        Package p = this.getClass().getPackage();
        System.out.println("Hello Specification Version : " + p.getSpecificationVersion());
        System.out.println("Hello Implementation Version : " + p.getImplementationVersion());
    }

    public static void main(String[] args)
    {

        new App().say("Hello World!");
        int i = 0, j;
        String arg;
        char flag;
        boolean vflag = false;
        String outputfile = "";

        while (i < args.length && args[i].startsWith("-"))
        {
            arg = args[i++];

            // use this type of check for "wordy" arguments
            if (arg.equals("-verbose"))
            {
                System.out.println("verbose mode on");
                vflag = true;
            }
            if (arg.equals("-version"))
            {
                System.out.println("Display version");
                new App().version();
                // Terminate JVM
                System.exit(0);
            }
            // use this type of check for arguments that require arguments
            else if (arg.equals("-output"))
            {
                if (i < args.length)
                    outputfile = args[i++];
                else
                    System.err.println("-output requires a filename");
                if (vflag)
                    System.out.println("output file = " + outputfile);
            }

            // use this type of check for a series of flag arguments
            else
            {
                for (j = 1; j < arg.length(); j++)
                {
                    flag = arg.charAt(j);
                    switch (flag)
                    {
                        case 'x':
                            if (vflag)
                                System.out.println("Option x");
                            break;
                        case 'n':
                            if (vflag)
                                System.out.println("Option n");
                            break;
                        default:
                            System.err.println("ParseCmdLine: illegal option " + flag);
                            break;
                    }
                }
            }

            if (i == args.length)
                System.err.println("Usage: ParseCmdLine [-verbose] [-version] [-xn] [-output afile] filename");
            else
                System.out.println("Success!");
        }

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
