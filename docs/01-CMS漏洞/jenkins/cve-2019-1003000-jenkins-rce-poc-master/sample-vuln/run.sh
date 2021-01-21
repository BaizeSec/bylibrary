#!/usr/bin/env bash
docker run --rm -d -p 8080:8080 -p 50000:50000 --name vuln-jenkins -v $(pwd)/jenkinsdata:/var/jenkins_home jenkins/jenkins:2.152-alpine
