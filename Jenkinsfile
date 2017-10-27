node ('javascript'){
   stage('Preparation') { // for display purposes
      // Get some code from a Git repository
      checkout([$class: 'GitSCM', branches: [[name: '*/master']], browser: [$class: 'GitHub', repoUrl: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample/'], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: true, timeout: 30]], gitTool: 'git-1.7.4.1', submoduleCfg: [], userRemoteConfigs: [[credentialsId: '8aaa3139-bdc4-4774-a08d-ee6b22a7e0ac', url: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample.git']]])
   }
   stage('Build') {
    withMaven(maven: 'maven-latest', jdk: 'java-latest', globalMavenSettingsConfig: 'nabla-default', mavenLocalRepo: '.repository') {
        // Run the maven build
        sh "mvn clean install deploy -Denforcer.skip=true"
    }
   }
   stage('Results') {
      //junit '**/target/surefire-reports/TEST-*.xml'
      archive '**/target/*SNAPSHOT.jar, **/target/*.swf, **/target/*SNAPSHOT.war,**/target/*SNAPSHOT*.zip, *_VERSION.TXT, **/target/*.log, reports/*'
   }
}
