#!/usr/bin/env groovy
/*
    Point of this Jenkinsfile is to:
    - define global behavior
*/
def utils

def isReleaseBranch() {
    env.BRANCH_NAME ==~ /develop/ || env.BRANCH_NAME ==~ /master/ || env.BRANCH_NAME ==~ /release\/.*/
}

def daysToKeep = isReleaseBranch() ? '30' : '10'
def numToKeep = isReleaseBranch() ? '10' : '3'
def artifactDaysToKeep = isReleaseBranch() ? '30' : '10'
def artifactNumToKeep = isReleaseBranch() ? '3' : '1'
def cronString = isReleaseBranch() ? 'H H(3-7) * * 1-5' : '@daily'
def pollSCMString = isReleaseBranch() ? '@montlhy' : '@hourly'

def mvn_command(){ isReleaseBranch() ? 'clean deploy' : 'clean install' }
//def npm_command(){ isReleaseBranch() ? 'npm run publish:all' : 'npm run build' }
def ignoreTestFailures() { isReleaseBranch() ? 'false' : 'true' }
//End : Switches for release branches

//JENKINS-42369 : Docker options need to be defined outside of pipeline
def DOCKER_OPTS = [
//  '-v /etc/timezone:/etc/timezone:ro',
//  '-v /etc/localtime:/etc/localtime:ro',
//  '-v /etc/passwd:/etc/passwd',
//  '-v /etc/group:/etc/group',
  '-e HOME=${WORKSPACE}',
  '-e NPM_CONFIG_PREFIX=${WORKSPACE}/.npm',
  '--dns-search="nabla.mobi"'
  ].join(" ")

def DOCKER_REGISTRY = 'hub.docker.com'
def DOCKER_REGISTRY_CREDENTIALSID = 'jenkins'
def DOCKER_REGISTRY_URL = "https://${DOCKER_REGISTRY}/"
def DOCKER_IMAGE = 'nabla/ansible-jenkins-slave-docker:latest'

//Temp scripted code to stop triggering feature branch builds when develop builds
//as the ignoreUpstreamTriggers does not seem to work as expected
if (isReleaseBranch()) {
    properties([
        pipelineTriggers([
            snapshotDependencies(),
        ])
    ])
}

def artifacts = "*_VERSION.TXT"

/*
    Point of this Jenkinsfile is to:
    - build java project
*/
pipeline {
    agent {
      label 'javascript'
    }
    triggers {
      //upstream(upstreamProjects: 'job1,job2', threshold: hudson.model.Result.SUCCESS)
      cron(cronString)
      pollSCM(pollSCMString)
      //snapshotDependencies()
      bitbucketPush()
    }
    parameters {
        string(defaultValue: 'master', description: 'Default git branch to override', name: 'GIT_BRANCH_NAME')
        string(defaultValue: '44447', description: 'Default cargo rmi port to override', name: 'CARGO_RMI_PORT')
        string(defaultValue: '', description: 'Default workspace suffix to override', name: 'WORKSPACE_SUFFIX')
        string(defaultValue: 'http://localhost:9190', description: 'Default URL used by deployment tests', name: 'SERVER_URL')
        string(defaultValue: '/test/#/', description: 'Default context', name: 'SERVER_CONTEXT')
        string(defaultValue: 'LATEST_SUCCESSFULL', description: 'Create a TAG', name: 'TARGET_TAG')
        string(defaultValue: 'jenkins', description: 'User', name: 'TARGET_USER')
        booleanParam(defaultValue: false, description: 'Dry run', name: 'DRY_RUN')
        booleanParam(defaultValue: false, description: 'Clean before run', name: 'CLEAN_RUN')
        booleanParam(defaultValue: false, description: 'Debug run', name: 'DEBUG_RUN')
        booleanParam(defaultValue: false, description: 'Debug mvnw', name: 'MVNW_VERBOSE')
    }
    environment {
        // Maven opts
        MAVEN_OPTS = [
          //"-Xms1G -Xmx2G",
          "-Djava.awt.headless=true",
          "-Dsun.zip.disableMemoryMapping=true",
          "-Djava.io.tmpdir=target/tmp"
        ].join(" ")
        JENKINS_CREDENTIALS = 'jenkins-ssh'
        GIT_BRANCH_NAME = "${params.GIT_BRANCH_NAME}"
        CARGO_RMI_PORT = "${params.CARGO_RMI_PORT}"
        WORKSPACE_SUFFIX = "${params.WORKSPACE_SUFFIX}"
        DRY_RUN = "${params.DRY_RUN}"
        CLEAN_RUN = "${params.CLEAN_RUN}"
        DEBUG_RUN = "${params.DEBUG_RUN}"
        //echo "JOB_NAME: ${env.JOB_NAME} : ${env.JOB_BASE_NAME}"
        TARGET_PROJECT = sh(returnStdout: true, script: "echo ${env.JOB_NAME} | cut -d'/' -f -1").trim()
        BRANCH_NAME = "${env.BRANCH_NAME}".replaceAll("feature/","")
        PROJECT_BRANCH = "${env.GIT_BRANCH}".replaceFirst("origin/","")
        BUILD_ID = "${env.BUILD_ID}"
        SONAR_BRANCH = sh(returnStdout: true, script: "echo ${env.BRANCH_NAME} | cut -d'/' -f 2-").trim()
        GIT_AUTHOR_EMAIL = "${env.CHANGE_AUTHOR_EMAIL}"
        GIT_PROJECT = "nabla"
        GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
        GIT_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        GIT_COMMIT = "TODO"
        DOCKER_TAG=buildDockerTag("${env.BRANCH_NAME}")
        }
    options {
        //disableConcurrentBuilds()
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
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                //bitbucketStatusNotify ( buildState: 'INPROGRESS' )
                script {
                    utils = load "Jenkinsfile-vars"
                    if (! isReleaseBranch()) { utils.abortPreviousRunningBuilds() }
                    if (params.CLEAN_RUN == true) {
                        stage('Clean everything') {
                            echo "Delete everything at start"
                            deleteDir()
                        }
                    } else {
                        stage('Clean bower npm cache') {
                            echo "Delete bower npm cache at start"
                            sh "rm -Rf .node_cache/ .node_tmp/  .tmp/ .bower/ node node_modules/ package-lock.json yarn.lock"
                        }
                    }
                }
            } // steps
        } // stage Cleaning
        stage('Preparation') { // for display purposes
            //agent {
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             registryCredentialsId "${DOCKER_REGISTRY_CREDENTIALSID}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                checkout scm
                //checkout([
                //    $class: 'GitSCM',
                //    branches: [[name: "*/master"]],
                //    browser: [
                //        $class: 'Stash',
                //        repoUrl: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample/'],
                //    doGenerateSubmoduleConfigurations: false,
                //    extensions: [[
                //        $class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: true, timeout: 30]],
                //        gitTool: 'git-latest',
                //        submoduleCfg: [],
                //        userRemoteConfigs: [[
                //            credentialsId: "${JENKINS_CREDENTIALS}",
                //            url: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample.git']]])
                script {
                    utils = load "Jenkinsfile-vars"
                    //properties(utils.createPropertyList())
                    sh "git rev-parse --short HEAD > .git/commit-id"
                    GIT_COMMIT = readFile('.git/commit-id')
                }

                echo "GIT_COMMIT: ${GIT_COMMIT}"
                echo "SONAR_BRANCH: ${SONAR_BRANCH}"
                echo "PROJECT_BRANCH: ${PROJECT_BRANCH}"
                echo "BRANCH_NAME: ${env.BRANCH_NAME}"
                echo "GIT_BRANCH_NAME: ${env.GIT_BRANCH_NAME}"

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "${env.GIT_BRANCH_NAME}"]],
                    browser: [
                    $class: 'Stash',
                    repoUrl: "${env.GIT_BROWSE_URL}"],
                    doGenerateSubmoduleConfigurations: false,
                extensions: [
                    [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                    [$class: 'LocalBranch', localBranch: '${env.GIT_BRANCH_NAME}'],
                    [$class: 'RelativeTargetDirectory', relativeTargetDir: 'bm'],
                    [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
                    [$class: 'IgnoreNotifyCommit'],
                    [$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.0.0']]
                ],
                gitTool: 'git-latest',
                submoduleCfg: [],
                userRemoteConfigs: [[
                    credentialsId: "${env.JENKINS_CREDENTIALS}",
                    url: "${env.GIT_URL}"]
                    ]
                ])

                ansiColor('xterm') {
sh '''
set -e
#set -xve

echo "USER : $USER"

#source /etc/profile

cd ./nabla/env/scripts/jenkins/

#./step-0-1-run-processes-cleaning.sh || exit 1

./step-2-2-1-build-before-java.sh || exit 1

cd ${WORKSPACE}

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
            load "${env.WORKSPACE}/bm/Scripts/release/jenkins-env.groovy"
            echo "${env.SONAR_BRANCH}"
            echo "${env.RELEASE_VERSION}"
            } //step
        } // stage Preparation

        stage('Build') {
            environment {
                MAVEN_ROOT_POM = "${WORKSPACE}/${TARGET_PROJECT}/pom.xml"
                SONAR_MAVEN_COMMANDS = "sonar:sonar"
            }
            //agent {
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                script {
                    //sh "npm run build"

                    if (params.DEBUG_RUN == true) {
                        MAVEN_OPTS << "-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -XX:+HeapDumpOnOutOfMemoryError "
                    }

                    echo "Maven OPTS have been specified: ${env.MAVEN_OPTS}"

                    configFileProvider([configFile(fileId: 'nabla-default',  targetLocation: 'gsettings.xml', variable: 'SETTINGS_XML')]) {
                        withMaven(
                            maven: 'maven-latest',
                            jdk: 'java-latest',
                            globalMavenSettingsConfig: 'nabla-default',
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

                                releasedVersion = utils.getReleasedVersion()
                                echo "Maven RELEASE_VERSION: ${releasedVersion}"

                                manager.addShortText("${releasedVersion}")

                            String MAVEN_GOALS = ["-U -e -Dsurefire.useFile=false",
                                "clean install",
                                //"-f ${MAVEN_ROOT_POM}",
                                "-s ${SETTINGS_XML}",
                                //"-T3",
                                //"-Dakka.test.timefactor=2",
                                //"-Dcargo.rmi.port=${CARGO_RMI_PORT} -Djetty.http.port=9190 -Dwebdriver.base.url=http://localhost:9190/ -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -DSTOP.PORT=19097 -DSTOP.KEY=STOP",
                                "-Djacoco.outputDir=${WORKSPACE}/target",
                                "-Dsonar.branch=${SONAR_BRANCH}",
                                "-Psonar,jacoco,codenarc,run-integration-test"].join(" ")

                            if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /feature\/.*/)) {
                                echo "pitest added"
                                MAVEN_GOALS << " org.pitest:pitest-maven:1.2.4:mutationCoverage "
                                echo "sonar added"
                                 MAVEN_GOALS << SONAR_MAVEN_COMMANDS
                            }

                            if (BRANCH_NAME ==~ /feature\/.*/) {
                                MAVEN_GOALS << " -Dsonar.organization=nabla -Dsonar.scm.enabled=false -Dsonar.scm-stats.enabled=false -Dissueassignplugin.enabled=false -Dsonar.pitest.mode=skip -Dsonar.scm.user.secured=false "
                                MAVEN_GOALS << " -Denforcer.skip=false -Dmaven.test.failure.ignore=false -Dmaven.test.failure.skip=false "
                            }

                            if ((BRANCH_NAME ==~ /release\/.*/) || (BRANCH_NAME ==~ /master\/.*/)) {
                                echo "skip test added"
                                MAVEN_GOALS << " -Denforcer.skip=true "
                                MAVEN_GOALS << " -Dmaven.test.failure.ignore=true -Dmaven.test.failure.skip=true "
                            }

                            echo "Maven GOALS have been specified: ${MAVEN_GOALS}"

                            wrap([$class: 'Xvfb', autoDisplayName: false, additionalOptions: '-pixdepths 24 4 8 15 16 32', parallelBuild: true]) {
                                // Run the maven build
                                sh "./mvnw ${MAVEN_GOALS}"
                            } // Xvfb
                            stash excludes: 'target/, .bower/, .tmp/, bower_components/, node/, node_modules/, coverage/, build/', includes: '**', name: 'source'
                            //stash includes: 'node_modules/', name: 'node_modules'
                            //unstash 'node_modules'
                        } //withMaven
                    } // configFileProvider
                } //script
            } // steps
            //steps {
            //  withSonarQubeEnv("${env.SONAR_INSTANCE}") {
            //  sh './mvnw -s ${WORKSPACE}/settings.xml -f ${WORKSPACE}/pom.xml ${SONAR_MAVEN_COMMANDS} ${SONAR_MAVEN_GOALS}'
            //  }
            //}
        } // stage Build

        //stage('SonarQube analysis') {
        //    environment {
        //        SONAR_SCANNER_OPTS = "-Xmx1g"
        //    }
        //    steps {
        //        sh "pwd"
        //        sh "/usr/local/sonar-runner/bin/sonar-scanner -D sonar-project.properties"
        //    }
        //}

        stage('Security') {
            when {
                branch 'develop'
            }
            //agent {
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(
                            maven: 'maven-latest',
                            jdk: 'java-latest',
                            globalMavenSettingsConfig: 'nabla-default',
                            mavenLocalRepo: '.repository',
                            options: [
                                pipelineGraphPublisher(ignoreUpstreamTriggers: !isReleaseBranch(),
                                                    skipDownstreamTriggers: !isReleaseBranch(),
                                                    lifecycleThreshold: 'deploy')
                            ]
                        ) {
                            // Run the maven build
                            sh "./mvnw org.owasp:dependency-check-maven:check -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                        } //withMaven
                        //sh "nsp check"
                    }
                } //script
            }
        } // stage Security

        stage('Site') {
            when {
                branch 'develop'
            }
            //agent {
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(
                            maven: 'maven-latest',
                            jdk: 'java-latest',
                            globalMavenSettingsConfig: 'nabla-default',
                            mavenLocalRepo: '.repository',
                            options: [
                                pipelineGraphPublisher(ignoreUpstreamTriggers: !isReleaseBranch(),
                                                    skipDownstreamTriggers: !isReleaseBranch(),
                                                    lifecycleThreshold: 'deploy')
                            ]
                        ) {
                            // Run the maven build
                            sh "./mvnw site -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                        } // withMaven
                        //sh "grunt ngdocs"
                    }
                } //script
            }
        } // stage Site

        stage('Deploy') {
            when {
                expression { BRANCH_NAME ==~ /(release|master|develop)/ }
                //anyOf { branch 'develop'; branch 'deploy' }
            }
            //agent {
            //    docker { image "${DOCKER_IMAGE}"
            //             reuseNode true
            //             registryUrl "${DOCKER_REGISTRY_URL}"
            //             args "${DOCKER_OPTS}"
            //    }
            //}
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(
                            maven: 'maven-latest',
                            jdk: 'java-latest',
                            globalMavenSettingsConfig: 'nabla-default',
                            mavenLocalRepo: '.repository',
                            options: [
                                pipelineGraphPublisher(ignoreUpstreamTriggers: !isReleaseBranch(),
                                                    skipDownstreamTriggers: !isReleaseBranch(),
                                                    lifecycleThreshold: 'deploy')
                            ]
                        ) {
                            // Run the maven build
                            sh "./mvnw deploy -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt"
                        } // withMaven
                        //sh "npm run publish:all"
                    }
                } //script
            }
            post {
                success {
                    script {
                        manager.addShortText("deployed")
                        manager.createSummary("gear2.gif").appendText("<h2>Successfully deployed</h2>", false)

                        currentBuildNumber = manager.build.number
                        if(manager.setBuildNumber(currentBuildNumber - 1)) {
                        actions = manager.build.actions
                            actions.each { action ->
                                if (action.metaClass.hasProperty(action, "text") && action.text.contains("deployed")) {
                                    actions.remove(action)
                                }
                            }
                            currDate = new Date().dateTimeString
                            manager.addShortText("undeployed: $currDate", "grey", "white", "0px", "white")
                            manager.createSummary("gear2.gif").appendText("<h2>Undeployed: $currDate</h2>", false, false, false, "grey")
                        }
                    } //script
                }
            }
        } // stage Deploy

        stage('Results') {
            steps {
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
                        //unstableTotalAll: '0',
                        usePreviousBuildAsReference: true
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
                        //sh "npm run lint"
                        //sh "shellcheck -f checkstyle *.sh > checkstyle.xml || true"
                        shellcheckExitCode = sh(
                            script: 'shellcheck -f checkstyle *.sh > checkstyle.xml',
                            returnStdout: true,
                            returnStatus: true
                        )
                        sh "echo ${shellcheckExitCode}"
                    } // script

                    step([
                        $class: 'CheckStylePublisher',
                        //pattern: '**/eslint.xml',
                        pattern: '**/checkstyle.xml',
                        unstableTotalAll: '0',
                        usePreviousBuildAsReference: true
                        ])

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

            }
            post {
                always {
                    junit '**/target/surefire-reports/TEST-*.xml'
                }
            }
        } // stage Results

        stage('Archive Artifacts') {
            steps {
                script {
                    String ARTIFACTS = ['*_VERSION.TXT',
                                    '**/target/*.swf',
                                    '**/target/*.log',
                                    'reports/*',
                                    '**/MD5SUMS.md5',
                                    'Jenkinsfile'].join(', ')

                    if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /feature\/.*/)) {
                        ARTIFACTS << ",**/target/*SNAPSHOT.jar, **/target/*SNAPSHOT.war, **/target/*SNAPSHOT*.zip"
                        ARTIFACTS << ",**/target/*test.jar"
                    }

                            if ((BRANCH_NAME ==~ /release\/.*/) || (BRANCH_NAME ==~ /master\/.*/)) {
                        ARTIFACTS << ",**/target/*test.jar"
                    }

                    if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /release\/.*/) || (BRANCH_NAME ==~ /master\/.*/)) {
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
                              reportDir: 'target/*',
                              reportFiles: 'gc.png speed.har CHANGELOG.html',
                              reportName: "Reports"
                            ])

                        //stash includes: '${ARTIFACTS}', name: 'app'
                        //unstash 'app'
                    }
                } //script
            }
        } // stage Archive Artifacts

        //stage('Docker') {
        //    steps {
        //        script {
        //            sh '''TARGET_FILE=`ls $WORKSPACE/target/*.zip`;
        //                  cp $TARGET_FILE $WORKSPACE/docker/build/local-build-archive/'''
        //            docker_build_args="--no-cache"
        //            docker.withRegistry('https://nabla.mobi', 'jenkins-https') {
        //            container = docker.build("${env.DOCKER_BUILD_IMG}:${env.DOCKER_BUILD_TAG}", "${docker_build_args} -f $WORKSPACE/docker/build/Dockerfile $WORKSPACE/docker/build/")
        //            pushDockerImage(container, "${env.DOCKER_BUILD_IMG}", "${env.DOCKER_TAG}")
        //          }
        //        } // script
        //    }
        //} // stage Docker

        stage("Git Tag") {
            steps {
                script {
                    utils.gitTagLocal()
                    utils.gitTagRemote()

                    //currentBuild.displayName = [
                    //    '#',
                    //    BRANCH_NAME,
                    //    ' (',
                    //    GIT_COMMIT,
                    //    ', ',
                    //    currentBuild.displayName,
                    //    ')'
                    //].join("")
                    utils.setBuildName()
                    utils.createVersionTextFile("${TARGET_PROJECT}_VERSION.TXT")

                    //sshagent(['jenkins-ssh']) {
                    //    String versionInfo = "${TARGET_PROJECT}: BUILD: ${BUILD_ID} BRANCH: ${BRANCH_NAME} SHA1: ${GIT_COMMIT}"
                    //    String versionFile = "${env.WORKSPACE}/${TARGET_PROJECT}_VERSION.TXT"
                    //    sh "echo ${versionInfo} > ${versionFile}"
                    //}

                } // script
            }
        } // stage Git Tag

    } // stages
    post {
        // always means, well, always run.
        always {
            echo "Hi there"
            script {
                utils.notifyMe()
                try {
                  sh '''docker system prune -f; docker rmi "${DOCKER_BUILD_IMG}:${DOCKER_BUILD_TAG}"'''
                } catch(exc) {
                  echo 'Warn: There was a problem Cleaning local docker repo. '+exc.toString()
                }
            }
        }
        failure {
            echo "I'm failing"
            //bitbucketStatusNotify(
            //  buildState: 'FAILED',
            //  buildKey: 'build',
            //  buildName: 'Build',
            //  buildDescription: 'Something went wrong with build!'
            //)
        }
        // changed means when the build status is different than the previous build's status.
        changed {
            echo "I'm different"
            //bitbucketStatusNotify(
            //  buildState: 'FAILED',
            //  buildKey: 'test',
            //  buildName: 'Test',
            //  buildDescription: 'Something went wrong with tests!'
            //)
        }
        // success, failure, unstable all run if the current build status is successful, failed, or unstable, respectively
        success {
            echo "I succeeded"
            //bitbucketStatusNotify ( buildState: 'SUCCESSFUL' )
            //archive "**/*"
            script {
                if (! isReleaseBranch()) { cleanWs() }
            }
        }
    } // post
} // pipeline

def buildDockerTag(branch) {
    branch.replaceAll('/','_')+"-test"
}

def pushDockerImage(container, image, tag)
{
  if (isReleaseBranch()) {
    container.push(tag)
    try {
      sh "docker rmi "+image+":"+tag
    }
    catch(exc) {
      echo 'Warn: There was a problem Deleting local docker image. '+exc.toString()
    }
  }
}

}
