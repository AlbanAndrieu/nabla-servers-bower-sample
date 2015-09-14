package com.test.project.sample

import static org.junit.Assert.assertEquals
import groovyx.net.http.HttpResponseDecorator
import groovyx.net.http.HttpResponseException

import org.junit.Ignore
import org.junit.Test

@Ignore("fix the test")
class TestApi_IT {

    private TestRestClient client;

    void setUp() {
        this.client = new TestRestClient();
    }

    @Test
    void testDocFXOContract() {
        // Given
        String docUrl = "http://" + this.client.server + ":" + this.client.port + "/" + this.client.productName + "/doc/1.0/contract/test/";

        // When
        HttpResponseDecorator docResponse = getData(docUrl);

        // Then
        if (docResponse.status != 200) {
            fail("Doc has been not found, check if contract definition json file is deployed.");
        }
        assertEquals(200, docResponse.status);
    }

    private HttpResponseDecorator getData(String address) {
        try
        {
            return client.getData(address, "text/html");
        }
        catch(HttpResponseException ex)
        {
            HttpResponseException httpEx = (HttpResponseException)ex;
            Object data = httpEx.getResponse().getData();
            throw new RuntimeException(String.valueOf(data),ex);
        }
    }

}
