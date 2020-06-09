#!/usr/bin/env groovy
@Library(value='jenkins-pipeline-scripts@master', changelog=false) _

String DOCKER_REGISTRY="index.docker.io/v1".trim()
String DOCKER_ORGANISATION="nabla".trim()
String DOCKER_TAG="latest".trim()
//String DOCKER_USERNAME="nabla"
String DOCKER_NAME="ansible-jenkins-slave-docker".trim()

String DOCKER_REGISTRY_URL="https://${DOCKER_REGISTRY}".trim()
String DOCKER_REGISTRY_CREDENTIAL=env.DOCKER_REGISTRY_CREDENTIAL ?: "hub-docker-nabla".trim()
String DOCKER_IMAGE="${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}".trim()

String DOCKER_OPTS_BASIC = getDockerOpts()
String DOCKER_OPTS_COMPOSE = getDockerOpts(isDockerCompose: true, isLocalJenkinsUser: false)

String DOCKER_NAME_BUILD="ansible-jenkins-slave-test".trim()
String DOCKER_BUILD_TAG=dockerTag("temp").trim()
String DOCKER_BUILD_IMG="${DOCKER_ORGANISATION}/${DOCKER_NAME_BUILD}:${DOCKER_BUILD_TAG}".trim()
String DOCKER_RUNTIME_TAG="latest".trim()
String DOCKER_RUNTIME_NAME="nabla-servers-bower-sample-test".trim()
String DOCKER_RUNTIME_IMG="${DOCKER_ORGANISATION}/${DOCKER_RUNTIME_NAME}:${DOCKER_RUNTIME_TAG}".trim()

String RELEASE_VERSION=""
//String GIT_COMMIT_REV=""

def NODES_USED = []

String ARTIFACTS = ['*_VERSION.TXT',
                '**/target/*.log',
                //'**/target/*.jar',
                '**/target/dependency/jetty-runner.jar',
                '**/target/test.war',
                //'**/target/*.zip',
                'reports/*',
                '**/MD5SUMS.md5',
                'package-lock.json',
                'yarn.lock',
                'Jenkinsfile*',
                'Dockerfile*',
                '*.tar.gz'
                ].join(', ')

pipeline {
    //agent none
    agent {
        label 'molecule'
    }
    //agent {
    //    // Equivalent to "docker build -f Dockerfile-jenkins-slave-ubuntu:16.04 --build-arg FILEBEAT_VERSION=6.3.0 ./build/
    //    dockerfile {
    //        //filename 'Dockerfile'
    //        //dir 'build'
    //        label 'molecule'
    //        additionalBuildArgs ' --build-arg JENKINS_USER_HOME=/home/jenkins --label "version=1.0.1" --label "maintaner=Alban Andrieu <alban.andrieu@gmail.com>" '
    //    }
    //}
    parameters {
        string(defaultValue: 'master', description: 'Default git branch to override', name: 'GIT_BRANCH_NAME', trim: true)
        string(defaultValue: '44447', description: 'Default cargo rmi port to override', name: 'CARGO_RMI_PORT', trim: true)
        string(defaultValue: '', description: 'Default workspace suffix to override', name: 'WORKSPACE_SUFFIX', trim: true)
        string(defaultValue: 'http://localhost:9190', description: 'Default URL used by deployment tests', name: 'SERVER_URL', trim: true)
        string(defaultValue: '/test/#/', description: 'Default context', name: 'SERVER_CONTEXT', trim: true)
        string(defaultValue: 'LATEST_SUCCESSFULL', description: 'Create a TAG', name: 'TARGET_TAG', trim: true)
        string(defaultValue: 'jenkins', description: 'User', name: 'TARGET_USER', trim: true)
        booleanParam(defaultValue: false, description: 'Dry run', name: 'DRY_RUN')
        booleanParam(defaultValue: false, description: 'Clean before run', name: 'CLEAN_RUN')
        booleanParam(defaultValue: false, description: 'Debug run', name: 'DEBUG_RUN')
        booleanParam(defaultValue: false, description: 'Debug mvnw', name: 'MVNW_VERBOSE')
        booleanParam(defaultValue: false, name: "RELEASE", description: "Perform release-type build.")
        string(defaultValue: "", name: "RELEASE_BASE", description: "Commit tag or branch that should be checked-out for release", trim: true)
        string(defaultValue: "", name: "RELEASE_VERSION", description: "Release version for artifacts", trim: true)
    }
    environment {
        GIT_BRANCH_NAME = "${params.GIT_BRANCH_NAME}".trim()
        //BRANCH_JIRA = "${env.BRANCH_NAME}".replaceAll("feature/","")
        //PROJECT_BRANCH = "${env.GIT_BRANCH}".replaceFirst("origin/","")
        CARGO_RMI_PORT = "${params.CARGO_RMI_PORT}"
        //WORKSPACE_SUFFIX = "${params.WORKSPACE_SUFFIX}"
        //echo "JOB_NAME: ${env.JOB_NAME} : ${env.JOB_BASE_NAME}"
        //TARGET_PROJECT = sh(returnStdout: true, script: "echo ${env.JOB_NAME} | cut -d'/' -f -1").trim()
        //BRANCH_NAME = "${env.BRANCH_NAME}".replaceAll("feature/","")
        BUILD_ID = "${env.BUILD_ID}"
        DRY_RUN = "${params.DRY_RUN}".toBoolean()
        CLEAN_RUN = "${params.CLEAN_RUN}".toBoolean()
        DEBUG_RUN = "${params.DEBUG_RUN}".toBoolean()
        MVNW_VERBOSE = "${params.MVNW_VERBOSE}".toBoolean()
        SERVER_URL = "${params.SERVER_URL}"
        SERVER_CONTEXT = "${params.SERVER_CONTEXT}"
        RELEASE = "${params.RELEASE}".toBoolean()
        RELEASE_BASE = "${params.RELEASE_BASE}"
        RELEASE_VERSION = "${params.RELEASE_VERSION}"
        GIT_PROJECT = "nabla"
        GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
        GIT_URL = "ssh://git@github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        DOCKER_TAG = dockerTag()
    }
    options {
        skipDefaultCheckout()
        disableConcurrentBuilds()
        skipStagesAfterUnstable()
        parallelsAlwaysFailFast()
        ansiColor('xterm')
        timeout(time: 120, unit: 'MINUTES', activity: true)
        timestamps()
    }
    stages {
        stage('\u2776 Preparation') { // for display purposes
            failFast true
            parallel {
                stage('\u2622 SCM') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            alwaysPull true
                            reuseNode true
                            //registryUrl DOCKER_REGISTRY_URL
                            //registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_BASIC
                            label 'molecule'
                        }
                    }
                    steps {
                        script {

                            if (env.CLEAN_RUN == true) {
                              cleanWs(isEmailEnabled: false, disableDeferredWipeout: true, deleteDirs: true)
                              //cleanStash()
                            }

                            NODES_USED.add(env.NODE_NAME)

                            properties(createPropertyList())
                            getJenkinsOpts()

                            gitCheckoutTEST() {

                                if (!isReleaseBranch()) { abortPreviousRunningBuilds() }

                                getEnvironementData(filePath: "./bm/env/scripts/jenkins/step-2-0-0-build-env.sh", DEBUG_RUN: env.DEBUG_RUN)

                                if (env.DEBUG_RUN) {
sh '''
set -e && id && cat /etc/hostname

exit 0
'''

sh '''
set -e
#set -xve

echo "USER : $USER"
echo "SHELL : $SHELL"

echo "PATH : ${PATH}"
echo "JAVA_HOME : ${JAVA_HOME}"
echo "DISPLAY : ${DISPLAY}"

echo "BUILD_NUMBER : ${BUILD_NUMBER}"
echo "BUILD_ID : ${BUILD_ID}"
echo "GIT_REVISION : ${GIT_REVISION}"

echo "IS_M2RELEASEBUILD: ${IS_M2RELEASEBUILD}"

export ZAP_PORT=8091
export JETTY_PORT=9190
export SERVER_HOST=localhost
#export SERVER_URL="http://localhost:${JETTY_PORT}/"

echo "ZAP_PORT : ${ZAP_PORT}"
echo "CARGO_RMI_PORT : ${CARGO_RMI_PORT}"
echo "JETTY_PORT : ${JETTY_PORT}"
echo "SERVER_HOST : ${SERVER_HOST}"
echo "SERVER_URL : ${SERVER_URL}"
echo "ZAPROXY_HOME : ${ZAPROXY_HOME}"

#TODO
#JAVA_OPTS=-Xms64m -Xmx64m
#SUREFIRE_OPTS=-Xms256m -Xmx256m
#MAVEN_OPTS=-Xms128m -Xmx128m -DargLine=${env.SUREFIRE_OPTS}

#curl -i -v -k ${SERVER_URL}${SERVER_CONTEXT} --data "username=tomcat&password=microsoft"

wget --http-user=admin --http-password=Motdepasse12 "http://albandrieu.com:8280/manager/text/undeploy?path=/test" -O -

#Xvfb :99 -ac -screen 0 1280x1024x24 &
#export DISPLAY=":99"
#nice -n 10 x11vnc 2>&1 &

#google-chrome --no-sandbox &

#killall Xvfb

exit 0
'''

                                  sh "#!/bin/bash \n" +
                                    "whoami \n" +
                                    "source ./scripts/run-python.sh\n" +
                                    "pre-commit run -a || true\n" +
                                    "kubectl --kubeconfig ${params.CONFIG_DIR}/kube.config cluster-info || true\n"
                                } // if
                            } // gitCheckoutTEST

                            echo "DOCKER_OPTS_COMPOSE: ${DOCKER_OPTS_COMPOSE}"
                            echo "DOCKER_OPTS_BASIC: ${DOCKER_OPTS_BASIC}"

                            RELEASE_VERSION = getSemVerReleasedVersion() ?: "LATEST"

                            echo "RELEASE_VERSION: ${RELEASE_VERSION} - ${env.RELEASE_VERSION}"

                            setBuildName("Test project ${RELEASE_VERSION}")
                            //createVersionTextFile("Sample", "TEST_VERSION.TXT")
                            createManifest(description: "Sample", filename: "TEST_VERSION.TXT")

                            echo "GIT_COMMIT_SHORT: ${env.GIT_COMMIT_SHORT}"

                            //printEnvironment()
                            def fields = env.getEnvironment()
                            fields.each {
                                 key, value -> println("${key} = ${value}");
                             }

                            println(env.PATH)

                            sh "printenv | sort"

                            //stash excludes: '**/target/, **/.bower/, **/.tmp/, **/.git, **/.repository/, **/.mvn/, **/bower_components/, **/node/, **/node_modules/, **/npm/, **/coverage/, **/build/, docs/, hooks/, ansible/, screenshots/', includes: '**', name: 'sources'
                            //stash includes: "**/.git/**/*", useDefaultExcludes: false , name: 'git'
                            //stash includes: "**/.mvn/", name: 'sources-tools'

                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>1-1 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage SCM
                stage('\u2756 Build - Docker') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            alwaysPull true
                            reuseNode false
                            args DOCKER_OPTS_COMPOSE
                            label 'molecule'
                        }
                    }
                    environment {
                        CST_CONFIG = "docker/ubuntu18/config-BUILD.yaml"
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release\/.+|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                    }
                    steps {
                        script {

                            checkout scm

                            tee("docker-build.log") {

                                sh 'id jenkins'
                                sh 'ls -lrta /var/run/docker.sock'

                                // this give the registry
                                // sh(returnStdout: true, script: "echo ${DOCKER_BUILD_IMG} | cut -d'/' -f -1").trim()
                                DOCKER_BUILD_ARGS = ["--build-arg JENKINS_USER_HOME=/home/jenkins --build-arg=MICROSCANNER_TOKEN=NzdhNTQ2ZGZmYmEz"].join(" ")
                                if (env.CLEAN_RUN) {
                                    DOCKER_BUILD_ARGS = ["--no-cache",
                                                         "--pull",
                                                         ].join(" ")
                                }
                                DOCKER_BUILD_ARGS = [ "${DOCKER_BUILD_ARGS}",
                                                      "--target build",
                                                      "--label 'version=1.0.0'",
                                                    ].join(" ")

                                docker.withRegistry("${DOCKER_REGISTRY_URL}", "${DOCKER_REGISTRY_CREDENTIAL}") {

                                    //step([$class: 'DockerBuilderPublisher', cleanImages: true, cleanupWithJenkinsJobDelete: true, cloud: '', dockerFileDirectory: '', fromRegistry: [credentialsId: 'mgr.jenkins', url: 'https://registry.misys.global.ad'], pushCredentialsId: 'mgr.jenkins', pushOnSuccess: true, tagsString: 'fusion-risk/ansible-jenkins-slave:latest'])

                                    def container = docker.build("${DOCKER_BUILD_IMG}", "${DOCKER_BUILD_ARGS} . ")
                                    container.inside {
                                        sh 'echo DEBUGING image : $PATH'
                                        sh 'git --version'
                                        sh 'java -version'
                                        sh 'id jenkins'
                                        //sh 'ls -lrta'
                                        //sh 'ls -lrta /home/jenkins/ || true'
                                        sh 'less ${HOME}/.bowerrc || true'
                                        //sh 'npm --version'
                                        //TODO sh 'bower --version'
                                        sh 'date > /tmp/test.txt'
                                        sh "cp /tmp/test.txt ${WORKSPACE}"
                                        sh "cp ${HOME}/microscanner.log ${WORKSPACE} || true"
                                        archiveArtifacts artifacts: 'test.txt, *.log', excludes: null, fingerprint: false, onlyIfSuccessful: false
                                    }

                                    //sh 'which container-structure-test'
                                    cst = sh (
                                      script: "./scripts/docker-test.sh ${DOCKER_NAME_BUILD} ${DOCKER_BUILD_TAG}",
                                      returnStatus: true
                                    )

                                    echo "CONTAINER STRUCTURE TEST RETURN CODE : ${cst}"
                                    if (cst == 0) {
                                        echo "CONTAINER STRUCTURE TEST SUCCESS"
                                    } else {
                                        echo "CONTAINER STRUCTURE TEST FAILURE"
                                        currentBuild.result = 'UNSTABLE'
                                    }

                                    dockerComposeLogs(dockerFilePath: "docker-compose/")

                                    archiveArtifacts artifacts: 'scripts/microscanner-wrapper/aqua-grab.html', excludes: null, fingerprint: false, onlyIfSuccessful: false, allowEmptyArchive: true

                                    echo "DRY_RUN : ${env.DRY_RUN}"

                                    if (!env.DRY_RUN.toBoolean() && isReleaseBranch()) {
                                        //pushDockerImage(container, "${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME_BUILD}", "${DOCKER_TAG}")
                                        echo "Push the container to the custom Registry"
                                        //customImage.push()
                                        container.push('latest')
                                    }
                                } // withRegistry

                                //dockerFingerprintFrom dockerfile: 'docker/ubuntu16/Dockerfile', image: "${DOCKER_BUILD_IMG}"

                            } // tee

                        } // script
                    } // steps
                    post {
                        always {
                            script {
                                 archiveArtifacts artifacts: '*.log', excludes: null, fingerprint: false, onlyIfSuccessful: false
                                 junit testResults: 'target/ansible-lint.xml', healthScaleFactor: 2.0, allowEmptyResults: true, keepLongStdio: true
                            } //script
                        }
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>1-2 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Build - Docker
            } // parallel
        } // stage Preparation

        stage('\u2600 Echo') {
            agent {
                docker {
                    image DOCKER_IMAGE
                    alwaysPull true
                    reuseNode true
                    args DOCKER_OPTS_BASIC
                    label 'molecule'
                }
            }
            environment {
                BRANCH_JIRA = "${BRANCH_NAME}".replaceAll("feature/","")
                PROJECT_BRANCH = "${GIT_BRANCH}".replaceFirst("origin/","")
            }
            steps {
                script {
                    milestone 2

                    gitCheckoutTEST() {
                        getEnvironementData(filePath: "./bm/env/scripts/jenkins/step-2-0-0-build-env.sh", DEBUG_RUN: env.DEBUG_RUN)

                        echo "PULL_REQUEST_ID : ${env.PULL_REQUEST_ID}"
                        echo "BRANCH_JIRA : ${env.BRANCH_JIRA}"
                        echo "PROJECT_BRANCH : ${PROJECT_BRANCH}"
                        echo "JOB_NAME : ${env.JOB_NAME} - ${env.JOB_BASE_NAME}"

                        echo "BRANCH_NAME : ${env.BRANCH_NAME}"
                        echo "GIT_BRANCH_NAME : ${env.GIT_BRANCH_NAME}"
                        echo "TARGET_TAG : ${env.TARGET_TAG}"

                        echo "RELEASE : ${env.RELEASE} - ${env.RELEASE}.toBoolean()"
                        //echo "RELEASE_VERSION : ${env.RELEASE_VERSION}"
                        echo "SONAR_USER_HOME : ${env.SONAR_USER_HOME}"
                    }
                } // script
            } // steps
            post {
                success {
                    script {
                        manager.createSummary("completed.gif").appendText("<h2>* &#2690;</h2>", false)
                    } //script
                } // success
            } // post
        } // stage Echo

        stage('\u2777 Main') {
            failFast true
            parallel {
                stage('\u27A1 Ubuntu') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            args DOCKER_OPTS_COMPOSE
                            label 'molecule'
                        }
                    }
                    environment {
                        SCONS = "/usr/local/sonar-build-wrapper/build-wrapper-linux-x86-64 --out-dir bw-outputs scons"
                        SCONS_OPTS = ""
                        SONAR_SCANNER_OPTS = "-Xmx1g"
                        SONAR_USER_HOME = "$WORKSPACE"
                    }
                    stages {
                        stage('\u27A1 Build - Maven - Release') {
                            when {
                                  expression { BRANCH_NAME ==~ /release\/.+|master|develop/ }
                            }
                            steps {
                                script {

                                    checkout scm

                                    if (env.CLEAN_RUN) {
                                        sh "$WORKSPACE/clean.sh"
                                    }

                                    withMavenWrapper(profile: "jacoco", // signing
                                        skipObfuscation: false,
                                        skipIntegration: false,
                                        skipSonar: true,
                                        skipPitest: true,
                                        skipSigning: true,
                                        skipDocker: true,
                                        skipDeploy: false,
                                        skipSonarCheck: true,
                                        buildCmdParameters: " checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs spotbugs:spotbugs -Dserver=jetty9x -Dsettings.security=/home/jenkins/.m2/settings-security.xml",
                                        mavenHome: "/home/jenkins/.m2/",
                                        shellOutputFile: "maven-release.log",
                                        artifacts: "**/target/dependency/jetty-runner.jar, **/target/test-config.jar, **/target/test.war, **/target/*.zip") {

                                        sh 'echo "JAVA_HOME: ${JAVA_HOME} - PATH: ${PATH}"'
                                        sh "java -version || true"
                                        //sh "export PATH=$MVN_CMD_DIR:/bin:$PATH"

                                        //archiveArtifacts artifacts: "ZKM_log.txt, ChangeLog.txt", onlyIfSuccessful: false, allowEmptyArchive: false

                                    }

                                    withShellCheckWrapper(pattern: "*.sh")

                                    step([
                                        $class: 'CoberturaPublisher',
                                        autoUpdateHealth: false,
                                        autoUpdateStability: false,
                                        coberturaReportFile: '**/coverage.xml',
                                        //coberturaReportFile: 'target/site/cobertura/coverage.xml'
                                        failUnhealthy: false,
                                        failUnstable: false,
                                        failNoReports: false,
                                        maxNumberOfBuilds: 0,
                                        onlyStable: false,
                                        sourceEncoding: 'ASCII',
                                        zoomCoverageChart: false
                                        ])

                                    step([$class: "TapPublisher", testResults: "target/yslow.tap"])

                                    //jacoco buildOverBuild: false, changeBuildStatus: false, execPattern: '**/target/**-it.exec'

                                    //perfpublisher healthy: '', metrics: '', name: '**/target/surefire-reports/**/*.xml', threshold: '', unhealthy: ''

                                    //recordIssues enabledForFailure: true, tool: checkStyle()
                                    recordIssues enabledForFailure: true, tool: cpd(pattern: '**/target/cpd.xml')
                                    recordIssues enabledForFailure: true, tool: pmdParser(pattern: '**/target/pmd.xml')
                                    //recordIssues enabledForFailure: true, tool: pit()
                                    //taskScanner()
                                    recordIssues enabledForFailure: true,
                                                 aggregatingResults: true,
                                                 id: "analysis-java",
                                                 tools: [mavenConsole(), java(reportEncoding: 'UTF-8'), javaDoc(),
                                                         spotBugs(),
                                                 ],
                                                 filters: [excludeFile('.*\\/target\\/.*'),
                                                           excludeFile('node_modules\\/.*'),
                                                           excludeFile('npm\\/.*'),
                                                           excludeFile('bower_components\\/.*')]
                                    //sonarQube()

                                } // script
                            } // steps
                        } // stage Maven
                        stage('\u27A1 Build - Maven') {
                            when {
                                  expression { BRANCH_NAME ==~ /PR-.*|feature\/.*|bugfix\/.*/ }
                            }
                            steps {
                                script {

                                    checkout scm

                                    if (env.CLEAN_RUN) {
                                        sh "${WORKSPACE}/clean.sh"
                                    }

                                    withMavenWrapper(goal: "install",
                                        profile: "jacoco",
                                        skipObfuscation: false,
                                        skipIntegration: false,
                                        skipSonar: false,
                                        skipPitest: true,
                                        skipSigning: false,
                                        skipSonarCheck: true,
                                        mavenHome: "/home/jenkins/.m2/",
                                        shellOutputFile: "maven-build.log",
                                        buildCmdParameters: " checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs spotbugs:spotbugs -Dserver=jetty9x -Dsettings.security=/home/jenkins/.m2/settings-security.xml",
                                        artifacts: "**/target/dependency/jetty-runner.jar, **/target/test-config.jar, **/target/test.war, **/target/*.zip") {

                                    }

                                    withShellCheckWrapper(pattern: "*.sh")

                                    step([
                                        $class: 'CoberturaPublisher',
                                        autoUpdateHealth: false,
                                        autoUpdateStability: false,
                                        coberturaReportFile: '**/coverage.xml',
                                        //coberturaReportFile: 'target/site/cobertura/coverage.xml'
                                        failUnhealthy: false,
                                        failUnstable: false,
                                        failNoReports: false,
                                        maxNumberOfBuilds: 0,
                                        onlyStable: false,
                                        sourceEncoding: 'ASCII',
                                        zoomCoverageChart: false
                                        ])

                                    publishCoverage adapters: [jacocoAdapter(mergeToOneReport: true, path: 'target/jacoco.exec, target/jacoco-it.exec')], failNoReports: true, sourceFileResolver: sourceFiles('STORE_LAST_BUILD')

                                    step([$class: "TapPublisher", testResults: "target/yslow.tap"])

                                    //jacoco buildOverBuild: false, changeBuildStatus: false, execPattern: '**/target/**-it.exec'

                                    //perfpublisher healthy: '', metrics: '', name: '**/target/surefire-reports/**/*.xml', threshold: '', unhealthy: ''

                                    recordIssues enabledForFailure: true, tools: [mavenConsole(), java(reportEncoding: 'UTF-8'), javaDoc()]
                                    //recordIssues enabledForFailure: true, tool: checkStyle()
                                    recordIssues enabledForFailure: true, tool: spotBugs()
                                    recordIssues enabledForFailure: true, tool: cpd(pattern: '**/target/cpd.xml')
                                    recordIssues enabledForFailure: true, tool: pmdParser(pattern: '**/target/pmd.xml')
                                    //recordIssues enabledForFailure: true, tool: pit()
                                    //taskScanner()
                                    recordIssues enabledForFailure: true,
                                                 aggregatingResults: true,
                                                 id: "analysis-java",
                                                 tools: [mavenConsole(), java(reportEncoding: 'UTF-8'), javaDoc(),
                                                         spotBugs(),
                                                 ],
                                                 filters: [excludeFile('.*\\/target\\/.*'),
                                                           excludeFile('node_modules\\/.*'),
                                                           excludeFile('npm\\/.*'),
                                                           excludeFile('bower_components\\/.*')]
                                    //sonarQube()

                                } // script
                            } // steps
                        } // stage Maven
//                      stage('\u27A1 Build - Scons') {
//                          steps {
//                              script {
//
//                                  gitCheckoutTEST()
//
//                                  dir ("test/") {
//                                      script {
//                                          unstash 'maven-artifacts'
//
//                                          dir ("todo/") {
//
//                                              try {
//
//                                                  if (env.CLEAN_RUN) {
//                                                      env.SCONS_OPTS += "--cache-disable"
//                                                      //sh "rm -f .sconsign.dblite"
//                                                  }
//
//                                                  env.SCONS_OPTS = "gcc_version=4.8.5 color=False"
//                                                  if (env.DEBUG_RUN == true) {
//                                                    env.SCONS_OPTS += " verbose=True opt=False"
//                                                  } else {
//                                                    env.SCONS_OPTS += " -j32 opt=True"
//                                                  }
//
//                                                  echo "Scons OPTS have been specified: ${env.SCONS_OPTS}"
//
//                                                  getEnvironementData(filePath: "./bm/env/scripts/jenkins/step-2-0-0-build-env.sh", DEBUG_RUN: env.DEBUG_RUN)
//
//                                                  ansiColor('xterm') {
//sh '''
//#set -e
//set -xv
//
//echo "${SCONS} ${SCONS_OPTS}"
//echo "GIT_REVISION: ${GIT_REVISION}"
//
//./step-2-2-build.sh
//
//exit 0
//'''
//                                                  } //ansiColor
//
//                                                  stash includes: "${ARTIFACTS}", name: 'scons-artifacts'
//                                                  stash includes: "bw-outputs/*", name: 'bw-outputs'
//
//                                              } catch (e) {
//                                                  step([$class: 'ClaimPublisher'])
//                                                  throw e
//                                              }
//
//                                          } // dir
//
//                                      } // script
//                                  } // dir
//                              } // script
//                          } // steps
//                      } // stage Scons
                        stage('\u2795 Quality - SonarQube analysis') {
                            //when {
                            //    expression { BRANCH_NAME ==~ /release\/.+|master|develop/ }
                            //}
                            environment {
                                SONAR_SCANNER_OPTS = "-Xmx1g"
                                SONAR_USER_HOME = "$WORKSPACE"
                            }
                            steps {
                                //checkout scm

                                script {
                                    withSonarQubeWrapper(verbose: true,
                                        skipMaven: false,
                                        skipFailure: false,
                                        skipSonarCheck: true,
                                        reportTaskFile: ".scannerwork/report-task.txt",
                                        isScannerHome: false,
                                        sonarExecutable: "/usr/local/sonar-runner/bin/sonar-scanner",
                                        project: "NABLA",
                                        repository: "nabla-servers-bower-sample")
                                }
                            } // steps
                            post {
                                success {
                                    script {
                                        manager.createSummary("completed.gif").appendText("<h2>3-1 &#2690;</h2>", false)
                                    } //script
                                } // success
                            } // post
                        } // stage SonarQube analysis

                        stage('\u2756 Runtime - Docker') {
                            //when {
                            //    expression { BRANCH_NAME ==~ /release\/.+|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                            //}
                            steps {
                                script {

                                    env.DOCKER_RUNTIME_TAG = dockerBuildTESTRuntime(DOCKER_RUNTIME_NAME: DOCKER_RUNTIME_NAME, dockerFilePath: "./docker/centos7/", dockerTargetPath: "./", skipMaven: false)
                                    // Same as ./scripts/docker-build-runtime.sh
                                    // with result ./scripts/microscanner-wrapper/aqua-grab.html

                                    echo "DOCKER_RUNTIME_NAME - DOCKER_RUNTIME_TAG: ${DOCKER_RUNTIME_NAME}:${env.DOCKER_RUNTIME_TAG}"

                                    withCSTWrapper(imageName: "${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_RUNTIME_NAME}:${env.DOCKER_RUNTIME_TAG}", configFile: "docker/centos7/config.yaml")
                                    withAquaWrapper(imageName: "", localImage: "${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_RUNTIME_NAME}:${env.DOCKER_RUNTIME_TAG}", imageTag: "${env.DOCKER_RUNTIME_TAG}", locationType: "local", registry: "${DOCKER_REGISTRY}", skipFailure: true)

                                } // script
                            } // steps
                            post {
                                success {
                                    script {
                                        manager.createSummary("completed.gif").appendText("<h2>3-2 &#2690;</h2>", false)
                                    } //script
                                } // success
                            } // post
                        } // stage Runtime - Docker

                        stage('\u2779 Automated Acceptance Testing') {
                            when {
                                expression { BRANCH_NAME ==~ /release\/.+|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                                //expression { BRANCH_NAME ==~ /(none)/ }
                            }
                            environment {
                                DOCKER_TEST_TAG=dockerTag("${env.BRANCH_NAME}", "${env.GIT_COMMIT}")
                                DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
                                DOCKER_COMPOSE_UP_OPTIONS="--detach web "
                                TEST_RESULTS_PATH="/tmp/result/test-${env.GIT_COMMIT}-${env.BUILD_NUMBER}"
                                dockerResultPath="/tmp/robot-${env.GIT_COMMIT}-${env.BUILD_NUMBER}"
                                ADDITIONAL_ROBOT_OPTS="-s PipelineTests.TEST"
                            }
                            steps {
                                script {
                                    if (!env.DRY_RUN.toBoolean() && !env.RELEASE.toBoolean()) {
                                        try {

                                            checkout scm
                                            echo "DOCKER_TEST_TAG : ${DOCKER_TEST_TAG}"

                                            if (env.CLEAN_RUN) {
                                                sh "./docker-compose/docker-compose-down.sh"
                                            }

                                            if (!env.DRY_RUN.toBoolean()) {
                                                def up = sh script: "./docker-compose/docker-compose-up.sh", returnStatus: true
                                                echo "UP : ${up}"
                                                if (up == 0) {
                                                    echo "TEST SUCCESS"
                                                    //dockerCheckHealth("${DOCKER_TEST_CONTAINER}","healthy")
                                                } else if (up == 1) {
                                                    echo "TEST FAILURE"
                                                    currentBuild.result = 'FAILURE'
                                                    error "Test failed"
                                                } else {
                                                    echo "TEST UNSTABLE"
                                                    currentBuild.result = 'UNSTABLE'
                                                }
                                            }

                                            docker.image('mysql:5').withRun('-e "MYSQL_ROOT_PASSWORD=root" -e MYSQL_DATABASE=test') { c ->
                                                docker.image('mysql:5').inside("--link ${c.id}:db") {
                                                    /* Wait until mysql service is up */
                                                    sh 'while ! mysqladmin ping -hdb --silent; do sleep 1; done'
                                                }
                                                //docker.image('centos:7').inside("--link ${c.id}:db") {
                                                //    /*
                                                //     * Run some tests which require MySQL, and assume that it is
                                                //     * available on the host name `db`
                                                //     */
                                                //    sh 'make check'
                                                //}
                                                //docker.image('tomcat:8').withRun('-v $TESTDIR:/usr/local/tomcat/webapps/test').inside("--link ${c.id}:db") {
                                                //    sh 'echo test'
                                                //}
                                            }

                                            // --memory 1024m --cpus="1.5"
                                            //docker.image("https://github.com/AlbanAndrieu/nabla-servers-bower-sample:develop").withRun("-e \"ADDITIONAL_ROBOT_OPTS=${ADDITIONAL_ROBOT_OPTS}\" -e \"dockerResultPath=${dockerResultPath}\"").inside("--link frarc:frarc --network ${DOCKER_TEST_TAG}_default -v ${dockerResultPath}:/tmp/:rw") {c ->
                                            //    sh "docker logs ${c.id}"
                                            //    //sh "python --version"
                                            //}

                                            // -v /tmp/result-000-000:/tmp/:rw
                                            //docker.image("nabla-servers-bower-sample:latest").inside("--network ${DOCKER_TEST_TAG}_default") {c ->
                                            //    sh "docker logs ${c.id}"
                                            //    //sh "java -jar test.jar --help"
                                            //}

                                            //unstash 'maven-artifacts'

                                            getContainerResults(DOCKER_TEST_CONTAINER: "${DOCKER_TEST_TAG}_web_1") {

                                                publishHTML([allowMissing: true,
                                                    alwaysLinkToLastBuild: false,
                                                    keepAll: true,
                                                    reportDir: "result/latestResult/",
                                                    //reportDir: "result/",
                                                    reportFiles: 'index.html',
                                                    reportName: 'Test Report',
                                                    reportTitles: 'TEST index'])

                                            } // getContainerResults

                                        } catch(exc) {
                                            echo 'Error: There were errors in tests. '+exc.toString()
                                            currentBuild.result = 'FAILURE'
                                            error 'There are errors in tests'
                                        } finally {
                                            try {
                                                dockerComposeLogs(dockerFilePath: "docker-compose/")
                                            }
                                            catch(exc) {
                                                echo 'Warn: There was a problem taking down the docker-compose network. '+exc.toString()
                                            } finally {
                                                sh "./docker-compose/docker-compose-down.sh"
                                            }
                                        }

                                    } // if DRY_RUN
                                } // script
                            } // steps
                            post {
                                success {
                                    script {
                                        manager.createSummary("completed.gif").appendText("<h2>4-1 &#2690;</h2>", false)
                                    } //script
                                } // success
                            } // post
                        } // stage Automated Acceptance Testing

                    } // stages
                    post {
                        always {
                            archiveArtifacts artifacts: ['*_VERSION.TXT', 'target/dependency/jetty-runner.jar', 'target/*.war', '*.log'].join(', '), excludes: null, fingerprint: true, onlyIfSuccessful: true
                            //sha1 'target/test.war'

                        }
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>2-1 &#2690;</h2>", false)
                            } // script
                        } // success
                    } // post
                } // stage Build

                stage('\u2795 Quality - More check') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode false
                            args DOCKER_OPTS_BASIC
                            label 'molecule'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release\/.+|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                    }
                    steps {
                        script {
                            stage('\u2795 Quality - Site') {
                                script {
                                    if (!env.DRY_RUN.toBoolean() && !env.RELEASE.toBoolean()) {

                                         checkout scm

                                         //unstash 'sources'
                                         //unstash 'sources-tools'

                                         withSonarQubeEnv("${env.SONAR_INSTANCE}") {
                                             //reportTaskFile: "${env.WORKSPACE}/target/sonar/report-task.txt"
                                             withSonarQubeCheck(skipFailure: false)
                                         }

                                         //buildCmdParameters: "-Dserver=jetty9x -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt -Dmaven.exec.skip=true -Denforcer.skip=true -Dmaven.test.skip=true"

                                         withMavenSiteWrapper(buildCmdParameters: "-Dserver=jetty9x",
                                                              shellOutputFile: "maven-site.log",
                                                              skipSonarCheck: true)

                                    } // if DRY_RUN
                                } // script
                            } // stage Site
                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>2-2 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Quality - More check

                stage('\u2795 Quality - Security - Dependency check') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode false
                            args DOCKER_OPTS_BASIC
                            label 'molecule'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release\/.+|master|develop/ }
                    }
                    steps {
                        script {

                            if (!env.DRY_RUN.toBoolean() && !env.RELEASE.toBoolean()) {
                                //input id: 'DependencyCheck', message: 'Approve DependencyCheck?', submitter: 'aandrieu'

                                checkout scm

                                //unstash 'sources'
                                //unstash 'sources-tools'

                                //buildCmdParameters: "-Dserver=jetty9x -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt -Dmaven.exec.skip=true -Denforcer.skip=true -Dmaven.test.skip=true"

                                withMavenDependencyCheckWrapper(buildCmdParameters: "-Dserver=jetty9x",
                                                                skipSonarCheck: true) {

                                    archiveArtifacts allowEmptyArchive: true, artifacts: '**/dependency-check-report.xml', onlyIfSuccessful: true

                                    try {
                                        dependencyTrackPublisher artifact: '**/dependency-check-report.xml', artifactType: 'scanResult', projectId: 'nabla-servers-bower-sample'
                                        //dependencyTrackPublisher artifact: '**/dependency-check-report.xml', artifactType: 'bom', synchronous: true
                                    } catch (exc) {
                                        echo "Warn: There was a problem with dependencyTrackPublisher " + exc.toString()
                                    }

                                }

                            } // if DRY_RUN
                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>2-3 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Quality - Security - Dependency check

            } // parallel
        } // Main

        stage('\u277A Push') {
            failFast true
            parallel {
                stage('Archive Artifacts') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            args DOCKER_OPTS_COMPOSE
                            label 'molecule'
                        }
                    }
                    steps {
                        script {

                            checkout scm

                            //unstash 'sources'

                            withArchive() {
                                unstash 'app'
                                sha1 'target/test.war'
                            }

                            publishHTML (target: [
                              allowMissing: true,
                              alwaysLinkToLastBuild: false,
                              keepAll: true,
                              reportDir: 'scripts/microscanner-wrapper/',
                              reportFiles: 'aqua-grab.html',
                              reportName: "Aqua Report"
                            ])

                            publishHTML (target: [
                              allowMissing: true,
                              alwaysLinkToLastBuild: false,
                              keepAll: true,
                              reportDir: 'reports/',
                              reportFiles: 'JENKINS_ZAP_VULNERABILITY_REPORT-${BUILD_ID}.html',
                              reportName: "ZaProxy Report"
                            ])

                            publishHTML (target: [
                              allowMissing: true,
                              alwaysLinkToLastBuild: false,
                              keepAll: true,
                              reportDir: 'build/phantomas/',
                              reportFiles: 'index.html',
                              reportName: "Phantomas Report"
                            ])

                            publishHTML (target: [
                              allowMissing: true,
                              alwaysLinkToLastBuild: false,
                              keepAll: true,
                              reportDir: 'screenshots/desktop/',
                              reportFiles: 'index.html.png',
                              reportName: "Desktop CSS Diff Report"
                            ])

                            publishHTML (target: [
                              allowMissing: true,
                              alwaysLinkToLastBuild: false,
                              keepAll: true,
                              reportDir: 'screenshots/mobile/',
                              reportFiles: 'index.html.png',
                              reportName: "Mobile CSS Diff Report"
                            ])

                            //stash includes: '${ARTIFACTS}', name: 'app'
                            //unstash 'app'

                            String remoteDirectory = "TEST/LatestBuildsUntested/" + getSemVerReleasedVersion() + "-PROMOTE"

                            sshPublisherWrapper(remoteDirectory: remoteDirectory, sourceFiles: '**/TEST-*.tar.gz,target/test.war') {

                                echo 'Publishing'

                            }

                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>5-1 &#2690;</h2>", false)
                                manager.addShortText("archived")
                                manager.createSummary("gear2.gif").appendText("<h2>Successfully archived</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Archive Artifacts

                stage("Git Tag") {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode false
                            args DOCKER_OPTS_BASIC
                            label 'molecule'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /(release\/.+|master|develop)/ }
                    }
                    steps {
                        script {
                            //milestone 4

                            checkout scm

                            withTag()

                            withChangelog()

                       } // script
                    } // steps
                    post {
                        failure {
                            script {
                                manager.addBadge("red.gif", "<p>&#x2620;</p>")
                            } //script
                        }
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>5.2 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Git Tag
            } // parallel
        } // stage Push

    } // stages
    post {
        // always means, well, always run.
        always {
            script {
              echo "NODES_USED : " + NODES_USED.toString()
            } // script

            node('molecule') {
                runHtmlPublishers(["LogParserPublisher"])
            }
        }
        failure {
            echo "I'm failing"
            script {
                manager.createSummary("warning.gif").appendText("<h1>Build failed!</h1>", false, false, false, "red")
            } //script
        }
        changed {
            echo "I'm different"
        }
        success {
            echo "I succeeded"
            script {
                manager.removeBadge(0) // See issue https://issues.jenkins-ci.org/browse/JENKINS-52043
                //manager.removeShortText("deployed")
                manager.removeSummaries()
            } // script
        } // success
        //cleanup {
        //    node('molecule') {
        //        dockerCleaning()
        //    }
        //}
    } // post
} // pipeline
