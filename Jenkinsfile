#!/groovy
/*
	Point of this Jenkinsfile is to:
	- build java project
*/
properties([
	[$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false],
	parameters([
		string(defaultValue: 'master', description: 'Default git branch to override', name: 'GIT_BRANCH_NAME'),
		string(defaultValue: '44447', description: 'Default cargo rmi port to override', name: 'CARGO_RMI_PORT'),
		string(defaultValue: '', description: 'Default workspace suffix to override', name: 'WORKSPACE_SUFFIX'),
		string(defaultValue: 'http://localhost:9190', description: 'Default URL used by deployment tests', name: 'SERVER_URL'),
		string(defaultValue: '/#/', description: 'Default context', name: 'SERVER_CONTEXT'),
		string(defaultValue: 'LATEST_SUCCESSFULL', description: 'Create a TAG', name: 'TARGET_TAG'),
		string(defaultValue: 'jenkins', description: 'User', name: 'TARGET_USER'),
		booleanParam(defaultValue: false, description: 'Dry run', name: 'DRY_RUN'),
		booleanParam(defaultValue: false, description: 'Clean before run', name: 'CLEAN_RUN'),
		booleanParam(defaultValue: false, description: 'Debug run', name: 'DEBUG_RUN')
	]), buildDiscarder(
		logRotator(
			artifactDaysToKeepStr: '5',
			artifactNumToKeepStr: '3',
			daysToKeepStr: '100',
			numToKeepStr: '10'
		)
	), pipelineTriggers([
		cron('H H(3-7) * * 1-5')
		])
	])

String GIT_BRANCH_NAME = params.GIT_BRANCH_NAME
String CARGO_RMI_PORT = params.CARGO_RMI_PORT
String WORKSPACE_SUFFIX = params.WORKSPACE_SUFFIX

Boolean DRY_RUN = params.DRY_RUN
Boolean CLEAN_RUN = params.CLEAN_RUN
Boolean DEBUG_RUN = params.DEBUG_RUN

ansiColor('xterm') {
	node ('docker&&javascript') {

		println "JOB_NAME: ${env.JOB_NAME} : ${env.JOB_BASE_NAME}"
		String PROJECT = env.JOB_NAME
		try {
			PROJECT = env.JOB_NAME.split('/')[0]
			} catch (Exception error) {
			println error
		}
		println "PROJECT: ${PROJECT}"
		String BRANCH_NAME = env.BRANCH_NAME
		String BUILD_ID = env.BUILD_ID
		String SONAR_BRANCH = sh(returnStdout: true, script: "echo ${env.BRANCH_NAME} | cut -d'/' -f 2-").trim()
		String GIT_AUTHOR_EMAIL = env.CHANGE_AUTHOR_EMAIL

		if (GIT_AUTHOR_EMAIL == null) {
			GIT_AUTHOR_EMAIL = "alban.andrieu@free.com"
		}
		println "GIT_AUTHOR_EMAIL: ${GIT_AUTHOR_EMAIL}"

		//String GIT_PROJECT = "nabla-servers-bower-sample"
		String GIT_PROJECT = "nabla"
		String GIT_BROWSE_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}/"
		String GIT_URL = "https://github.com/AlbanAndrieu/${GIT_PROJECT}.git"
		String JENKINS_CREDENTIALS = '8aaa3139-bdc4-4774-a08d-ee6b22a7e0ac'

        	String GIT_COMMIT = "TODO"

		try {

			if (params.CLEAN_RUN == true) {
				stage "Clean Workspace"
				step([$class: 'WsCleanup'])
				sh "bower cache clean"
				sh "npm cache clean"
			}

			stage('Preparation') { // for display purposes

				//stage 'Checkout SCM'

				def scmVars = checkout scm
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
				//GIT_COMMIT = sh(returnStdout: true, script: "GIT_DIR=${env.WORKSPACE}/.git git rev-list HEAD | cut -c 1-7").trim()
				try {
					GIT_COMMIT = scmVars.GIT_COMMIT
				} catch (Exception error) {
					sh "git rev-parse --short HEAD > .git/commit-id"
					GIT_COMMIT = readFile('.git/commit-id')
				}

				println "GIT_COMMIT: ${GIT_COMMIT}"
				println "SONAR_BRANCH: ${SONAR_BRANCH}"

				println "BRANCH_NAME: ${env.BRANCH_NAME}"
				println "GIT_BRANCH_NAME: ${env.GIT_BRANCH_NAME}"

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "${GIT_BRANCH_NAME}"]],
                    browser: [
                        $class: 'Stash',
                        repoUrl: "${GIT_BROWSE_URL}"],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[
                        $class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true], [
                        $class: 'LocalBranch', localBranch: 'master'], [
                        $class: 'RelativeTargetDirectory', relativeTargetDir: 'bm'], [
                        $class: 'MessageExclusion', excludedMessage: '.*\\\\[maven-release-plugin\\\\].*'], [
                        $class: 'IgnoreNotifyCommit'], [
                        $class: 'ChangelogToBranch',
                    options: [compareRemote: 'origin', compareTarget: 'release/1.0.0']]],
                    gitTool: 'git-latest',
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        credentialsId: "${JENKINS_CREDENTIALS}",
                        url: "${GIT_URL}"]
                        ]
                    ]
                )

sh '''
set -e
#set -xve

echo USER $USER

#source /etc/profile

cd ./bm/Scripts/release

./step-0-prepare-branche.sh

./step-0-1-run-processes-cleaning.sh || exit 1

./step-2-2-1-build-before-java.sh || exit 1

cd ${WORKSPACE}

echo NODE_PATH ${NODE_PATH}
export PATH=./:./node/:${PATH}
echo PATH ${PATH}
echo JAVA_HOME ${JAVA_HOME}
echo DISPLAY ${DISPLAY}
echo PROJECT ${PROJECT}

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

exit 0
'''
			}
			stage('Build') {

			// Maven opts
			String MAVEN_OPTS = ["-Djava.awt.headless=true",
				"-Dsun.zip.disableMemoryMapping=true",
				"-Djava.io.tmpdir=${WORKSPACE}/target/tmp"].join(" ")

			if (params.CLEAN_RUN == true) {
				MAVEN_OPTS << " -Xmx1536m -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -XX:+HeapDumpOnOutOfMemoryError "
			}

			println "Maven OPTS have been specified: ${MAVEN_OPTS}"

			withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository', mavenOpts: "${MAVEN_OPTS}") {

				String MAVEN_ROOT_POM = "${WORKSPACE}/${PROJECT}/pom.xml"
				String MAVEN_SETTINGS_FILE = "${WORKSPACE}/${PROJECT}/settings.xml"

				String MAVEN_GOALS = ["-B -U -e -Dsurefire.useFile=false",
						//"-f ${MAVEN_ROOT_POM}",
						//"-s ${MAVEN_SETTINGS_FILE}",
						"-T3",
						"clean install",
						//"-Dakka.test.timefactor=2",
						//"-Dcargo.rmi.port=${CARGO_RMI_PORT} -Djetty.http.port=9190 -Dwebdriver.base.url=http://localhost:9190/ -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -DSTOP.PORT=19097 -DSTOP.KEY=STOP",
						"-Djacoco.outputDir=${WORKSPACE}/target",
						"-Dsonar.branch=${SONAR_BRANCH}",
						"-Psonar,jacoco,codenarc,run-integration-test"].join(" ")

				if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /feature\/.*/)) {
					println "pitest added"
					MAVEN_GOALS << " org.pitest:pitest-maven:1.2.4:mutationCoverage "
					println "sonar added"
					MAVEN_GOALS << " sonar:sonar "
				}

				if (BRANCH_NAME ==~ /feature\/.*/) {
					MAVEN_GOALS << " -Dsonar.organization=nabla -Dsonar.scm.enabled=false -Dsonar.scm-stats.enabled=false -Dissueassignplugin.enabled=false -Dsonar.pitest.mode=skip -Dsonar.scm.user.secured=false "
					MAVEN_GOALS << " -Denforcer.skip=false -Dmaven.test.failure.ignore=false -Dmaven.test.failure.skip=false "
				}

				if (BRANCH_NAME ==~ /release\/.*/) {
					println "skip test added"
					MAVEN_GOALS << " -Denforcer.skip=true "
					MAVEN_GOALS << " -Dmaven.test.failure.ignore=true -Dmaven.test.failure.skip=true "
				}

				println "Maven GOALS have been specified: ${MAVEN_GOALS}"

				// Run the maven build
				sh "mvn ${MAVEN_GOALS}"
			}
		}

		if (params.DRY_RUN == false) {

			if (BRANCH_NAME == 'develop') {
				stage('Security') {
					withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
						// Run the maven build
						sh "mvn org.owasp:dependency-check-maven:check"
					}
				}
			}

			if (BRANCH_NAME == 'develop') {
				stage('Site') {
					withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
						// Run the maven build
						sh "mvn site"
					}
				}
			}

			if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /release\/.*/)) {
				stage('Deploy') {
					withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
						// Run the maven build
						sh "mvn deploy"
					}
				}
			}
		}

		stage('Results') {

			step([
				$class: 'WarningsPublisher',
				consoleParsers: [[parserName: 'Java Compiler (javac)'], [parserName: 'Maven']],
			])

			step([
				$class: 'AnalysisPublisher',
			])

			junit '**/target/surefire-reports/TEST-*.xml'

			//TODO add consol output parsing
		}

		stage('Archive Artifacts') {

			String versionInfo = "${PROJECT}: BUILD: ${BUILD_ID} SHA1: ${GIT_COMMIT} BRANCH: ${BRANCH_NAME}"
			String versionFile = "${env.WORKSPACE}/${PROJECT}_VERSION.TXT"
			sh "echo ${versionInfo} > ${versionFile}"

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

			if (BRANCH_NAME ==~ /release\/.*/) {
				ARTIFACTS << ",**/target/*test.jar"
			}

			if ((BRANCH_NAME == 'develop') || (BRANCH_NAME ==~ /release\/.*/)) {
				archiveArtifacts artifacts: "${ARTIFACTS}", excludes: null
			}
		}

		currentBuild.result = "SUCCESS"
		} catch (Exception error) {
			currentBuild.result = "FAILURE"
			throw error
		} finally {
			emailext attachLog: true,
					 body: ("${PROJECT}: build on branch ${BRANCH_NAME} resulted in ${currentBuild.result}"),
					 subject: ("${currentBuild.result}: ${PROJECT} ${currentBuild.displayName}"),
					 compressLog: true,
					 to: "${GIT_AUTHOR_EMAIL}"
		}
	}
}
