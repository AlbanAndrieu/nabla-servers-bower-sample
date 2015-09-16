package com.test.project.sample

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseDecorator
import groovyx.net.http.RESTClient

class TestRestClient {

    private final String server      = "localhost";
    private String port;
    private final String DEFAULT_PORT = "9090";
    private final String productName = "rest/books";

    private RESTClient RestClient;

    public TestRestClient() {

        port = System.getProperty("jetty.port");
        if (null == port) {
            System.out.println("Use default jetty.port");
            port = DEFAULT_PORT;
            System.setProperty("jetty.port", port);
        }

        final String connectString = "http://" + this.server + ":" + this.port + "/" + this.productName ;

        setRestClient(connectString);
    }

    public TestRestClient(String connectString) {

        setRestClient(connectString);
    }

    private void setRestClient(final connectString) {

        this.RestClient = new RESTClient(connectString);
        //this.RestClient.auth.basic 'nabla', 'microsoft'

        println(connectString);
    }

    public RESTClient getRestClient() {

        return this.RestClient;
    }

    public HttpResponseDecorator getData(final String path, final HashMap query, final String contentTypeString) {

        HashMap paramsMap = new HashMap();

        paramsMap.put("path", path);
        paramsMap.put("query", query);
        paramsMap.put("requestContentType", contentTypeString);

        HttpResponseDecorator response = this.RestClient.get(paramsMap);

        return response;
    }

    public HttpResponseDecorator getData(final String path, final String contentTypeString) {

        HashMap paramsMap = new HashMap();

        paramsMap.put("path", path);
        paramsMap.put("requestContentType", contentTypeString);

        HttpResponseDecorator response = this.RestClient.get(paramsMap);

        return response;
    }

    public HttpResponseDecorator postData(final String path, final String body, final String contentTypeString, final Map headers) {
        def http = new HTTPBuilder( "http://" + this.server + ":" + this.port + "/" + this.productName + "/test" )
        //http.auth.basic 'nabla', 'microsoft'

        http.post( path: 'Trade', body: body,
        requestContentType: 'application/json' ) { resp ->

            println "Tweet response status: ${resp.statusLine}"
            assert resp.statusLine.statusCode == 200
        }

        return null;
    }
}
