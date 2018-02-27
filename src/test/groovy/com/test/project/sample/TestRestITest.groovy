package com.test.project.sample

import static org.junit.Assert.assertEquals
import groovyx.net.http.HttpResponseDecorator
import groovyx.net.http.HttpResponseException

import org.junit.BeforeClass
import org.junit.Test

@Ignore("No rest service")
class TestRestITest extends GroovyTestCase {

    private TestRestClient client;

	@BeforeClass
    void setUp() {
        this.client = new TestRestClient();
    }

    @Test
    void testBasicRest() {
        // Given
        String docUrl = "http://" + this.client.server + ":" + this.client.port + "/" + this.client.productName;

        // When
        HttpResponseDecorator docResponse = getData(docUrl);

        // Then
        if (docResponse.status != 200) {
            fail("Test has been not found, check if contract definition json file is deployed.");
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
