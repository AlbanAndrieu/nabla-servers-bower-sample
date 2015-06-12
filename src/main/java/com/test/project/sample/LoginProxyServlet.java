package com.test.project.sample;

import java.net.URI;

import javax.servlet.http.HttpServletRequest;

import org.eclipse.jetty.proxy.ProxyServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoginProxyServlet extends ProxyServlet
{

    private static final long serialVersionUID = 1L;

    private static Logger     LOG              = LoggerFactory.getLogger(LoginProxyServlet.class);

    /*
    @Override
    protected URI rewriteURI(HttpServletRequest request) {
        // Forward all requests to another port on this machine
        String uri = "http://localhost:8060";

        // Take the current path and append it to the new url
        String path = request.getRequestURI();
        uri += path;

        // Add query params
        String query = request.getQueryString();
        if (query != null && query.length() > 0) {
            uri += "?" + query;
        }
        
        LOG.debug("URI is : {}",uri );
        return URI.create(uri).normalize();
    }
     */
}
