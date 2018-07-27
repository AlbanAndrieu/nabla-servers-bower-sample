#!/usr/bin/env groovy
/*
    Point of this Jenkinsfile is to:
    - define global behavior
*/
def utils

def isReleaseBranch() {
    BRANCH_NAME ==~ /develop/ || BRANCH_NAME ==~ /master/ || BRANCH_NAME ==~ /release\/.*/
}

def daysToKeep         = isReleaseBranch() ? '30' : '10'
def numToKeep          = isReleaseBranch() ? '20' : '5'
def artifactDaysToKeep = isReleaseBranch() ? '30' : '10'
def artifactNumToKeep  = isReleaseBranch() ? '3'  : '1'
def cronString         = isReleaseBranch() ? 'H H(3-7) * * 1-5' : '@daily'
def pollSCMString = isReleaseBranch() ? '@montlhy' : '@hourly'

def DOCKER_REGISTRY = "hub.docker.com"
//def DOCKER_ORGANISATION="nabla"
def DOCKER_TAG="latest"
//def DOCKER_USERNAME="nabla"
def DOCKERNAME="ansible-jenkins-slave-docker

def DOCKER_REGISTRY_URL = "https://${DOCKER_REGISTRY}"
//def DOCKER_IMAGE = "fusion-risk/${DOCKERNAME}:${DOCKER_TAG}"
def DOCKER_REGISTRY_CREDENTIAL = 'jenkins'
//def DOCKER_BUILD_TAG = "${env.DOCKER_TAG}"+"_"+"${env.BUILD_NUMBER}"
//def DOCKER_BUILD_IMG = "nabla/${DOCKERNAME}-build"
//def DOCKER_RUNTIME_IMG = "nabla/${DOCKERNAME}-runtime"
def DOCKER_IMAGE = "${DOCKER_REGISTRY}/aandrieu/${DOCKERNAME}:${DOCKER_TAG}"

//JENKINS-42369 : Docker options need to be defined outside of pipeline
def DOCKER_OPTS = [
    '--net=host',
    '--pid=host',
//    '--dns-search=nabla.mobi',
    '--init',
//    '-v /home/jenkins/.m2:/home/jenkins/.m2 ',
    '-v /home/jenkins:/home/jenkins',
    '-v /etc/passwd:/etc/passwd:ro ',
    '-v /etc/group:/etc/group:ro ',
//  '-v /etc/timezone:/etc/timezone:ro',
//  '-v /etc/localtime:/etc/localtime:ro',
//    '-e HOME=${WORKSPACE}',
    '-e NPM_CONFIG_PREFIX=${WORKSPACE}/.npm',
].join(" ")

/*
    Point of this Jenkinsfile is to:
    - build java project
*/
pipeline {
    //agent none
    //agent {
    //    node {
    //        label 'FR1CSLFRBM0058'
    //    }
    //}
    // TODO
    //agent {
    //    // Equivalent to "docker build -f Dockerfile-jenkins-slave-ubuntu:16.04 --build-arg FILEBEAT_VERSION=6.3.0 ./build/
    //    dockerfile {
    //        filename 'Dockerfile-jenkins-slave-ubuntu:16.04'
    //        //dir 'build'
    //        label 'docker-inside'
    //        additionalBuildArgs  '--target builder --build-arg FILEBEAT_VERSION=6.3.2 --label "version=1.0.1" --label "maintaner=Alban Andrieu <alban.andrieu@gmail.com>" '
    //    }
    //}
    agent {
        docker {
            image DOCKER_IMAGE
            reuseNode true
            registryUrl DOCKER_REGISTRY_URL
            registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
            args DOCKER_OPTS
            label 'docker-inside'
        }
    }
    triggers {
        //upstream(upstreamProjects: 'job1,job2', threshold: hudson.model.Result.SUCCESS)
        cron(cronString)
        pollSCM(pollSCMString)
        //snapshotDependencies()
        bitbucketPush()
    }
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
        booleanParam(defaultValue: false, description: 'Clean before run', name: 'CLEAN_RUN')
        booleanParam(defaultValue: true, description: 'Debug run', name: 'DEBUG_RUN')
        booleanParam(defaultValue: false, description: 'Debug mvnw', name: 'MVNW_VERBOSE')
    }
    environment {
        JENKINS_CREDENTIALS = 'jenkins-ssh'
        GIT_BRANCH_NAME = "${params.GIT_BRANCH_NAME}"
        BRANCH_JIRA = "${env.BRANCH_NAME}".replaceAll("feature/","")
        PROJECT_BRANCH = "${env.GIT_BRANCH}".replaceFirst("origin/","")
        SONAR_BRANCH = sh(returnStdout: true, script: "echo ${env.BRANCH_NAME} | cut -d'/' -f 2-").trim()
        SONAR_USER_HOME = "/tmp"
        CARGO_RMI_PORT = "${params.CARGO_RMI_PORT}"
        WORKSPACE_SUFFIX = "${params.WORKSPACE_SUFFIX}"
        DRY_RUN = "${params.DRY_RUN}"
        CLEAN_RUN = "${params.CLEAN_RUN}"
        DEBUG_RUN = "${params.DEBUG_RUN}"
        //echo "JOB_NAME: ${env.JOB_NAME} : ${env.JOB_BASE_NAME}"
        TARGET_PROJECT = sh(returnStdout: true, script: "echo ${env.JOB_NAME} | cut -d'/' -f -1").trim()
        //BRANCH_NAME = "${env.BRANCH_NAME}".replaceAll("feature/","")
        BUILD_ID = "${env.BUILD_ID}"
        GIT_PROJECT = "nabla"
        GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
        //GIT_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        GIT_URL = "ssh://git@github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        DOCKER_TAG=buildDockerTag("${env.BRANCH_NAME}")
    }
    options {
        //skipDefaultCheckout()
        //disableConcurrentBuilds()
        ansiColor('xterm')
        timeout(time: 120, unit: 'MINUTES')
        buildDiscarder(
          logRotator(
            daysToKeepStr: daysToKeep,
            numToKeepStr: numToKeep,
            artifactDaysToKeepStr: artifactDaysToKeep,
            artifactNumToKeepStr: artifactNumToKeep
          )
        )
    }
    stages {
        stage('Cleaning') {
            //agent {
            //    docker {
            //        image DOCKER_IMAGE
            //        reuseNode true
            //        registryUrl DOCKER_REGISTRY_URL
            //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
            //        args DOCKER_OPTS
            //    }
            //}
            steps {
                script {
                    utils = load "Jenkinsfile-vars"
                    if (! isReleaseBranch()) { utils.abortPreviousRunningBuilds() }
                    //if (params.CLEAN_RUN == true) {
                    //    stage('Clean everything') {
                    //        echo "Delete everything at start"
                    //        deleteDir()
                    //    }
                    //}
                }
            } // steps
        } // stage Cleaning
        stage('Preparation') { // for display purposes
            failFast true
            parallel {
                //stage('Build - Docker') {
                //    //agent {
                //    //    docker {
                //    //        image DOCKER_IMAGE
                //    //        reuseNode true
                //    //        registryUrl DOCKER_REGISTRY_URL
                //    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                //    //        args DOCKER_OPTS
                //    //    }
                //    //}
                //    steps {
                //        script {
                //            //sh '''`ls $WORKSPACE/Dockerfile*`;'''
                //            sh(returnStdout: true, script: "echo ${env.DOCKERNAME} | cut -d'/' -f -1").trim()
                //            docker_build_args="--no-cache --pull --build-arg JENKINS_HOME=/home/jenkins"
                //            docker.withRegistry("${DOCKER_REGISTRY_URL}", "${DOCKER_REGISTRY_CREDENTIAL}") {
                //                def container = docker.build("${env.DOCKER_BUILD_IMG}:${env.DOCKER_TAG}", "${docker_build_args} -f Dockerfile-jenkins-slave-ubuntu:16.04 . ")
                //                container.inside {
                //                    sh 'echo test'
                //                }
                //            //    pushDockerImage(container, "${env.DOCKER_BUILD_IMG}", "${env.DOCKER_TAG}")
                //                ///* Push the container to the custom Registry */
                //                //customImage.push()
                //            }
                //        }
                //    }
                //} // stage Build - Docker
                stage('SCM - Main') {
                //    agent {
                //      docker {
                //        image DOCKER_IMAGE
                //        reuseNode true
                //        registryUrl DOCKER_REGISTRY_URL
                //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                //        args DOCKER_OPTS
                //      }
                //    }
                    steps {
                //        checkout scm

                        //checkout([
                        //    $class: 'GitSCM',
                        //    //branches: [[name: "${env.GIT_BRANCH_NAME}"]],
                        //    branches: scm.branches,
                        //    browser: [
                        //        $class: 'Stash',
                        //        repoUrl: "${env.GIT_BROWSE_URL_MAIN}"],
                        //    doGenerateSubmoduleConfigurations: false,
                        //    extensions: scm.extensions + [
                        //        [$class: 'GitLFSPull'],
                        //        [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                        //        [$class: 'LocalBranch', localBranch: "${env.GIT_BRANCH_NAME}"],
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

                        //TODO
                        //dockerFingerprintFrom dockerfile: 'Dockerfile-jenkins-slave-ubuntu:16.04', image: 'latest'

                        //dir ("test") {
                            script {
                                GIT_COMMIT = utils.getCommitId()

                            } // script
                            echo "GIT_COMMIT: ${GIT_COMMIT} - ${env.GIT_COMMIT}"
                        //} // dir
                    }
                } // stage SCM Main
                stage('SCM - MORE') {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                //    }
                    //}
                    steps {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "refs/heads/${env.GIT_BRANCH_NAME_BUILDMASTER}"]],
                            browser: [
                                $class: 'Stash',
                                repoUrl: "${env.GIT_BROWSE_URL}"],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [
                                [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                                //[$class: 'LocalBranch', localBranch: "**"],
                                [$class: 'RelativeTargetDirectory', relativeTargetDir: "bm"],
                                [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
                                [$class: 'IgnoreNotifyCommit'],
                                //[$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.6.0']]
                            ],
                            gitTool: 'git-latest',
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: "${env.JENKINS_CREDENTIALS}",
                                url: "${env.GIT_URL}"]
                            ]
                        ])

                        script {
                            if (params.DEBUG_RUN == true) {
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

#./step-2-2-1-build-before-java.sh || exit 1

echo "PATH : ${PATH}"
echo "JAVA_HOME : ${JAVA_HOME}"
echo "DISPLAY : ${DISPLAY}"
echo "TARGET_PROJECT : ${TARGET_PROJECT}"

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
                            } //ansiColor
                            } // if
                        } // script
                    } //steps
                } // stage SCM MORE
            } // parallel
        } // stage Preparation
        stage('Echo') {
            //agent {
            //    docker {
            //        image DOCKER_IMAGE
            //        reuseNode true
            //        registryUrl DOCKER_REGISTRY_URL
            //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
            //        args DOCKER_OPTS
            //    }
            //}
            steps {

                load "${env.WORKSPACE}/bm/Scripts/release/jenkins-env.groovy"

                echo "SONAR_BRANCH : ${env.SONAR_BRANCH}"
                echo "BRANCH_JIRA : ${env.BRANCH_JIRA}"
                echo "PROJECT_BRANCH: ${PROJECT_BRANCH}"
                echo "JOB_NAME : ${env.JOB_NAME} - ${env.JOB_BASE_NAME}"

                echo "BRANCH_NAME: ${env.BRANCH_NAME}"
                echo "GIT_BRANCH_NAME: ${env.GIT_BRANCH_NAME}"
                echo "TARGET_TAG : ${env.TARGET_TAG}"
                echo "RELEASE_VERSION : ${env.RELEASE_VERSION}"
                echo "SONAR_USER_HOME : ${env.SONAR_USER_HOME}"

                //TODO
                sh 'echo TERM = $TERM && echo USER = $USER && id && ping -c 3 alm-sonar.misys.global.ad'

            } // steps
        } // stage Load variables

        stage('Main') {
            failFast true
            parallel {
                stage('Build') {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                    //    }
                    //}
                    environment {
                        SONAR_USER_HOME = "/tmp"
                        SONAR_INSTANCE = "sonardev"
                      }
                    steps {
                        script {
                            stage('Build - Maven') {
                                 script {

                                    if (params.CLEAN_RUN == true) {
                                        sh "rm -Rf .node_cache/ .node_tmp/  .tmp/ .bower/ node node_modules/ package-lock.json yarn.lock"
                                    }

                                     // Maven opts
                                    //TODO add -U
                                     String MAVEN_OPTS = ["-Djava.awt.headless=true",
                                        //"-Dsun.zip.disableMemoryMapping=true",
                                         //"-Dmaven.repo.local=./.repository",
                                         "-Xmx2G",
                                        //"-Denforcer.skip=true",
                                         "-Djava.io.tmpdir=${WORKSPACE}/target/tmp"].join(" ")

                                     if (params.DEBUG_RUN == true) {
                                        echo "debug added"
                                        MAVEN_OPTS = ["${MAVEN_OPTS}",
                                            "-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -XX:+HeapDumpOnOutOfMemoryError",
                                        ].join(" ")

                                        sh 'echo TERM = $TERM && echo USER = $USER && id && cat /etc/hostname && ping -c 3 alm-sonar.misys.global.ad'
                                     }

                                     echo "Maven OPTS have been specified: ${env.MAVEN_OPTS}"

                                     configFileProvider([configFile(fileId: 'fr-maven-default',  targetLocation: 'gsettings.xml', variable: 'SETTINGS_XML')]) {
                                         withMaven(
                                             maven: 'maven-latest',
                                             jdk: 'java-latest',
                                             globalMavenSettingsConfig: 'fr-maven-default',
                                             mavenLocalRepo: './.repository',
                                             mavenOpts: "${MAVEN_OPTS}",
                                             options: [
                                                 pipelineGraphPublisher(
                                                     ignoreUpstreamTriggers: !isReleaseBranch(),
                                                     skipDownstreamTriggers: !isReleaseBranch(),
                                                     lifecycleThreshold: 'deploy'
                                                 ),
                                                 artifactsPublisher(disabled: true)
                                             ]
                                         ) {
                                            // TODO https://devhub.io/repos/linagora-docker-sonarqube-pr
                                            //TODO
                                            withSonarQubeEnv("${env.SONAR_INSTANCE}") {
                                                env.RELEASE_VERSION = utils.getReleasedVersion()
                                                //env.TARGET_TAG = sh(returnStdout: true, script: "echo ${env.RELEASE_VERSION} | cut -d'.' -f -2").trim()
                                                env.TARGET_TAG = utils.getShortReleasedVersion()
                                                echo "Maven RELEASE_VERSION: ${env.RELEASE_VERSION} - ${env.TARGET_TAG}"

                                                manager.addShortText("${TARGET_TAG}")

                                                sh 'echo SONAR_USER_HOME : ${SONAR_USER_HOME} && mkdir -p ${SONAR_USER_HOME}'

                                                String MAVEN_GOALS = ["-e -Dsurefire.useFile=false",
                                                     //"-f ${MAVEN_ROOT_POM}",
                                                     "-s ${SETTINGS_XML}",
                                                     //"-T3",
                                                     //"-Dakka.test.timefactor=2",
                                                     //"-Dcargo.rmi.port=${CARGO_RMI_PORT} -Djetty.http.port=9190 -Dwebdriver.base.url=http://localhost:9190/ -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -DSTOP.PORT=19097 -DSTOP.KEY=STOP",
                                                        //"-Djacoco.outputDir=${WORKSPACE}/target",
                                                        "-Psonar,jacoco,codenarc,run-integration-test"].join(" ")

                                                if (params.DRY_RUN == false) {
                                                    MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        "install"].join(" ")
                                                } else {
                                                    MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        "validate"].join(" ")
                                             }

                                                if ((env.BRANCH_NAME == 'develop') || (env.BRANCH_NAME ==~ /feature\/.*/)) {

                                                    if (params.DRY_RUN == false) {
                                                        //echo "pitest added"
                                                        //MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        //    " -DwithHistory org.pitest:pitest-maven:mutationCoverage "].join(" ")
                                                        //echo "sonar added"
                                                        //"-Dsonar.branch=${env.BRANCH_NAME}",
                                                        //"-Dsonar.branch=${SONAR_BRANCH}",
                                                        //MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        //        //" org.sonarsource.scanner.maven:sonar-maven-plugin:3.4.0.905:sonar ",
                                                        //        " sonar:sonar "
                                                        //        ].join(" ")
                                             }
                                                } // if DRY_RUN

                                                if (env.BRANCH_NAME ==~ /feature\/.*/) {
                                                    //" -Dsonar.organization=misys -Dsonar.host.url='https://alm-sonar.misys.global.ad' -Dsonar.login=ce1fc929ea67fa7d5e3f169db3f99cfe5361cbc5 ",
                                                    //" -Dsonar.analysis.mode=preview -Dsonar.github.pullRequest=${prNo} -Dsonar.github.oauth=${githubToken} -Dsonar.github.repository=${repoSlug} -Dsonar.github.endpoint=https://api.github.com/ "
                                                    //-Dsonar.analysis.scmRevision=628f5175ada0d685fd7164baa7c6382c1f25cab4 -Dsonar.analysis.buildNumber=12345
                                                    MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        " -Dsonar.host.url='https://sonardev.misys.global.ad/' -Dsonar.login=c71b002ba25ba981183379e2ae9baa272a8eb79a ",
                                                        " -Dsonar.analysis.mode=preview ",
                                                        //" -Dissueassignplugin.enabled=false -Dsonar.pitest.mode=skip -Dsonar.scm.user.secured=false ",
                                                        //" -Dsonar.scm.enabled=false -Dsonar.scm-stats.enabled=false ",
                                                        //" -Denforcer.skip=false ",
                                                        " -Dmaven.test.failure.ignore=false -Dmaven.test.failure.skip=false "].join(" ")
                                                }

                                                if ((env.BRANCH_NAME ==~ /release\/.*/) || (env.BRANCH_NAME ==~ /master\/.*/)) {
                                                 echo "skip test added"
                                                    MAVEN_GOALS = ["${MAVEN_GOALS}",
                                                        " -Dmaven.test.failure.ignore=true -Dmaven.test.failure.skip=true "].join(" ")
                                             }

                                             echo "Maven GOALS have been specified: ${MAVEN_GOALS}"

                                             wrap([$class: 'Xvfb', autoDisplayName: false, additionalOptions: '-pixdepths 24 4 8 15 16 32', parallelBuild: true]) {
                                                 // Run the maven build
                                                 sh "./mvnw ${MAVEN_GOALS}"
                                             } // Xvfb
                                             //stash excludes: 'target/, .bower/, .tmp/, bower_components/, node/, node_modules/, coverage/, build/', includes: '**', name: 'source'
                                             //stash includes: 'node_modules/', name: 'node_modules'
                                             //unstash 'node_modules'
                                            } // withSonarQubeEnv
                                         } //withMaven
                                     } // configFileProvider
                                 } //script
                            } // stage Maven
                            stage('Quality - Basic results check') {
                                script {
                                    step([
                                        $class: "WarningsPublisher",
                                        canComputeNew: false,
                                        canResolveRelativePaths: false,
                                        canRunOnFailed: true,
                                        consoleParsers: [
                                            [
                                                parserName: 'Java Compiler (javac)'
                                            ],
                                            [
                                                parserName: 'Maven'
                                            //],
                                            //[
                                            //    parserName: 'JSLint',
                                            //    pattern: 'pmd.xml'
                                            ]
                                        ],
                                        //unstableTotalAll: '10',
                                        //unstableTotalHigh: '0',
                                        //failedTotalAll: '10',
                                        //failedTotalHigh: '0',
                                        usePreviousBuildAsReference: true,
                                        useStableBuildAsReference: true
                                        ])

                                    step([
                                        $class: "AnalysisPublisher",
                                        canComputeNew: false,
                                        checkStyleActivated: false,
                                        defaultEncoding: '',
                                        dryActivated: false,
                                        findBugsActivated: false,
                                        healthy: '',
                                        opentasksActivated: false,
                                        pmdActivated: false,
                                        unHealthy: ''
                                        ])

                                    step([
                                        $class: 'LogParserPublisher',
                                        parsingRulesPath:
                                        '/jenkins/deploy-log_parsing_rules',
                                        failBuildOnError: false,
                                        unstableOnWarning: false,
                                        useProjectRule: false
                                        ])

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

                                    script {
                                        shellcheckExitCode = sh(
                                            script: 'shellcheck -f checkstyle *.sh > checkstyle.xml',
                                            returnStdout: true,
                                            returnStatus: true
                                        )
                                        sh "echo ${shellcheckExitCode}"
                                    } // script

                                    checkstyle canComputeNew: false, defaultEncoding: '', healthy: '50', pattern: '**/checkstyle.xml', shouldDetectModules: true, thresholdLimit: 'normal', unHealthy: '100'

                                    //step([
                                    //    $class: 'RobotPublisher',
                                    //    disableArchiveOutput: false,
                                    //    logFileName: 'log.html',
                                    //    otherFiles: '**/*.png',
                                    //    outputFileName: 'output.xml',
                                    //    outputPath: '.',
                                    //    passThreshold: 100,
                                    //    reportFileName: 'report.html',
                                    //    unstableThreshold: 0
                                    //    ])

                                    //script {
                                    //
                                    //  utils.checkAPI()
                                    //
                                    //} //script

                                    if (params.DRY_RUN == false) {
                                        junit '**/target/surefire-reports/TEST-*.xml'
                                    } // if DRY_RUN

                                } // script
                            } // stage Quality - Basic results check
                            //stage('SonarQube analysis') {
                            //    environment {
                            //        SONAR_SCANNER_OPTS = "-Xmx1g"
                            //        SONAR_INSTANCE = "sonardev"
                            //    }
                            //    script {
                            //        if (params.DRY_RUN == false) {
                            //            def scannerHome = tool name: 'Sonar-Scanner-3.2', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                            //            withSonarQubeEnv("${env.SONAR_INSTANCE}") {
                            //                //sh "${scannerHome}/bin/sonar-scanner -D sonar-project.properties"
                            //                sh "/usr/local/sonar-runner/bin/sonar-scanner -D sonar-project.properties"
                            //            }
                            //        } // if DRY_RUN
                            //    }
                            //} // stage SonarQube analysis
                        } // script
                    } // steps
                } // stage Build

                stage('Quality - More check') {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                    //    }
                    //}
                    when {
                        branch 'develop'
                    }
                    steps {
                        script {
                            stage('Site') {
                                    script {
                                        if (params.DRY_RUN == false) {
                                            //unstash 'source'
                                            withMaven(
                                                maven: 'maven-latest',
                                                jdk: 'java-latest',
                                                globalMavenSettingsConfig: 'fr-maven-default',
                                                mavenLocalRepo: './.repository',
                                                options: [
                                                    pipelineGraphPublisher(
                                                        ignoreUpstreamTriggers: !isReleaseBranch(),
                                                        skipDownstreamTriggers: !isReleaseBranch(),
                                                        lifecycleThreshold: 'deploy'
                                                        ),
                                                    artifactsPublisher(disabled: true)
                                                ]
                                                ) {
                                                // Run the maven build
                                                sh "./mvnw site -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                                            } // withMaven
                                            //sh "grunt ngdocs"
                                    } // if DRY_RUN
                                    } //script
                            } // stage Site
                        } // script
                    } // steps
                } // stage Quality - More check

                stage('Security') {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                    //    }
                    //}
                    when {
                        branch 'develop'
                    }
                    steps {
                        script {
                            stage('Security - Dependency check') {
                                    script {

                                    if (params.DRY_RUN == false) {
                                        //input id: 'DependencyCheck', message: 'Approve DependencyCheck?', submitter: 'aandrieu'

                                        if (params.DRY_RUN == false) {
                                            //unstash 'source'
                                            withMaven(
                                                maven: 'maven-latest',
                                                jdk: 'java-latest',
                                                globalMavenSettingsConfig: 'fr-maven-default',
                                                mavenLocalRepo: './.repository',
                                                options: [
                                                    pipelineGraphPublisher(
                                                        ignoreUpstreamTriggers: !isReleaseBranch(),
                                                        skipDownstreamTriggers: !isReleaseBranch(),
                                                        lifecycleThreshold: 'deploy'
                                                        ),
                                                    artifactsPublisher(disabled: true)
                                                ]
                                            ) {
                                                // Run the maven build
                                                sh "./mvnw org.owasp:dependency-check-maven:check -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                                            } //withMaven
                                            //sh "nsp check"

                                            dependencyCheckPublisher canComputeNew: false, defaultEncoding: '', healthy: '50', pattern: '**/dependency-check-report.xml ', shouldDetectModules: true, thresholdLimit: 'normal', unHealthy: '100'
                                        } // if DRY_RUN

                                        }
                                    } //script
                            } // stage Security - Dependency check
                            stage('Security - Checkmarx') {
                                agent {
                                    node {
                                        label 'FR1CSLFRBM0058'
                                    }
                                }
                                script {

                                     if (params.DRY_RUN == false) {

                                         def userInput = true
                                         def didTimeout = false

                                         try {
                                             timeout(time: 15, unit: 'SECONDS') { // change to a convenient timeout for you
                                                     userInput = input(
                                                     id: 'Checkmarx', message: 'Skip Checkmarx?', parameters: [
                                                     [$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: 'Please confirm you agree with this']
                                                     ])
                                             }
                                         } catch(err) { // timeout reached or input false
                                             def user = err.getCauses()[0].getUser()
                                             if('SYSTEM' == user.toString()) { // SYSTEM means timeout.
                                                 didTimeout = true
                                             } else {
                                                 userInput = false
                                                 echo "Aborted by: [${user}]"
                                             }
                                         }

                                         if (didTimeout) {
                                             // do something on timeout
                                             echo "no input was received before timeout"
                                         } else if (userInput == true) {
                                             // do something
                                             echo "this was successful"
                                         } else {
                                             // do something else
                                             echo "this was not successful"
                                             //currentBuild.result = 'FAILURE'

                                     step([
                                         $class: 'CxScanBuilder',
                                         avoidDuplicateProjectScans: true,
                                         comment: '',
                                                 excludeFolders: '.repository, target, .node_cache, .node_tmp, .grunt, .bower, bower_components, node_modules, node, lib, libs, docs, help, test, Sample, vendors, dist, build, site, fonts, images, coverage, .mvn, ansible, bm',
                                         excludeOpenSourceFolders: '',
                                         exclusionsSetting: 'job',
                                         failBuildOnNewResults: true,
                                         failBuildOnNewSeverity: 'HIGH',
                                         filterPattern: '''
!**/_cvs/**/*, !**/.svn/**/*,   !**/.hg/**/*,   !**/.git/**/*,  !**/.bzr/**/*, !**/bin/**/*,
!**/obj/**/*,  !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr,     !**/*.iws,
!**/*.bak,     !**/*.tmp,       !**/*.aac,      !**/*.aif,      !**/*.iff,     !**/*.m3u, !**/*.mid, !**/*.mp3,
!**/*.mpa,     !**/*.ra,        !**/*.wav,      !**/*.wma,      !**/*.3g2,     !**/*.3gp, !**/*.asf, !**/*.asx,
!**/*.avi,     !**/*.flv,       !**/*.mov,      !**/*.mp4,      !**/*.mpg,     !**/*.rm,  !**/*.swf, !**/*.vob,
!**/*.wmv,     !**/*.bmp,       !**/*.gif,      !**/*.jpg,      !**/*.png,     !**/*.psd, !**/*.tif, !**/*.swf,
!**/*.jar,     !**/*.zip,       !**/*.rar,      !**/*.exe,      !**/*.dll,     !**/*.pdb, !**/*.7z,  !**/*.gz,
!**/*.tar.gz,  !**/*.tar,       !**/*.gz,       !**/*.ahtm,     !**/*.ahtml,   !**/*.fhtml, !**/*.hdm,
!**/*.hdml,    !**/*.hsql,      !**/*.ht,       !**/*.hta,      !**/*.htc,     !**/*.htd, !**/*.war, !**/*.ear,
!**/*.htmls,   !**/*.ihtml,     !**/*.mht,      !**/*.mhtm,     !**/*.mhtml,   !**/*.ssi, !**/*.stm,
!**/*.stml,    !**/*.ttml,      !**/*.txn,      !**/*.xhtm,     !**/*.xhtml,   !**/*.class, !**/*.iml, !Checkmarx/Reports/*.*,
!**/*.csv,     !**/test/**/*,   !**/*Test.java, !**/*_UT.java,  !**/*_UT.groovy,!**/*_IT.java, !**/*_IT.groovy,  !**/*Test.groovy,
!**/Sample/**/*, !**/.xrp, !**/.yml,
!**/.xls, !**/.xlsx, !**/.doc, !**/.pdf, !**/.pfx, !**/.xll,
!**/.dylib, !**/.lib, !**/.a, !**/.so, !**/.pkg, !**/.swp, !**/.ttf, !**/.msi, !**/.chm,
''',
                                        fullScanCycle: 10,
                                            fullScansScheduled: false,
                                            generatePdfReport: true,
                                            highThreshold: 50,
                                            includeOpenSourceFolders: '',
                                            incremental: true,
                                            lowThreshold: 1000,
                                            mediumThreshold: 100,
                                            osaArchiveIncludePatterns: '*.zip, *.war, *.ear, *.tgz',
                                            osaHighThreshold: 10,
                                            osaInstallBeforeScan: false,
                                            osaLowThreshold: 1000,
                                            osaMediumThreshold: 100,
                                            useOwnServerCredentials: true,
                                            credentialsId: 'mgr.jenkins.checkmarx',
                                            //groupId: '7bc62ee5-b91d-4908-aea7-d12f982f70d0',
                                            //password: '{AQAAABAAAAAQ4zdhkim0EaO0/PY/6/KdHzYOatEHaH/thBW+K7YJmL4=}',
                                            groupId: '1d9286a6-fc4f-4d65-9010-045ca9032198',
                                            password: '{AQAAABAAAAAQ1/XWT55MpaM5ha9F+rXg7L51B2fPfoy3Yg6KD7H7e4A=}',
                                            //preset: '36', // Default checkmarx
                                            preset: '17', // Default 2014
                                            projectName: 'MGR_UIComponents_Sample_Checkmarx',
                                            serverUrl: 'https://par-checkmarx',
                                            skipSCMTriggers: true,
                                            sourceEncoding: '1',
                                            username: '',
                                            vulnerabilityThresholdEnabled: true,
                                            vulnerabilityThresholdResult: 'FAILURE',
                                            waitForResultsEnabled: true
                                        ])

                                }
                                     } // if DRY_RUN

                                } // script
                            } // stage Security - Checkmarx
                        } // script
                    } // steps
                } // stage Security
            } // parallel
        } // Main

        stage('Gather') { // for display purposes
            failFast true
            parallel {
                // First, you need SonarQube server 6.2+
                // TODO https://blog.sonarsource.com/breaking-the-sonarqube-analysis-with-jenkins-pipelines/
                // No need to occupy a node
                //stage("Quality Gate") {
                //    steps {
                //        script {
                //
                //            if (params.DRY_RUN == false) {
                //                context="sonarqube/qualitygate"
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
                stage('Runtime - Docker') {
                    steps {
                        script {
                            if (params.DRY_RUN == false) {
                                sh '''echo "TODO : RUN Docker "'''
                                //sh '''TARGET_FILE=`ls $WORKSPACE/target/*.zip`;
                                //      cp $TARGET_FILE $WORKSPACE/docker/build/local-build-archive/'''
                                //docker_build_args="--no-cache --pull --build-arg JENKINS_HOME=/home/jenkins"
                                //docker.withRegistry("${DOCKER_REGISTRY_URL}", "${DOCKER_REGISTRY_CREDENTIAL}") {
                                //    def container = docker.build("${env.DOCKER_RUNTIME_IMG}:${env.BUILD_ID}", "${docker_build_args} -f Dockerfile-ubuntu:16.04 . ")
                                //    pushDockerImage(container, "${env.DOCKER_RUNTIME_IMG}", "${env.DOCKER_TAG}")
                                //}
                            } // if
                        }
                    }
                } // stage Runtime - Docker
                stage('Automated Acceptance Testing') {
                    environment {
                        TARGET_ARCH="_RHEL7"
                    }
                    steps {
                        script {
                            if (params.DRY_RUN == false) {
                                try {
                                    sh '''echo "TODO : RUN Automated Acceptance Testing "'''
                                    //sh '''docker-compose -f $WORKSPACE/docker/run/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} up ${DOCKER_COMPOSE_UP_OPTIONS}'''
                                }
                                catch(exc) {
                                    echo 'Error: There were errors in tests. '+exc.toString()
                                    error 'There are errors in tests'
                                }
                            } // if DRY_RUN
                        } // script
                    } // steps
                } // stage Automated Acceptance Testing
            } // parallel
        } // stage  Gather

        stage('Push') { // for display purposes
            failFast true
            parallel {
                stage('Deploy') {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                    //    }
                    //}
                    when {
                        expression { BRANCH_NAME ==~ /(release|master|develop)/ }
                    }
                    steps {
                        script {
                            if (params.DRY_RUN == false) {
                                //unstash 'source'
                                withMaven(
                                    maven: 'maven-latest',
                                    jdk: 'java-latest',
                                    globalMavenSettingsConfig: 'fr-maven-default',
                                    mavenLocalRepo: './.repository',
                                    options: [
                                        pipelineGraphPublisher(
                                            ignoreUpstreamTriggers: !isReleaseBranch(),
                                            skipDownstreamTriggers: !isReleaseBranch(),
                                            lifecycleThreshold: 'deploy'
                                            ),
                                        artifactsPublisher(disabled: true)
                                    ]
                                    ) {
                                    // Run the maven build
                                    sh "./mvnw deploy -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                                } // withMaven
                                //sh "npm run publish:all"
                            } // if DRY_RUN
                        } //script
                    }
                    post {
                        success {
                            node('docker-inside') {
                            script {
                                manager.addShortText("deployed")
                                manager.createSummary("gear2.gif").appendText("<h2>Successfully deployed</h2>", false)

                                currentBuildNumber = manager.build.number
                                    //if (manager.setBuildNumber(currentBuildNumber - 1)) {
                                    //    actions = manager.build.actions
                                    //    actions.each { action ->
                                    //        if (action.metaClass.hasProperty(action, "text") && action.text.contains("deployed")) {
                                    //            actions.remove(action)
                                    //        }
                                    //    }
                                    //    currDate = new Date().dateTimeString
                                    //    manager.addShortText("undeployed: $currDate", "grey", "white", "0px", "white")
                                    //    manager.createSummary("gear2.gif").appendText("<h2>Undeployed: $currDate</h2>", false, false, false, "grey")
                                    //} // if
                            } //script
                            } // node
                        }
                    } // post
                } // stage Deploy
                stage('Archive Artifacts') {
                    //agent {
                    //    docker {
                    //       image DOCKER_IMAGE
                    //       reuseNode true
                    //       registryUrl DOCKER_REGISTRY_URL
                    //       registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //       args DOCKER_OPTS
                    //    }
                    //}
                    steps {
                        script {
                            String ARTIFACTS = ['*_VERSION.TXT',
                                            '**/target/*.swf',
                                            '**/target/*.log',
                                            'reports/*',
                                            '**/MD5SUMS.md5',
                                            'Jenkinsfile'].join(', ')

                            if ((env.BRANCH_NAME == 'develop') || (env.BRANCH_NAME ==~ /feature\/.*/)) {
                                ARTIFACTS = ["${ARTIFACTS}",
                                    "**/target/*SNAPSHOT.jar",
                                    "**/target/*SNAPSHOT.war",
                                    "**/target/*SNAPSHOT*.zip",
                                    "**/target/*test.jar"].join(', ')
                            }

                            if ((env.BRANCH_NAME ==~ /release\/.*/) || (env.BRANCH_NAME ==~ /master\/.*/)) {
                                ARTIFACTS = ["${ARTIFACTS}",
                                    "**/target/*test.jar"].join(', ')
                            }

                            if ((env.BRANCH_NAME == 'develop') || (env.BRANCH_NAME ==~ /release\/.*/) || (env.BRANCH_NAME ==~ /master\/.*/)) {
                                archiveArtifacts artifacts: "${ARTIFACTS}", excludes: null, fingerprint: true, onlyIfSuccessful: true

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

                                publishHTML (target: [
                                  allowMissing: true,
                                  alwaysLinkToLastBuild: false,
                                  keepAll: true,
                                  //reportDir: 'target/*',
                                  reportFiles: 'gc.png speed.har CHANGELOG.html',
                                  reportName: "Reports"
                                ])

                                //stash includes: '${ARTIFACTS}', name: 'app'
                                //unstash 'app'
                            }
                        } //script
                    }
                } // stage Archive Artifacts

                stage("Git Tag") {
                    //agent {
                    //    docker {
                    //        image DOCKER_IMAGE
                    //        reuseNode true
                    //        registryUrl DOCKER_REGISTRY_URL
                    //        registryCredentialsId DOCKER_REGISTRY_CREDENTIAL
                    //        args DOCKER_OPTS
                    //    }
                    //}
                    steps {
                        script {

                            if (params.DRY_RUN == false) {
                                //input id: 'Tag', message: 'Approve Tagging?', submitter: 'aandrieu'

                            utils.setBuildName()
                            utils.createVersionTextFile("${env.TARGET_PROJECT}_VERSION.TXT")

                                //utils.manualPromotion()

                                if (isReleaseBranch()) {
                                    utils.gitTagLocal("${env.TARGET_TAG}_SUCCESSFULL")
                                    utils.gitTagRemote("${env.TARGET_TAG}_SUCCESSFULL")
                                }
                            } // if DRY_RUN

                       } // script
                    } // steps
                } // stage Git Tag
            } //parallel
        } //stage Push

    } // stages
    post {
        // always means, well, always run.
        always {
            node('docker-inside') {
                echo "Hi there"
                script {
                    utils.notifyMe { }
                    //try {
                    //  sh '''docker system prune -f;"'''
                    //  //docker rmi "${env.DOCKER_BUILD_IMG}:${env.DOCKER_TAG}
                    //} catch(exc) {
                    //  echo 'Warn: There was a problem Cleaning local docker repo. '+exc.toString()
                    //}
                }
            } // node
        }
        failure {
            echo "I'm failing"
            //manager.createSummary("warning.gif").appendText("<h1>Build failed!</h1>", false, false, false, "red")
        }
        // changed means when the build status is different than the previous build's status.
        changed {
            echo "I'm different"
        }
        // success, failure, unstable all run if the current build status is successful, failed, or unstable, respectively
        success {
            node('docker-inside') {
                echo "I succeeded"
                //script {
                //    if (! isReleaseBranch()) { cleanWs() }
                //}
            } //node
        }
    } // post
} // pipeline
