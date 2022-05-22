package com.test.project.sample;

import static java.lang.String.format;
import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeploymentITest {

	private static final transient Logger LOGGER = LoggerFactory.getLogger(DeploymentITest.class);

	private final static int MAIN_PORT = 9090;

	private static final String DEFAULT_CONTEXT = "/test/";

	private static final String LOGIN_CONTEXT = "#/";

	private final static String DEFAULT_URL = "http://localhost:" + MAIN_PORT;

	private static String BASE_URL = DeploymentITest.DEFAULT_URL + DEFAULT_CONTEXT;

	private static String LOGIN_URL = DeploymentITest.BASE_URL + LOGIN_CONTEXT;

	/*
	 * fix for Exception in thread "main" javax.net.ssl.SSLHandshakeException:
	 * sun.security.validator.ValidatorException: PKIX path building failed:
	 * sun.security.provider.certpath.SunCertPathBuilderException: unable to find
	 * valid certification path to requested target
	 */
	static TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
		public java.security.cert.X509Certificate[] getAcceptedIssuers() {
			return null;
		}

		public void checkClientTrusted(X509Certificate[] certs, String authType) {
		}

		public void checkServerTrusted(X509Certificate[] certs, String authType) {
		}

	} };

	@BeforeClass
	public static void setUp() throws InterruptedException, NoSuchAlgorithmException, KeyManagementException {

		DeploymentITest.BASE_URL = System.getProperty("webdriver.base.url");

		if (null == DeploymentITest.BASE_URL) {
			System.out.println("Use default webdriver.base.url");
			DeploymentITest.BASE_URL = DeploymentITest.DEFAULT_URL + DEFAULT_CONTEXT;
			System.setProperty("webdriver.base.url", DeploymentITest.BASE_URL);
		}
		System.out.println("webdriver.base.url is : " + DeploymentITest.BASE_URL + "\n");

		DeploymentITest.LOGIN_URL = DeploymentITest.BASE_URL + DeploymentITest.LOGIN_CONTEXT;

		System.out.println("URL updated to : " + DeploymentITest.LOGIN_URL + "\n");

		SSLContext sc = SSLContext.getInstance("SSL");

		sc.init(null, trustAllCerts, new java.security.SecureRandom());
		HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

		// Create all-trusting host name verifier
		HostnameVerifier allHostsValid = new HostnameVerifier() {
			public boolean verify(String hostname, SSLSession session) {
				return true;
			}
		};
		// Install the all-trusting host verifier
		HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
	}

	public static int getResponseCode(String urlString) throws MalformedURLException, IOException {
		URL u = new URL(urlString);
		HttpURLConnection.setFollowRedirects(false);
		HttpURLConnection huc = (HttpURLConnection) u.openConnection();
		huc.setRequestMethod("GET");
		// huc.setRequestMethod("HEAD");
		huc.setRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
		huc.connect();
		return huc.getResponseCode();
	}

	@Test
	public void testBaseUrl() throws Exception {

		DeploymentITest.LOGGER.info("Testing URL : {}", DeploymentITest.BASE_URL);

		int service_response = getResponseCode(DeploymentITest.BASE_URL);

		assertEquals(format("Error getting main screen for %s at address %s", DeploymentITest.DEFAULT_CONTEXT,
				DeploymentITest.BASE_URL), HttpURLConnection.HTTP_OK, service_response);

		int good_service_response = getResponseCode(DeploymentITest.BASE_URL + "index.html");

		assertEquals(format("Error getting main screen for %s at address %s", DeploymentITest.DEFAULT_CONTEXT,
				DeploymentITest.BASE_URL), HttpURLConnection.HTTP_OK, good_service_response);
	}

	@Test
	@Ignore
	public void testProxyUrl() throws Exception {

		DeploymentITest.LOGGER.info("Testing URL : {}", DeploymentITest.LOGIN_URL);

		int service_response = getResponseCode(DeploymentITest.LOGIN_URL);

		assertEquals(format("Error getting main screen for %s at address %s", DeploymentITest.DEFAULT_CONTEXT,
				DeploymentITest.LOGIN_URL), HttpURLConnection.HTTP_MOVED_TEMP, service_response);

		int good_service_response = getResponseCode(DeploymentITest.LOGIN_URL + "/");

		assertEquals(format("Error getting main screen for %s at address %s", DeploymentITest.DEFAULT_CONTEXT,
				DeploymentITest.LOGIN_URL), HttpURLConnection.HTTP_MOVED_TEMP, good_service_response);
	}

	@Test
	// @Ignore
	public void testCoverage() throws Exception {
		BookResource resource = new BookResource();
		System.out.println(resource.toString());
		// assertEquals(BOOK_RESOURCE_RESULT, resource.toString());
	}

	@Test
	public void testBaseRest() throws Exception {

		DeploymentITest.LOGGER.info("Testing URL : {}", DeploymentITest.BASE_URL);

		Client client = ClientBuilder.newClient();

		WebTarget webTarget = client.target(DeploymentITest.BASE_URL);
		// webTarget.register(FilterForExampleCom.class);
		WebTarget resourceWebTarget = webTarget.path("rest");
		WebTarget booksTarget = resourceWebTarget.path("books");
		WebTarget booksTestTarget = booksTarget.path("test");

		// WebTarget target =
		// client.target(DeploymentITest.BASE_URL).path("rest/{param}");
		// String result = target.queryParam("param", "value").get(String.class);
		// WebTarget booksTestTarget = client.target(DeploymentITest.BASE_URL +
		// "/rest/books/test");
		// Response responseTest = booksTestTarget.request("text/plain").get();

		// System.out.println("Status : " + responseTest.getStatus());
		// assertEquals(responseTest.getStatus(), 200);
		// System.out.println("Response : " + responseTest.readEntity(String.class));

		// WebTarget helloworldWebTargetWithQueryParam = booksTarget.queryParam("test",
		// "10");

		Invocation.Builder invocationBuilder = booksTestTarget.request(MediaType.TEXT_PLAIN_TYPE);
		invocationBuilder.header("some-header", "true");

		Response responseFull = invocationBuilder.get();
		System.out.println("Status : " + responseFull.getStatus());
		String resultTest = responseFull.readEntity(String.class);
		System.out.println("Response : " + resultTest);

		assertEquals(format("Error getting data at %s", DeploymentITest.BASE_URL + "rest/books/test"),
				HttpURLConnection.HTTP_OK, responseFull.getStatus());

		assertEquals(resultTest, "Test");
	}

	@Test
	//@Ignore
	public void testBaseFullRest() throws Exception {

		DeploymentITest.LOGGER.info("Testing URL : {}", DeploymentITest.BASE_URL);

		Client client = ClientBuilder.newClient();

		WebTarget webTarget = client.target(DeploymentITest.BASE_URL);
		// webTarget.register(FilterForExampleCom.class);
		WebTarget resourceWebTarget = webTarget.path("rest");
		WebTarget booksTarget = resourceWebTarget.path("books");
		WebTarget booksTestTarget = booksTarget.path("test");

		// WebTarget booksTestTarget = booksTarget.path("/{param}");
		// WebTarget result = booksTestTarget.queryParam("param", "value");
		// WebTarget booksTestTarget = client.target(Deployment_IT.BASE_URL +
		// "/rest/books/test");
		Response responseTest = booksTestTarget.request("text/plain").get();

		System.out.println("Status : " + responseTest.getStatus());
		assertEquals(HttpURLConnection.HTTP_OK, responseTest.getStatus());
		System.out.println("Response : " + responseTest.readEntity(String.class));

		// WebTarget helloworldWebTargetWithQueryParam =
		// booksTarget.queryParam("test","10");

		Invocation.Builder invocationBuilder = booksTestTarget.request(MediaType.TEXT_PLAIN_TYPE);
		// invocationBuilder.header("some-header", "true");

		Response responseFull = invocationBuilder.get();
		System.out.println("Status : " + responseFull.getStatus());
		String resultTest = responseFull.readEntity(String.class);
		System.out.println("Response : " + resultTest);

		assertEquals(format("Error getting data at %s", DeploymentITest.BASE_URL + "rest/books/test"),
				HttpURLConnection.HTTP_OK, responseFull.getStatus());

		assertEquals(resultTest, "Test");
	}
}
