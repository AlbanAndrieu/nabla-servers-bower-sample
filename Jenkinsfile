#!/usr/bin/env groovy
@Library('github.com/AlbanAndrieu/jenkins-pipeline-scripts@master') _
/*
    Point of this Jenkinsfile is to:
    - define global behavior
*/

def DOCKER_REGISTRY="hub.docker.com"
//def DOCKER_ORGANISATION="nabla"
def DOCKER_TAG="latest"
//def DOCKER_USERNAME="nabla"
def DOCKER_NAME="ansible-jenkins-slave-docker"

def DOCKER_REGISTRY_URL="https://${DOCKER_REGISTRY}"
def DOCKER_REGISTRY_CREDENTIAL='jenkins'
def DOCKER_IMAGE="${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"

def DOCKER_OPTS_BASIC = [
//    '--net=host',
//    '--pid=host',
//    '--dns-search=nabla.mobi',
//    '--init',
    '-v /var/run/docker.sock:/var/run/docker.sock',
// workspace is needed for SonarQube access to sonar-scanner
    '-v /workspace/slave/tools/:/workspace/slave/tools/',
    '-v /usr/local/sonar-build-wrapper/:/usr/local/sonar-build-wrapper/',
    '-v /usr/local/sonar-runner/:/usr/local/sonar-runner/',
//    '-v /home/jenkins/.m2:/home/jenkins/.m2:ro',
//    '-v /home/jenkins:/home/jenkins',
    '-e HOME=${WORKSPACE}',
    '-e NPM_CONFIG_PREFIX=${WORKSPACE}/.npm',
    '-v /etc/passwd:/etc/passwd:ro',
    '-v /etc/group:/etc/group:ro',
//  '-v /etc/timezone:/etc/timezone:ro',
//  '-v /etc/localtime:/etc/localtime:ro',
].join(" ")

def DOCKER_OPTS_COMPOSE = [
    DOCKER_OPTS_BASIC,
    '-v /etc/passwd:/etc/passwd:ro',
    '-v /etc/group:/etc/group:ro',
    '-v /var/run/docker.sock:/var/run/docker.sock',
].join(" ")

def DOCKER_OPTS_ROOT = [
    DOCKER_OPTS_COMPOSE,
    '-u root:root'
].join(" ")

def DOCKER_NAME_BUILD="ansible-jenkins-slave-docker"
def DOCKER_BUILD_TAG="latest"
def DOCKER_BUILD_IMG="${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME_BUILD}:${DOCKER_BUILD_TAG}"
def DOCKER_RUNTIME_TAG="latest"
def DOCKER_NAME_RUNTIME="test"
def DOCKER_RUNTIME_IMG="${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME_RUNTIME}:${DOCKER_RUNTIME_TAG}"

String ARTIFACTS = ['*_VERSION.TXT',
                '**/target/*.log',
                '**/target/*.jar',
                //'**/target/*.war',
                '**/target/test.war',
                '**/target/*.zip',
                'reports/*',
                '**/MD5SUMS.md5',
                'package-lock.json',
                'yarn.lock',
                'Jenkinsfile*',
                'Dockerfile*',
                '*.tar.gz'
                ].join(', ')

/*
    Point of this Jenkinsfile is to:
    - build java project
*/
pipeline {
    agent none
    //agent {
    //    // Equivalent to "docker build -f Dockerfile-jenkins-slave-ubuntu:16.04 --build-arg FILEBEAT_VERSION=6.3.0 ./build/
    //    dockerfile {
    //        //filename 'Dockerfile'
    //        //dir 'build'
    //        label 'docker-compose-TODO'
    //        //--target builder
    //        additionalBuildArgs ' --build-arg JENKINS_HOME=/home/jenkins --label "version=1.0.1" --label "maintaner=Alban Andrieu <alban.andrieu@gmail.com>" '
    //    }
    //}
    //triggers {
        //upstream(upstreamProjects: 'job1,job2', threshold: hudson.model.Result.SUCCESS)
    //}
    parameters {
        //booleanParam(name: "RELEASE", defaultValue: false, description: "Perform release-type build.")
        string(defaultValue: 'master', description: 'Default git branch to override', name: 'GIT_BRANCH_NAME')
        string(defaultValue: '44447', description: 'Default cargo rmi port to override', name: 'CARGO_RMI_PORT')
        string(defaultValue: '', description: 'Default workspace suffix to override', name: 'WORKSPACE_SUFFIX')
        string(defaultValue: 'http://localhost:9190', description: 'Default URL used by deployment tests', name: 'SERVER_URL')
        string(defaultValue: '/test/#/', description: 'Default context', name: 'SERVER_CONTEXT')
        string(defaultValue: 'LATEST_SUCCESSFULL', description: 'Create a TAG', name: 'TARGET_TAG')
        string(defaultValue: 'jenkins', description: 'User', name: 'TARGET_USER')
        booleanParam(defaultValue: false, description: 'Dry run', name: 'DRY_RUN')
        booleanParam(defaultValue: true, description: 'Clean before run', name: 'CLEAN_RUN')
        booleanParam(defaultValue: false, description: 'Debug run', name: 'DEBUG_RUN')
        booleanParam(defaultValue: false, description: 'Debug mvnw', name: 'MVNW_VERBOSE')
        booleanParam(name: "RELEASE", defaultValue: false, description: "Perform release-type build.")
        string(name: "RELEASE_BASE", defaultValue: "", description: "Commit tag or branch that should be checked-out for release")
        string(name: "RELEASE_VERSION", defaultValue: "", description: "Release version for artifacts")
    }
    environment {
        JENKINS_CREDENTIALS = 'jenkins-ssh'
        GIT_BRANCH_NAME = "${params.GIT_BRANCH_NAME}"
        //BRANCH_JIRA = "${env.BRANCH_NAME}".replaceAll("feature/","")
        //PROJECT_BRANCH = "${env.GIT_BRANCH}".replaceFirst("origin/","")
        SONAR_INSTANCE = "sonardev"
        SONAR_USER_HOME = "/tmp"
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
        RELEASE = "${params.RELEASE}".toBoolean()
        RELEASE_BASE = "${params.RELEASE_BASE}"
        RELEASE_VERSION = "${params.RELEASE_VERSION}"
        GIT_PROJECT = "nabla"
        GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
        //GIT_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        GIT_URL = "ssh://git@github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        //DOCKER_TAG=buildDockerTag("${env.BRANCH_NAME}")
    }
    options {
        skipDefaultCheckout()
        disableConcurrentBuilds()
        skipStagesAfterUnstable()
        parallelsAlwaysFailFast()
        ansiColor('xterm')
        timeout(time: 120, unit: 'MINUTES')
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
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_BASIC
                            label 'docker-compose-TODO'
                        }
                    }
                    steps {
                        //checkout scm

                        //checkout([
                        //    $class: 'GitSCM',
                        //    branches: [[name: "refs/heads/${params.GIT_BRANCH_NAME_BUILDMASTER}"]],
                        //    browser: [
                        //        $class: 'Stash',
                        //        repoUrl: "${env.GIT_BROWSE_URL}"],
                        //    doGenerateSubmoduleConfigurations: false,
                        //    extensions: [
                        //        [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                        //        //[$class: 'LocalBranch', localBranch: "**"],
                        //        //[$class: 'WipeWorkspace'],
                        //        [$class: 'RelativeTargetDirectory', relativeTargetDir: "bm"],
                        //        [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
                        //        [$class: 'IgnoreNotifyCommit'],
                        //        //[$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.7.0']]
                        //    ],
                        //    gitTool: 'git-latest',
                        //    submoduleCfg: [],
                        //    userRemoteConfigs: [[
                        //        credentialsId: "${env.JENKINS_CREDENTIALS}",
                        //        url: "${env.GIT_URL}"]
                        //    ]
                        //])

                        //checkout([
                        //    $class: 'GitSCM',
                        //    //branches: [[name: "refs/heads/${params.GIT_BRANCH_NAME}"]],
                        //    branches: scm.branches,
                        //    browser: [
                        //        $class: 'Stash',
                        //        repoUrl: "${env.GIT_BROWSE_URL_MAIN}"],
                        //    doGenerateSubmoduleConfigurations: false,
                        //    extensions: scm.extensions + [
                        //        [$class: 'GitLFSPull'],
                        //        [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                        //        [$class: 'LocalBranch', localBranch: "${params.GIT_BRANCH_NAME}"],
                        //        //[$class: 'WipeWorkspace'],
                        //        [$class: 'RelativeTargetDirectory', relativeTargetDir: "test"],
                        //        [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
                        //        [$class: 'IgnoreNotifyCommit'],
                        //        //[$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.7.0']]
                        //    ],
                        //    gitTool: 'git-latest',
                        //    submoduleCfg: [],
                        //    userRemoteConfigs: [[
                        //        credentialsId: "${env.JENKINS_CREDENTIALS}",
                        //        url: "${env.GIT_URL_MAIN}"]
                        //    ]
                        //])

                        //dir ("test") {

                        //} // dir

                        script {

                            properties(createPropertyList())

                            gitCheckoutTEST() {

                                if (!isReleaseBranch()) { abortPreviousRunningBuilds() }

                                    getEnvironementData(filePath: "./step-2-0-0-build-env.sh", DEBUG_RUN: DEBUG_RUN)

                                if (DEBUG_RUN) {
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

echo "BUILD_NUMBER: ${BUILD_NUMBER}"
echo "BUILD_ID: ${BUILD_ID}"
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

wget --http-user=admin --http-password=Motdepasse12 "http://home.nabla.mobi:8280/manager/text/undeploy?path=/test" -O -

#Xvfb :99 -ac -screen 0 1280x1024x24 &
#export DISPLAY=":99"
#nice -n 10 x11vnc 2>&1 &

#google-chrome --no-sandbox &

#killall Xvfb

exit 0
'''
                                } // if
                            } // gitCheckoutTEST

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
                        node {
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release|master|develop|PR-\/.*|feature\/.*|bugfix\/.*/ }
                    }
                    steps {
                        script {

                            checkout scm

                            sh(returnStdout: true, script: "echo ${DOCKER_BUILD_IMG} | cut -d'/' -f -1").trim()
                            DOCKER_BUILD_ARGS = ["--build-arg JENKINS_HOME=/home/jenkins"].join(" ")
                            if (CLEAN_RUN) {
                                DOCKER_BUILD_ARGS = ["--no-cache",
                                                     "--pull",
                                                     //"--target builder", // See issue https://issues.jenkins-ci.org/browse/JENKINS-44609?page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel&showAll=true
                                                     ].join(" ")
                            }
                            DOCKER_BUILD_ARGS = [ "${DOCKER_BUILD_ARGS}",
                                                  "--label 'version=1.0.3'",
                                                  "--label 'maintainer=Alban Andrieu <alban.andrieu@gmail.com>'",
                                                ].join(" ")
                            docker.withRegistry("${DOCKER_REGISTRY_URL}", "${DOCKER_REGISTRY_CREDENTIAL}") {
                                //def container = docker.build("${DOCKER_BUILD_IMG}:${BUILD_ID}", "${DOCKER_BUILD_ARGS} . ")
                                def container = docker.build("${DOCKER_BUILD_IMG}", "${DOCKER_BUILD_ARGS} . ")
                                container.inside {
                                    sh 'echo test'
                                }
                                if (!DRY_RUN) {
                                    //pushDockerImage(container, "${DOCKER_BUILD_IMG}", "${DOCKER_TAG}")
                                    ///* Push the container to the custom Registry */
                                    //customImage.push()
                                    //customImage.push('latest')
                                }
                            } // withRegistry
                            //dockerFingerprintFrom dockerfile: 'Dockerfile', image: "${DOCKER_BUILD_IMG}:${BUILD_ID}"
                            dockerFingerprintFrom dockerfile: './docker/ubuntu16/Dockerfile', image: "${DOCKER_BUILD_IMG}"
                        } // script
                    } // steps
                    post {
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
                    registryUrl DOCKER_REGISTRY_URL
                    registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    args DOCKER_OPTS_BASIC
                    label 'docker-compose-TODO'
                }
            }
            environment {
                BRANCH_JIRA = "${BRANCH_NAME}".replaceAll("feature/","")
                PROJECT_BRANCH = "${GIT_BRANCH}".replaceFirst("origin/","")
            }
            steps {
                script {
                    milestone 2

                    //unstash 'sources'
                    //unstash 'sources-tools'
                    gitCheckoutTEST() {
                        getEnvironementData(filePath: "./step-2-0-0-build-env.sh", DEBUG_RUN: DEBUG_RUN)

                        echo "PULL_REQUEST_ID : ${env.PULL_REQUEST_ID}"
                        echo "BRANCH_JIRA : ${env.BRANCH_JIRA}"
                        echo "PROJECT_BRANCH : ${PROJECT_BRANCH}"
                        echo "JOB_NAME : ${env.JOB_NAME} - ${env.JOB_BASE_NAME}"

                        echo "BRANCH_NAME : ${env.BRANCH_NAME}"
                        echo "GIT_BRANCH_NAME : ${env.GIT_BRANCH_NAME}"
                        echo "TARGET_TAG : ${env.TARGET_TAG}"

                        echo "RELEASE : ${env.RELEASE}"
                        echo "RELEASE_VERSION : ${env.RELEASE_VERSION}"
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
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_ROOT
                            label 'docker-compose-TODO'
                        }
                    }
                    environment {
                        SCONS = "/usr/local/sonar-build-wrapper/build-wrapper-linux-x86-64 --out-dir bw-outputs scons"
                        SCONS_OPTS = ""
                        SONAR_SCANNER_OPTS = "-Xmx1g"
                        SONAR_USER_HOME = "$WORKSPACE"
                    }
                    stages {
                        stage('\u27A1 Build - Maven') {
                            steps {
                                script {

                                    checkout scm

                                    if (CLEAN_RUN) {
                                        sh "$WORKSPACE/clean.sh"
                                    }

                                    //profile: "sonar,run-integration-test"

                                    withMavenWrapper(goal: "install",
                                        profile: "sonar",
                                        skipSonar: false,
                                        skipPitest: true,
                                        buildCmdParameters: "-Dserver=jetty9x",
                                        artifacts: "**/target/**.jar, **/target/**.war, **/target/*.zip") {

                                    }

                                    withShellCheckWrapper(pattern: "*.sh")

                                    //stash includes: 'node_modules/**/*', name: 'node_modules'
                                    //stash allowEmpty: true, includes: 'target/jacoco*.exec, target/lcov*.info, karma-coverage/**/*', name: 'coverage'
                                    //stash includes: "${ARTIFACTS}", name: 'maven-artifacts'
                                    //stash includes: "**/target/classes/**", name: 'classes'
                                    //dir('target') {stash name: 'app', includes: '*.war, *.jar'}

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

                                    //script {
                                    //
                                    //  utils = load "Jenkinsfile-vars"
                                    //  utils.checkAPI()
                                    //
                                    //} //script

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
//                                                  if (CLEAN_RUN) {
//                                                      env.SCONS_OPTS += "--cache-disable"
//                                                      //sh "rm -f .sconsign.dblite"
//                                                  }
//
//                                                  echo "Scons OPTS have been specified: ${env.SCONS_OPTS}"
//
//                                                  getEnvironementData(filePath: "./bm/Scripts/release/step-2-0-0-build-env.sh", DEBUG_RUN: DEBUG_RUN)
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
                            //    expression { BRANCH_NAME ==~ /release|master|develop/ }
                            //}
                            environment {
                                SONAR_SCANNER_OPTS = "-Xmx1g"
                                SONAR_USER_HOME = "$WORKSPACE"
                            }
                            steps {
                                //checkout scm

                                script {
                                    def sonarInclusions = getSonarInclusionsForCommit {
                                      project = "RKTMP"
                                    }.collect{ filename -> "${env.WORKSPACE}/${filename}" }.join(",")
                                    echo "Sonar Sources: ${sonarInclusions}"

                                    def buildCmdParameters = ""

                                    if (isReleaseBranch()) {
                                      echo "isReleaseBranch"
                                    } else {
                                      //-Dsonar.analysis.mode=incremental
                                      buildCmdParameters += " -Dsonar.inclusions=\"${sonarInclusions}\""
                                    }

                                    withSonarQubeWrapper(verbose: true, skipMaven: true, buildCmdParameters: buildCmdParameters) {
                                        //unstash 'sources'

                                        //unstash coverage
                                        //unstash 'maven-artifacts'
                                        //unstash 'classes'

                                        //unstash bwoutputs
                                    }
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
                            //    expression { BRANCH_NAME ==~ /release|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                            //}
                            steps {
                                script {

                                    sh "chmod 777 . && whoami || true"
                                    sh "id && pwd && ls -lrta || true"

                                    //env.DOCKER_RUNTIME_TAG = dockerBuildTESTRuntime(DOCKER_NAME_RUNTIME: DOCKER_NAME_RUNTIME, dockerFilePath: "docker/centos7/run/")

                                    echo "DOCKER_RUNTIME_TAG : ${env.DOCKER_RUNTIME_TAG}"
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
                                expression { BRANCH_NAME ==~ /release|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                                //expression { BRANCH_NAME ==~ /(none)/ }
                            }
                            environment {
                                DOCKER_TEST_TAG=buildDockerTag("${env.BRANCH_NAME}", "${env.GIT_COMMIT}").toLowerCase()
                                DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
                                DOCKER_COMPOSE_UP_OPTIONS="--exit-code-from web web"
                                TEST_RESULTS_PATH="/tmp/result/test-${env.GIT_COMMIT}-${env.BUILD_NUMBER}"
                                ROBOT_RESULTS_PATH="/tmp/robot-${env.GIT_COMMIT}-${env.BUILD_NUMBER}"
                                ADDITIONAL_ROBOT_OPTS="-s PipelineTests.TEST"
                            }
                            steps {
                                script {
                                    if (!DRY_RUN && !RELEASE) {
                                        try {

                                            checkout scm

                                            //unstash 'sources'

                                            echo "TODO : ${DOCKER_TEST_TAG}"

                                            if (CLEAN_RUN) {
                                                sh "docker-compose-down.sh"
                                            }

                                            if (!DRY_RUN) {
                                                def up = sh script: "docker-compose-up.sh", returnStatus: true
                                                echo "UP : ${up}"
                                                if (up == 0) {
                                                    echo "TEST SUCCESS"
                                                    //dockerCheckHealth("${DOCKER_TEST_CONTAINER}","healthy")

                                                    currentBuild.result = 'SUCCESS'
                                                } else if (up == 1) {
                                                    echo "TEST FAILURE"
                                                    currentBuild.result = 'FAILURE'
                                                } else {
                                                    echo "TEST UNSTABLE"
                                                    currentBuild.result = 'UNSTABLE'
                                                }
                                            }

                                            //sh 'sudo docker network ls && sudo docker ps -a'

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
                                            //docker.image("https://github.com/AlbanAndrieu/nabla-servers-bower-sample:develop").withRun("-e \"ADDITIONAL_ROBOT_OPTS=${ADDITIONAL_ROBOT_OPTS}\" -e \"ROBOT_RESULTS_PATH=${ROBOT_RESULTS_PATH}\"").inside("--link frarc:frarc --network ${DOCKER_TEST_TAG}_default -v ${ROBOT_RESULTS_PATH}:/tmp/:rw") {c ->
                                            //    sh "docker logs ${c.id}"
                                            //    //sh "python --version"
                                            //}

                                            // -v /tmp/result-000-000:/tmp/:rw
                                            //docker.image("nabla-servers-bower-sample:latest").inside("--network ${DOCKER_TEST_TAG}_default") {c ->
                                            //    sh "docker logs ${c.id}"
                                            //    //sh "java -jar test.jar --help"
                                            //}

                                            //step(
                                            //  [
                                            //    $class               : 'RobotPublisher',
                                            //    outputPath           : "/tmp/robot-${env.GIT_COMMIT}-${env.BUILD_NUMBER}",
                                            //    outputFileName       : "output.xml",
                                            //    reportFileName       : 'report.html',
                                            //    logFileName          : 'log.html',
                                            //    disableArchiveOutput : false,
                                            //    passThreshold        : 100.0,
                                            //    unstableThreshold    : 80.0,
                                            //    otherFiles           : "*.png,*.jpg",
                                            //  ]
                                            //)

                                            //unstash 'maven-artifacts'

                                            sh "docker cp ${DOCKER_TEST_TAG}_web_1:${TEST_RESULTS_PATH} result"

                                            publishHTML([allowMissing: true,
                                                alwaysLinkToLastBuild: false,
                                                keepAll: true,
                                                //reportDir: "${TEST_RESULTS_PATH}/latestResult/",
                                                reportDir: "result/latestResult/",
                                                //reportDir: "result/",
                                                reportFiles: 'index.html',
                                                //reportFiles: 'index.html',
                                                reportName: 'Test Report',
                                                reportTitles: 'TEST index'])

                                        } catch(exc) {
                                            echo 'Error: There were errors in tests. '+exc.toString()
                                            error 'There are errors in tests'
                                           currentBuild.result = 'FAILURE'
                                        } finally {
                                            try {
                                                sh '''docker-compose -f ./docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} ps -q'''
                                            }
                                            catch(exc) {
                                                echo 'Warn: There was a problem taking down the docker-compose network. '+exc.toString()
                                            } finally {
                                                sh "./docker-compose-down.sh"
                                            }
                                        }

                                    } // if DRY_RUN
                                } // script
                            } // steps
                            post {
                                always {

                                    archiveArtifacts artifacts: ['*_VERSION.TXT', '**/target/*.jar', '**/*.log'].join(', '), excludes: null, fingerprint: true, onlyIfSuccessful: true
                                    //sha1 'target/test.jar'

                                    //runHtmlPublishers(["LogParserPublisher", "AnalysisPublisher"])

                                    wrapCleanWs()
                                }
                                success {
                                    script {
                                        manager.createSummary("completed.gif").appendText("<h2>4-1 &#2690;</h2>", false)
                                    } //script
                                } // success
                            } // post
                        } // stage Automated Acceptance Testing

                    } // stages
                    post {
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
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_BASIC
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release|master|develop|PR-.*|feature\/.*|bugfix\/.*/ }
                    }
                    steps {
                        script {
                            stage('\u2795 Quality - Site') {
                                script {
                                    if (!DRY_RUN && !RELEASE) {

                                         checkout scm

                                         //unstash 'sources'
                                         //unstash 'sources-tools'

                                         //buildCmdParameters: "-Dserver=jetty9x -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt -Dmaven.exec.skip=true -Denforcer.skip=true -Dmaven.test.skip=true"

                                         withMavenSiteWrapper(buildCmdParameters: "-Dserver=jetty9x")

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
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_BASIC
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release|master|develop/ }
                    }
                    steps {
                        script {

                            if (!DRY_RUN && !RELEASE) {
                                //input id: 'DependencyCheck', message: 'Approve DependencyCheck?', submitter: 'aandrieu'

                                checkout scm

                                //unstash 'sources'
                                //unstash 'sources-tools'

                                //buildCmdParameters: "-Dserver=jetty9x -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt -Dmaven.exec.skip=true -Denforcer.skip=true -Dmaven.test.skip=true"

                                withMavenDependencyCheckWrapper(buildCmdParameters: "-Dserver=jetty9x")
                                //sh "nsp check"

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

                stage('\u2795 Quality - Security - Checkmarx') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_BASIC
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /release|master|develop/ }
                    }
                    steps {
                        script {

                            if (!DRY_RUN && !RELEASE) {
                                checkout scm

                                //unstash 'sources'

                                echo "TODO"

                                //withCheckmarxWrapper(excludeFolders: ", bm", projectName: 'MGR_UIComponents_Sample_Checkmarx')

                            }
                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>2-4 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Quality - Security - Dependency check
            } // parallel
        } // Main

        // First, you need SonarQube server 6.2+
        // TODO https://blog.sonarsource.com/breaking-the-sonarqube-analysis-with-jenkins-pipelines/
        // No need to occupy a node
        //stage("\u2795 Quality - Quality Gate") {
        //    steps {
        //        script {
        //
        //            if (!DRY_RUN && !RELEASE) {
        //                context="sonarqube/qualitygate"
        //                utils = load "Jenkinsfile-vars"
        //                utils.setBuildStatus ("${context}", 'Checking Sonarqube quality gate', 'PENDING')
        //                timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
        //                    def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
        //                    if (qg.status != 'OK') {
        //                        utils.setBuildStatus ("${context}", "Sonarqube quality gate fail: ${qg.status}", 'FAILURE')
        //                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
        //                    } else {
        //                        utils.setBuildStatus ("${context}", "Sonarqube quality gate pass: ${qg.status}", 'SUCCESS')
        //                    }
        //                } // timeout
        //            } // if DRY_RUN
        //        } // script
        //    } // steps
        //} // stage Quality Gate

        stage('\u277A Push') {
            failFast true
            parallel {
                stage('Deploy') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_COMPOSE
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /(release|master|develop)/ }
                    }
                    steps {
                        //milestone 3
                        script {

                            //timeout(time:1, unit:'HOURS') {
                            //    input message:'Approve deployment?', submitter: 'aandrieu'
                            //}
                            checkout scm

                            //unstash 'sources'
                            //unstash 'sources-tools'

                            //"-Dmaven.exec.skip=true -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt -Denforcer.skip=true -Dmaven.test.skip=true"

                            withDeploy(buildCmdParameters: "-Dserver=jetty9x") {

                                unstash 'maven-artifacts'

                                //sh "npm run publish:all"

                            }

                            //manager.addShortText("deployed")
                            //manager.createSummary("gear2.gif").appendText("<h2>Successfully deployed</h2>", false)

                            //utils = load "Jenkinsfile-vars"
                            //utils.cleanAction()

                        } //script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>5-1 &#2690;</h2>", false)
                                manager.addShortText("deployed")
                                manager.createSummary("gear2.gif").appendText("<h2>Successfully deployed</h2>", false)
                            } //script
                        }
                    } // post
                } // stage Deploy
                stage('Archive Artifacts') {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_COMPOSE
                            label 'docker-compose-TODO'
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

                            //publishHTML (target: [
                            //  allowMissing: true,
                            //  alwaysLinkToLastBuild: false,
                            //  keepAll: true,
                            //  //reportDir: 'target/*',
                            //  reportFiles: 'gc.png speed.har CHANGELOG.html',
                            //  reportName: "Reports"
                            //])

                            //stash includes: '${ARTIFACTS}', name: 'app'
                            //unstash 'app'

                            env.INSTALLER_PATH = getSemVerReleasedVersion()

                            //sshPublisher(
                            //    publishers: [
                            //        sshPublisherDesc(
                            //            configName: 'kgrdb01',
                            //            transfers: [
                            //                sshTransfer(excludes: '**/*Debug*.tar.gz',
                            //                execCommand: '',
                            //                execTimeout: 120000,
                            //                flatten: true,
                            //                makeEmptyDirs: false,
                            //                noDefaultExcludes: false,
                            //                patternSeparator: '[, ]+',
                            //                remoteDirectory: 'TEST/LatestBuildsUntested/${INSTALLER_PATH}-PROMOTE',
                            //                remoteDirectorySDF: false,
                            //                removePrefix: '',
                            //                sourceFiles: '**/Latest-*.tar.gz,**/TEST-*.tar.gz,target/test.war')
                            //            ],
                            //            usePromotionTimestamp: false,
                            //            useWorkspaceInPromotion: false,
                            //            verbose: false)
                            //        ])

                        } // script
                    } // steps
                    post {
                        success {
                            script {
                                manager.createSummary("completed.gif").appendText("<h2>5-2 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Archive Artifacts

                stage("Git Tag") {
                    agent {
                        docker {
                            image DOCKER_IMAGE
                            reuseNode true
                            registryUrl DOCKER_REGISTRY_URL
                            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                            args DOCKER_OPTS_COMPOSE
                            label 'docker-compose-TODO'
                        }
                    }
                    when {
                        expression { BRANCH_NAME ==~ /(release|master|develop)/ }
                    }
                    steps {
                        script {
                            //milestone 4

                            //unstash 'sources'
                            //unstash 'sources-tools'
                            checkout scm

                            withTag()

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
                                manager.createSummary("completed.gif").appendText("<h2>5.3 &#2690;</h2>", false)
                            } //script
                        } // success
                    } // post
                } // stage Git Tag
            } // parallel
        } // stage Push

        stage('\u277B Promote') {
            agent {
                docker {
                    image DOCKER_IMAGE
                    reuseNode true
                    registryUrl DOCKER_REGISTRY_URL
                    registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    args DOCKER_OPTS_COMPOSE
                    label 'docker-compose-TODO'
                }
            }
            when {
                expression { BRANCH_NAME ==~ /(release|master|develop)/ }
            }
            environment {
                TARGET_USER = "jenkins"
                TARGET_HOST = "home.nabla.mobi"
                INSTALLER_PATH = "1.0.0"
                TARGET_SHARE_DIR = "/var/www/release/${INSTALLER_PATH}/"
            }
            steps {
                milestone label: 'promote', ordinal: 4

                //unstash 'sources'
                //unstash 'sources-tools'
                unstash 'maven-artifacts'

                //sh "scp target/*.war $TARGET_USER@$TARGET_HOST:$TARGET_SHARE_DIR/"

            } // steps
        } // stage Promote

    } // stages
    post {
        // always means, well, always run.
        always {
            wrapCleanWs()
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
            node('docker-compose-TODO') {
                echo "I succeeded"
                script {
                    manager.removeBadge(0) // See issue https://issues.jenkins-ci.org/browse/JENKINS-52043
                    //manager.removeShortText("deployed")
                    //manager.removeSummaries()
                } //script
            } // node
        } // success
    } // post
} // pipeline

def gitCheckoutTEST() {

    checkout scm

    checkout([
        $class: 'GitSCM',
        branches: [[name: "refs/heads/${params.GIT_BRANCH_NAME_BUILDMASTER}"]],
        browser: [
            $class: 'Stash',
            repoUrl: "${env.GIT_BROWSE_URL}"],
        doGenerateSubmoduleConfigurations: false,
        extensions: [
            //[$class: 'LocalBranch', localBranch: "**"],
            //[$class: 'WipeWorkspace'],
            [$class: 'RelativeTargetDirectory', relativeTargetDir: "bm"],
            [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
            [$class: 'IgnoreNotifyCommit'],
            [$class: 'CheckoutOption', timeout: 120],
            //[$class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: false, timeout: 120]
            //[$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.7.0']]
        ],
        gitTool: 'git-latest',
        submoduleCfg: [],
        userRemoteConfigs: [[
            credentialsId: "${env.JENKINS_CREDENTIALS}",
            url: "${env.GIT_URL}"]
        ]
    ])

    //checkout([
    //    $class: 'GitSCM',
    //    //branches: [[name: "refs/heads/${params.GIT_BRANCH_NAME}"]],
    //    branches: scm.branches,
    //    browser: [
    //        $class: 'Stash',
    //        repoUrl: "${env.GIT_BROWSE_URL_MAIN}"],
    //    doGenerateSubmoduleConfigurations: false,
    //    extensions: scm.extensions + [
    //        [$class: 'GitLFSPull'],
    //        [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
    //        [$class: 'LocalBranch', localBranch: "${params.GIT_BRANCH_NAME}"],
    //        //[$class: 'WipeWorkspace'],
    //        [$class: 'RelativeTargetDirectory', relativeTargetDir: "test"],
    //        [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
    //        [$class: 'IgnoreNotifyCommit'],
    //        //[$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.7.0']]
    //    ],
    //    gitTool: 'git-latest',
    //    submoduleCfg: [],
    //    userRemoteConfigs: [[
    //        credentialsId: "${env.JENKINS_CREDENTIALS}",
    //        url: "${env.GIT_URL_MAIN}"]
    //    ]
    //])

    //dir ("bm") {

    //} // dir

    script {

        if (params.RELEASE && params.RELEASE_BASE) {
            sh "git fetch --tags; git checkout ${params.RELEASE_BASE}"
        }

        utils = load "jpl/Jenkinsfile-vars"
        if (! isReleaseBranch()) { utils.abortPreviousRunningBuilds() }
        env.GIT_COMMIT = utils.getCommitId()
        echo "GIT_COMMIT: ${GIT_COMMIT} - ${env.GIT_COMMIT}"

        env.GIT_REVISION = utils.getRevision()
        echo "GIT_REVISION: ${GIT_REVISION} - ${env.GIT_REVISION}"

        if (params.DEBUG_RUN) {
            ansiColor('xterm') {
sh '''
set -e
#set -xve

echo "USER : $USER"
echo "SHELL : $SHELL"

id
cat /etc/hostname

cd ./bm/Scripts/release

./step-2-0-0-build-env.sh || exit 1

echo "PATH : ${PATH}"
echo "JAVA_HOME : ${JAVA_HOME}"
echo "DISPLAY : ${DISPLAY}"

echo "BUILD_NUMBER: ${BUILD_NUMBER}"
echo "BUILD_ID: ${BUILD_ID}"
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

#curl -i -v -k ${SERVER_URL}${SERVER_CONTEXT} --data "username=kgr&password=Kondor_123"

wget --http-user=admin --http-password=Motdepasse12 "http://kgrdb01:8280/manager/text/undeploy?path=/test" -O -

#Xvfb :99 -ac -screen 0 1280x1024x24 &
#export DISPLAY=":99"
#nice -n 10 x11vnc 2>&1 &

#google-chrome --no-sandbox &

#killall Xvfb

exit 0
'''
            } //ansiColor

        } // if
    } //script

} // gitCheckout
