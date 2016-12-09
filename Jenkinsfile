node ('albandri'){
   stage('Preparation') { // for display purposes
      // Get some code from a Git repository
      checkout([$class: 'GitSCM', branches: [[name: '*/master']], browser: [$class: 'Stash', repoUrl: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample/'], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: true, timeout: 30]], gitTool: 'git-1.7.4.1', submoduleCfg: [], userRemoteConfigs: [[credentialsId: '8aaa3139-bdc4-4774-a08d-ee6b22a7e0ac', url: 'https://github.com/AlbanAndrieu/nabla-servers-bower-sample.git']]])
   }
   stage('Build') {
    withMaven(maven: 'maven-3-test', jdk: 'jdk-18', mavenLocalRepo: '.repository') {
        // Run the maven build
        sh "mvn clean install"
    }
   }
   stage('Results') {
      junit '**/target/surefire-reports/TEST-*.xml'
      archive 'target/*.jar'
   }
}
