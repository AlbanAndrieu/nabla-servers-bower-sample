import static java.lang.String.format;
import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;

public class Deployment_IT
{

    private static final transient Logger LOGGER          = LoggerFactory.getLogger(Deployment_IT.class);

    private final static int              MAIN_PORT       = 9090;

    private static final String           DEFAULT_CONTEXT = "";

    private static final String           LOGIN_CONTEXT   = "login";

    private final static String           DEFAULT_URL     = "http://localhost:" + MAIN_PORT;

    private static String                 BASE_URL        = Deployment_IT.DEFAULT_URL + "/" + DEFAULT_CONTEXT;

    private static String                 LOGIN_URL       = Deployment_IT.BASE_URL + LOGIN_CONTEXT;

    @BeforeClass
    public static void setUp() throws InterruptedException
    {

        Deployment_IT.BASE_URL = System.getProperty("webdriver.base.url");

        if (null == Deployment_IT.BASE_URL)
        {
            System.out.println("Use default webdriver.base.url");
            Deployment_IT.BASE_URL = Deployment_IT.DEFAULT_URL + "/" + DEFAULT_CONTEXT;
            System.setProperty("webdriver.base.url", Deployment_IT.BASE_URL);
        }
        System.out.println("webdriver.base.url is : " + Deployment_IT.BASE_URL + "\n");

        Deployment_IT.LOGIN_URL = Deployment_IT.BASE_URL + Deployment_IT.LOGIN_CONTEXT;

        System.out.println("URL updated to : " + Deployment_IT.LOGIN_URL + "\n");

    }

    public static int getResponseCode(String urlString) throws MalformedURLException, IOException
    {
        URL u = new URL(urlString);
        HttpURLConnection.setFollowRedirects(false);
        HttpURLConnection huc = (HttpURLConnection) u.openConnection();
        huc.setRequestMethod("GET");
        // huc.setRequestMethod("HEAD");
        huc.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
        huc.connect();
        return huc.getResponseCode();
    }

    @Test
    public void testBaseUrl() throws Exception
    {

        Deployment_IT.LOGGER.info("Testing URL : {}", Deployment_IT.BASE_URL);

        int service_response = getResponseCode(Deployment_IT.BASE_URL);

        assertEquals(format("Error getting main screen for %s at address %s", Deployment_IT.DEFAULT_CONTEXT, Deployment_IT.BASE_URL), HttpURLConnection.HTTP_OK, service_response);

        int good_service_response = getResponseCode(Deployment_IT.BASE_URL + "index.html");

        assertEquals(format("Error getting main screen for %s at address %s", Deployment_IT.DEFAULT_CONTEXT, Deployment_IT.BASE_URL), HttpURLConnection.HTTP_OK, good_service_response);
    }

    @Test
    @Ignore
    public void testProxyUrl() throws Exception
    {

        Deployment_IT.LOGGER.info("Testing URL : {}", Deployment_IT.LOGIN_URL);

        int service_response = getResponseCode(Deployment_IT.LOGIN_URL);

        assertEquals(format("Error getting main screen for %s at address %s", Deployment_IT.DEFAULT_CONTEXT, Deployment_IT.LOGIN_URL), HttpURLConnection.HTTP_MOVED_TEMP, service_response);

        int good_service_response = getResponseCode(Deployment_IT.LOGIN_URL + "/");

        assertEquals(format("Error getting main screen for %s at address %s", Deployment_IT.DEFAULT_CONTEXT, Deployment_IT.LOGIN_URL), HttpURLConnection.HTTP_MOVED_TEMP, good_service_response);
    }

    @Test
    public void testBaseRest() throws Exception
    {

        Deployment_IT.LOGGER.info("Testing URL : {}", Deployment_IT.BASE_URL);

        Client webClient = Client.create();

        ClientResponse docResponse = webClient.resource(Deployment_IT.BASE_URL).get(ClientResponse.class);
        docResponse.getEntity(String.class);

        assertEquals(format("Error getting login screen for %s at address %s", DEFAULT_CONTEXT, LOGIN_URL), 200, docResponse.getStatus());
    }

    @Test
    @Ignore
    public void testLogin() throws Exception
    {

        // TODO
        // It might required mocking database
    }

}
