# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jdk AS BUILD

WORKDIR /build

COPY . .

# frontend (npm/bower/grunt) is skipped, the war ships the committed app/ sources
# the Cloudflare Access service token is a build secret: it never lands in a layer
RUN --mount=type=cache,target=/root/.m2 \
    --mount=type=secret,id=cf_access_client_id,env=CF_ACCESS_CLIENT_ID \
    --mount=type=secret,id=cf_access_client_secret,env=CF_ACCESS_CLIENT_SECRET \
    if [ -n "${CF_ACCESS_CLIENT_ID:-}" ]; then set -- -s settings.xml; fi; \
    ./mvnw --batch-mode package -DskipTests -Dmaven.exec.skip=true "$@"

FROM eclipse-temurin:21-jre AS RUNTIME

LABEL name="nabla-servers-bower-sample" vendor="TEST" version="2.3.0"
LABEL description="Nabla bower sample war running on jetty-runner"

ARG UID=2000
ARG GID=2000
RUN groupadd -g ${GID} jenkins && \
    useradd --uid ${UID} --gid ${GID} --create-home jenkins

COPY --from=BUILD /build/target/test.war /build/target/dependency/jetty-runner.jar /opt/
WORKDIR /opt/

USER jenkins

EXPOSE 8080

HEALTHCHECK CMD ["curl", "--fail", "http://localhost:8080/"]

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/opt/jetty-runner.jar"]
CMD ["/opt/test.war"]
