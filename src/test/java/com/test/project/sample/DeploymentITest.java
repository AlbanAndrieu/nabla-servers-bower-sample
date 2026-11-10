package com.test.project.sample;

import static java.net.HttpURLConnection.HTTP_OK;
import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.Test;

/**
 * Checks a deployed war, see the run-integration-test profile.
 */
@SuppressWarnings("PMD.AtLeastOneConstructor")
public final class DeploymentITest {

  /** Root of the deployed application, ending with a slash. */
  private static final String BASE_URL = System.getProperty(
      "webdriver.base.url", "http://localhost:9090/test/");

  /** HTTP client, it does not follow redirects. */
  private static final HttpClient CLIENT = HttpClient.newHttpClient();

  /**
   * GET a path below the application root.
   *
   * @param path relative path
   * @return the response
   * @throws IOException on network failure
   * @throws InterruptedException when interrupted
   */
  private static HttpResponse<String> get(final String path)
      throws IOException, InterruptedException {
    final HttpRequest request =
        HttpRequest.newBuilder(URI.create(BASE_URL + path)).build();
    return CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
  }

  /**
   * The home page is served.
   *
   * @throws IOException on network failure
   * @throws InterruptedException when interrupted
   */
  @Test
  public void testBaseUrl()
      throws IOException, InterruptedException {
    assertEquals(BASE_URL, HTTP_OK, get("").statusCode());
    assertEquals(BASE_URL, HTTP_OK, get("index.html").statusCode());
  }

  /**
   * The REST test endpoint answers Test.
   *
   * @throws IOException on network failure
   * @throws InterruptedException when interrupted
   */
  @Test
  public void testBaseRest()
      throws IOException, InterruptedException {
    final HttpResponse<String> response = get("rest/books/test");
    assertEquals(BASE_URL, HTTP_OK, response.statusCode());
    assertEquals("Test", response.body());
  }
}
