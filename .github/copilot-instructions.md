# Copilot Instructions for nabla-servers-bower-sample

## Project Overview
This is a Maven-based Java web application that demonstrates a Bower sample with Jetty server deployment. The project combines:
- **Backend**: Java 11+ with JAX-RS (Jersey) REST APIs
- **Server**: Eclipse Jetty 9.4.x embedded server
- **Frontend**: HTML/JavaScript/CSS assets in the `app/` directory
- **Build**: Maven 3.x with custom profiles and configurations

## Project Structure
```
├── src/
│   ├── main/
│   │   ├── java/              # Java source code
│   │   │   └── com/test/project/sample/
│   │   ├── resources/          # Application resources
│   │   └── webapp/WEB-INF/     # Web application configuration
│   └── test/
│       └── java/              # Test code
├── app/                       # Frontend assets (HTML, CSS, JS)
├── pom.xml                    # Maven build configuration
└── target/                    # Build output directory
```

## Build Configuration

### Maven Configuration
- **GroupId**: `com.nabla.project.sample`
- **ArtifactId**: `bower-sample`
- **Packaging**: WAR (Web Application Archive)
- **Java Version**: 11
- **Jetty Version**: 9.4.19.v20190610

### Key Maven Properties
```xml
<jetty.port>9090</jetty.port>
<jetty.stop.port>8089</jetty.stop.port>
<maven.exec.skip>true</maven.exec.skip>  <!-- Skip frontend build -->
```

### Important Maven Settings
The project requires a custom Maven settings file to use Maven Central instead of private Nexus repository:
```bash
./mvnw <goal> -s /tmp/maven-settings.xml
```

## Building the Project

### Standard Build (Java only)
```bash
./mvnw clean package -DskipTests -Dmaven.exec.skip=true -s /tmp/maven-settings.xml
```

### Full Build (with frontend)
```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true ./mvnw clean package -s /tmp/maven-settings.xml
```

### Compilation Only
```bash
./mvnw clean compile -DskipTests -Dmaven.exec.skip=true -s /tmp/maven-settings.xml
```

## Running the Application

### Using Jetty Maven Plugin
```bash
./mvnw jetty:run -s /tmp/maven-settings.xml -Dmaven.exec.skip=true
```
- Access at: `http://localhost:9090/test/`
- REST API at: `http://localhost:9090/test/rest/books/test`

### Using Standalone JAR
```bash
java -cp target/test.war com.test.project.sample.App
```

## Testing

### Run Unit Tests
```bash
./mvnw test -s /tmp/maven-settings.xml
```

### Run Integration Tests
```bash
./mvnw verify -Prun-integration-test -s /tmp/maven-settings.xml
```

### Test REST Endpoints (when server is running)
```bash
curl http://localhost:9090/test/rest/books/test
# Expected response: "Test"
```

## Key Java Classes

### Main Application Class
- **File**: `src/main/java/com/test/project/sample/App.java`
- **Purpose**: Main entry point, sets up embedded Jetty server
- **Port**: 8080 (when run standalone)

### REST Resources
- **File**: `src/main/java/com/test/project/sample/BookResource.java`
- **Base Path**: `/rest/books`
- **Endpoints**:
  - `GET /rest/books/test` - Returns "Test"

### Integration Tests
- **File**: `src/test/java/com/test/project/sample/DeploymentITest.java`
- **Purpose**: Tests deployment and REST endpoints
- **Configuration**: Uses `webdriver.base.url` system property

## Common Issues and Solutions

### Issue: Parent POM not found
**Solution**: The parent POM is commented out in favor of standalone configuration. Ensure you have:
```xml
<groupId>com.nabla.project.sample</groupId>
<artifactId>bower-sample</artifactId>
```

### Issue: NPM/Puppeteer download fails
**Solution**: Set environment variable to skip Chromium download:
```bash
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### Issue: Missing properties (asm.ow2.version, mapstruct.version)
**Solution**: These are now defined in pom.xml:
```xml
<asm.ow2.version>9.2</asm.ow2.version>
<mapstruct.version>1.5.5.Final</mapstruct.version>
```

### Issue: Web resources directory not found (dist)
**Solution**: Changed to use `app/` directory:
```xml
<webResources>
  <resource>
    <directory>app</directory>
  </resource>
</webResources>
```

### Issue: Port conflicts
**Solution**: Configure ports in pom.xml or use system properties:
```bash
./mvnw jetty:run -Djetty.port=8080 -Djetty.stop.port=8081
```

## Development Guidelines

### Adding New REST Endpoints
1. Create or modify classes in `src/main/java/com/test/project/sample/`
2. Use JAX-RS annotations (`@Path`, `@GET`, `@POST`, etc.)
3. Register in Jersey configuration (see `App.java` or `MyApplication.java`)

### Modifying Frontend Assets
1. Edit files in `app/` directory
2. Static files are served directly by Jetty
3. No build step required for basic HTML/CSS/JS changes

### Adding Dependencies
1. Add to `<dependencies>` section in `pom.xml`
2. Specify version using a property for consistency
3. Ensure dependency is available in Maven Central

## Maven Profiles

### jetty9x (default)
- Activates Jetty 9.x container
- Port: 9090 (configurable via `jetty.port`)
- Context path: `/test`

### run-integration-test
- Runs integration tests with embedded Jetty
- Automatically starts/stops server

## Debugging

### Enable Maven Debug Output
```bash
./mvnw -X <goal>
```

### Remote Debug Jetty
```bash
MAVEN_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005" \
  ./mvnw jetty:run
```

### View Jetty Logs
Logs are output to console during `mvn jetty:run`

## Best Practices for Code Changes

1. **Minimal Changes**: Only modify files directly related to your task
2. **Test After Changes**: Always run `mvn clean package` to verify build
3. **Integration Tests**: Run integration tests before committing
4. **Dependencies**: Check Maven Central availability before adding new dependencies
5. **Properties**: Use Maven properties for versions, not hardcoded values
6. **Web Resources**: Place static files in `app/` directory, not `dist/`

## Troubleshooting Build Failures

1. Clean Maven cache: `rm -rf ~/.m2/repository/com/nabla/`
2. Verify Java version: `java -version` (should be 11+)
3. Check Maven settings: Ensure using Maven Central, not private Nexus
4. Skip problematic plugins: Use `-Dmaven.exec.skip=true` to skip frontend build

## Contact and Resources

- **Repository**: https://github.com/AlbanAndrieu/nabla-servers-bower-sample
- **Issues**: https://github.com/AlbanAndrieu/nabla-servers-bower/issues
- **Jetty Documentation**: https://www.eclipse.org/jetty/documentation/9.4.x/
- **Jersey Documentation**: https://eclipse-ee4j.github.io/jersey/
