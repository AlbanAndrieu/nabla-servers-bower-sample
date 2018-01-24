#!/usr/bin/env groovy
/*
    Point of this Jenkinsfile is to:
    - build java project
*/
pipeline {
    agent { label 'javascript' }
    //triggers {
    //    cron('H */4 * * 1-5')
    //    pollSCM('H 4/* 0 0 1-5')
    //}
    parameters {
        string(defaultValue: 'master', description: 'Default git branch to override', name: 'GIT_BRANCH_NAME')
        string(defaultValue: '44447', description: 'Default cargo rmi port to override', name: 'CARGO_RMI_PORT')
        string(defaultValue: '', description: 'Default workspace suffix to override', name: 'WORKSPACE_SUFFIX')
        string(defaultValue: 'http://localhost:9190', description: 'Default URL used by deployment tests', name: 'SERVER_URL')
        string(defaultValue: '/#/', description: 'Default context', name: 'SERVER_CONTEXT')
        string(defaultValue: 'LATEST_SUCCESSFULL', description: 'Create a TAG', name: 'TARGET_TAG')
        string(defaultValue: 'jenkins', description: 'User', name: 'TARGET_USER')
        booleanParam(defaultValue: false, description: 'Dry run', name: 'DRY_RUN')
        booleanParam(defaultValue: false, description: 'Clean before run', name: 'CLEAN_RUN')
        booleanParam(defaultValue: false, description: 'Debug run', name: 'DEBUG_RUN')
        }
    environment {
        JENKINS_CREDENTIALS = '8aaa3139-bdc4-4774-a08d-ee6b22a7e0ac'
        GIT_BRANCH_NAME = "${params.GIT_BRANCH_NAME}"
        CARGO_RMI_PORT = "${params.CARGO_RMI_PORT}"
        WORKSPACE_SUFFIX = "${params.WORKSPACE_SUFFIX}"
        DRY_RUN = "${params.DRY_RUN}"
        CLEAN_RUN = "${params.CLEAN_RUN}"
        DEBUG_RUN = "${params.DEBUG_RUN}"
        //echo "JOB_NAME: ${env.JOB_NAME} : ${env.JOB_BASE_NAME}"
        TARGET_PROJECT = sh(returnStdout: true, script: "echo ${env.JOB_NAME} | cut -d'/' -f -1").trim()
        BRANCH_NAME = "${env.BRANCH_NAME}"
            PROJECT_BRANCH = "${env.GIT_BRANCH}".replaceFirst("origin/","")
        BUILD_ID = "${env.BUILD_ID}"
        SONAR_BRANCH = sh(returnStdout: true, script: "echo ${env.BRANCH_NAME} | cut -d'/' -f 2-").trim()
        GIT_AUTHOR_EMAIL = "${env.CHANGE_AUTHOR_EMAIL}"
        GIT_PROJECT = "nabla"
        GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
        GIT_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}.git"
        GIT_COMMIT = "TODO"
        }
    options {
            disableConcurrentBuilds()
            timeout(time: 120, unit: 'MINUTES')
            buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    stages {
        stage('Cleaning') {
            steps {
                //bitbucketStatusNotify ( buildState: 'INPROGRESS' )
                script {
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
            }
        }
        stage('Preparation') { // for display purposes
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
                    branches: [[name: "${GIT_BRANCH_NAME}"]],
                    browser: [
                    $class: 'Stash',
                    repoUrl: "${GIT_BROWSE_URL}"],
                    doGenerateSubmoduleConfigurations: false,
                extensions: [
                    [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true],
                    [$class: 'LocalBranch', localBranch: '${GIT_BRANCH_NAME}'],
                    [$class: 'RelativeTargetDirectory', relativeTargetDir: 'bm'],
                    [$class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'],
                    [$class: 'IgnoreNotifyCommit'],
                    [$class: 'ChangelogToBranch', options: [compareRemote: 'origin', compareTarget: 'release/1.0.0']]
                ],
                gitTool: 'git-latest',
                submoduleCfg: [],
                userRemoteConfigs: [[
                    credentialsId: "${JENKINS_CREDENTIALS}",
                    url: "${GIT_URL}"]
                ]
                ])

                script {
                    currentBuild.displayName = [
                        '#',
                        BRANCH_NAME,
                        ' (',
                        GIT_COMMIT,
                        ', ',
                        currentBuild.displayName,
                        ')'
                    ].join("")
                }

                ansiColor('xterm') {
sh '''
set -e
#set -xve

echo USER $USER

#source /etc/profile

cd ./nabla/env/scripts/jenkins/

./step-0-1-run-processes-cleaning.sh || exit 1

./step-2-2-1-build-before-java.sh || exit 1

cd ${WORKSPACE}

echo NODE_PATH ${NODE_PATH}
#export PATH=./:./node/:${PATH}
echo PATH ${PATH}
echo JAVA_HOME ${JAVA_HOME}
echo DISPLAY ${DISPLAY}
echo TARGET_PROJECT ${TARGET_PROJECT}

#export VERBOSE=true

echo BUILD_NUMBER: ${BUILD_NUMBER}
echo BUILD_ID: ${BUILD_ID}
echo IS_M2RELEASEBUILD: ${IS_M2RELEASEBUILD}

export ZAP_PORT=8091
export JETTY_PORT=9190
export SERVER_HOST=localhost
#export SERVER_URL="http://localhost:${JETTY_PORT}/"

echo "ZAP_PORT : $ZAP_PORT"
echo "CARGO_RMI_PORT : $CARGO_RMI_PORT"
echo "JETTY_PORT : $JETTY_PORT"
echo "SERVER_HOST : $SERVER_HOST"
echo "SERVER_URL : $SERVER_URL"
echo "ZAPROXY_HOME : $ZAPROXY_HOME"

#curl -i -v -k ${SERVER_URL}${SERVER_CONTEXT} --data "username=tomcat&password=microsoft"

wget --http-user=admin --http-password=Motdepasse12 "http://home.nabla.mobi:8280/manager/text/undeploy?path=/test" -O -

Xvfb :99 -ac -screen 0 1280x1024x24 &
export DISPLAY=:99
nice -n 10 x11vnc 2>&1 &

#google-chrome --no-sandbox &

#killall Xvfb

exit 0
'''
                } //ansiColor
            load "${env.WORKSPACE}/bm/Scripts/release/jenkins-env.groovy"
            echo "${env.SONAR_BRANCH}"
            echo "${env.RELEASE_VERSION}"
            } //step
        }
        stage('Build') {
            environment {
                MAVEN_ROOT_POM = "${WORKSPACE}/${TARGET_PROJECT}/pom.xml"
                MAVEN_SETTINGS_FILE = "${WORKSPACE}/${TARGET_PROJECT}/settings.xml"
                SONAR_MAVEN_COMMANDS = "sonar:sonar"
            }
            steps {
                script {
                    // Maven opts
                    String MAVEN_OPTS = ["-Djava.awt.headless=true",
                    "-Dsun.zip.disableMemoryMapping=true",
                    "-Djava.io.tmpdir=${WORKSPACE}/target/tmp"].join(" ")

                    if (params.CLEAN_RUN == true) {
                        MAVEN_OPTS << " -Xmx1536m -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -XX:+HeapDumpOnOutOfMemoryError "
                    }

                    echo "Maven OPTS have been specified: ${MAVEN_OPTS}"

                    withMaven(
                        maven: 'maven-latest',
                        jdk: 'java-latest',
                        globalMavenSettingsConfig: 'nabla-default',
                        mavenLocalRepo: '.repository',
                        mavenOpts: "${MAVEN_OPTS}",
                        options: [pipelineGraphPublisher(skipDownstreamTriggers: true)]
                    ) {

                        String MAVEN_GOALS = ["-B -U -e -Dsurefire.useFile=false",
                            //"-f ${MAVEN_ROOT_POM}",
                            //"-s ${MAVEN_SETTINGS_FILE}",
                            //"-T3",
                            "clean install",
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

                        wrap([$class: 'Xvfb', autoDisplayName: true]) {
                            // Run the maven build
                            sh "mvn ${MAVEN_GOALS}"
                        }
                        stash excludes: 'target/, .bower/, .tmp/, bower_components/, node/, node_modules/, coverage/, build/', includes: '**', name: 'source'
                        //stash includes: 'node_modules/', name: 'node_modules'
                        //unstash 'node_modules'
                    } //withMaven
                } //script
            } // steps
            //steps {
            //  withSonarQubeEnv("${env.SONAR_INSTANCE}") {
            //  sh 'mvn -s ${WORKSPACE}/settings.xml -f ${WORKSPACE}/pom.xml ${SONAR_MAVEN_COMMANDS} ${SONAR_MAVEN_GOALS}'
            //  }
            //}
        } // stage Build

        stage('Security') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
							// Run the maven build
							sh "mvn org.owasp:dependency-check-maven:check"
                            //sh "nsp check"
                        } //withMaven
                    }
                } //script
            }
        } // stage Security

        stage('Site') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
                            // Run the maven build
                            sh "mvn site"
                            //sh "grunt ngdocs"
                        } // withMaven
                    }
                } //script
            }
        } // stage Site

        stage('Deploy') {
            when {
                expression { BRANCH_NAME ==~ /(release|master)/ }
                anyOf { branch 'develop'; branch 'deploy' }
            }
            steps {
                script {
                    if (params.DRY_RUN == false) {
                        //unstash 'source'
                        withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
                            // Run the maven build
                            sh "mvn deploy"
                            //sh "npm run publish:all"
                        } // withMaven
                    }
                } //script
            }
        }/ / stage Deploy

        stage('Results') {
            steps {
                //warnings canComputeNew: false, canResolveRelativePaths: false, categoriesPattern: '', consoleParsers: [[parserName: 'Java Compiler (javac)'], [parserName: 'Maven']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''

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
                            ]
                        ]
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
                        $class: 'LogParserPublisher', parsingRulesPath: '/home/jenkins/deploy-log_parsing_rules', useProjectRule: false
                    ])

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
                    sshagent(['jenkins-ssh']) {
                        String versionInfo = "${TARGET_PROJECT}: BUILD: ${BUILD_ID} SHA1: ${GIT_COMMIT} BRANCH: ${BRANCH_NAME}"
                        String versionFile = "${env.WORKSPACE}/${TARGET_PROJECT}_VERSION.TXT"
                        sh "echo ${versionInfo} > ${versionFile}"
                    }

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
                        //stash includes: '${ARTIFACTS}', name: 'app'
                        //unstash 'app'
                        // tag on successfull build
                        sshagent(['jenkins-ssh']) {
                            sh """
                                ./bin/tag_on_successfull_build.sh
                            """
                        }
                    }
                } //script
            }
        } // stage Archive Artifacts
    }
    post {
        // always means, well, always run.
        always {
          echo "Hi there"
          def content = '${SCRIPT, template="groovy-html-cut-pipeline.template"}'
          emailext attachLog: true,
              body: ("${TARGET_PROJECT}: build on branch ${BRANCH_NAME} resulted in ${currentBuild.result}"),
              subject: ("${currentBuild.result}: ${TARGET_PROJECT} ${currentBuild.displayName}"),
                   compressLog: true,
              to: "${GIT_AUTHOR_EMAIL}",
              body: content
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
        }
    }
}
