pipeline {
    agent any

    stages {
        stage('UI & Karma Tests') {
            agent {
                label 'mobile-tests'
            }
            steps {
                echo 'Testing..'
								sh "npm install"
								sh "npm install grunt-cli"
								sh "node_modules/grunt-cli/bin/grunt ui-tests-junit -f"
								step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
										'report/**/*.xml'])
                archive 'tests/UI-tests/diff/**'
                archive 'tests/UI-tests/result/**'
                echo 'Karma testing..'
								sh "node_modules/grunt-cli/bin/grunt karma -f"
								step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
										'report/**/*.xml'])
                stash includes: 'report/**', name: 'test-result-karma'
            }
        }
        stage('Eslint & Tests & Cover & SonarQube & docs') {
            agent {
                label 'node'
            }
            steps {
								sh "npm install"
								sh "npm install grunt-cli"
								sh "node_modules/grunt-cli/bin/grunt ci -f"
								step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
										'report/**/*.xml'])
								sh "node_modules/grunt-cli/bin/grunt test -f"
								step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
										'report/**/*.xml'])
                stash includes: 'report/**', name: 'test-result'
                unstash 'test-result-karma'
                echo 'Collecting clover..'
								sh "node_modules/grunt-cli/bin/grunt build -f"
								sh "node tools/cmd/clover.js"
								step([$class: 'CloverPublisher', cloverReportDir:
										'report/test/all/coverage/clover', cloverReportFileName: 'clover.xml'])
                archive 'dist/**'
                stash includes: 'dist/**', name: 'dist'
                sh "node tools/cmd/prepare-sonar.js"
                // requires SonarQube Scanner 2.8+
                withSonarQubeEnv('Main') {
                  sh "/home/m.urbanski/sonar-scanner-2.8/bin/sonar-scanner"
                }
                echo 'Generating docs..'
								sh "node_modules/grunt-cli/bin/grunt docs -f"
								sh "mkdir -p docs/sdk"
                archive 'docs/sdk/**'
            }
        }
        stage('Artifacts') {
            agent {
                label 'node'
            }
            steps {
                echo 'Getting artifacts....'
                unstash 'dist'
								sh "rm -rf artifacts"
								sh "mkdir -p artifacts/dist/mobile"
								sh "mkdir -p artifacts/examples/mobile"
								sh "cp -a examples/mobile/* artifacts/examples/mobile/"
								sh "cp -a dist/mobile/* artifacts/dist/mobile/"
								sh "cp -a dist/mobile/theme/changeable artifacts/dist/mobile/theme/default"
								sh "mkdir -p artifacts/dist/wearable"
								sh "mkdir -p artifacts/examples/wearable"
								sh "cp -a examples/wearable/* artifacts/examples/wearable/"
								sh "cp -a dist/wearable/* artifacts/dist/wearable/"
								sh "cp -a dist/wearable/theme/changeable artifacts/dist/wearable/theme/default"
								archive 'artifacts/**'
            }
        }
    }
}
