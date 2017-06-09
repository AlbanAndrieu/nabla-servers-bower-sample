import groovy.json.*
import java.util.*
import groovy.json.internal.LazyMap
node('Burp') {
    stage('Build') {
        echo 'Configuring The BURP suite'
        bat("groovy AutoConf.groovy")
        bat("start cmd /k java -jar burp-rest-api-1.0.0s1.jar --project-file=S1-%BUILD_NUMBER%.burp --config-file=ConfigB1.json --server.address=127.0.0.1 --server.port=${ServerPort}")
   }
}
node('master')
{
    stage('Test'){
        sleep(13);
        bat("ant ZAPDemo")
    }
}
node('Burp')
{
    stage('Scan'){
       bat('groovy AutoScan.groovy')
 }
}
