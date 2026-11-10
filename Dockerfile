# syntax=docker/dockerfile:1

# AngularJS libraries (npm) and compiled SCSS, see scripts/build-frontend.mjs
FROM node:26-slim AS FRONTEND

WORKDIR /front

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

COPY app app
COPY scripts/build-frontend.mjs scripts/
RUN node scripts/build-frontend.mjs

FROM eclipse-temurin:25-jdk-resolute AS BUILD

WORKDIR /build

COPY . .
COPY --from=FRONTEND /front/app/vendor app/vendor
COPY --from=FRONTEND /front/app/styles/main.css app/styles/main.css

# the Cloudflare Access service token is a build secret: it never lands in a layer
RUN --mount=type=cache,target=/root/.m2 \
    --mount=type=secret,id=cf_access_client_id,env=CF_ACCESS_CLIENT_ID \
    --mount=type=secret,id=cf_access_client_secret,env=CF_ACCESS_CLIENT_SECRET \
    if [ -n "${CF_ACCESS_CLIENT_ID:-}" ]; then set -- -s settings.xml; fi; \
    ./mvnw --batch-mode package -DskipTests -Dmaven.exec.skip=true "$@"

RUN mkdir jetty-home && tar -xzf target/dependency/jetty-home.tar.gz --strip-components=1 -C jetty-home

FROM eclipse-temurin:25-jre-resolute AS RUNTIME

LABEL name="nabla-servers-bower-sample" vendor="TEST" version="2.3.0"
LABEL description="Nabla bower sample war running on Jetty 12"

ARG UID=2000
ARG GID=2000
RUN groupadd -g ${GID} jenkins && \
    useradd --uid ${UID} --gid ${GID} --create-home jenkins

ENV JETTY_HOME=/opt/jetty-home \
    JETTY_BASE=/var/lib/jetty

COPY --from=BUILD /build/jetty-home ${JETTY_HOME}

WORKDIR ${JETTY_BASE}
# former web.xml GzipFilter/QoSFilter
# shortcut: no DoSFilter equivalent, Jetty 12.1.15 etc/jetty-dos.xml cannot start (wrong class and constructor),
# rate limit at the ingress or add the "dos" module once Jetty fixes it
RUN java -jar ${JETTY_HOME}/start.jar --add-modules=server,http,ee10-deploy,compression-gzip,qos && \
    printf '%s\n' jetty.qos.maxRequestCount=50 >> start.d/qos.ini && \
    chown -R jenkins:jenkins ${JETTY_BASE}

COPY --from=BUILD --chown=jenkins:jenkins /build/target/test.war webapps/ROOT.war

USER jenkins

EXPOSE 8080

HEALTHCHECK CMD ["curl", "--fail", "http://localhost:8080/rest/books/test"]

ENTRYPOINT ["java", "-jar", "/opt/jetty-home/start.jar"]
