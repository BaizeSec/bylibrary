---
title: 'Spring Cloud Netflix Hystrix Dashboard SSRF'
date: Mon, 21 Sep 2020 01:26:25 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 漏洞信息:

Spring Cloud Netflix，2.2.4之前的2.2.x版本，2.1.6之前的2.1.x版本以及较旧的不受支持的版本允许应用程序使用Hystrix Dashboard proxy.stream端点向服务器托管可访问的任何服务器发出请求仪表板。恶意用户或攻击者可以将请求发送到不应公开公开的其他服务器。

#### 影响范围:

Spring Cloud Netflix 2.2.0至2.2.3 2.1.0至2.1.5 较旧的不受支持的版本也会受到影响

#### 漏洞复现:

##### poc：

```
/proxy.stream?origin=http://www.baidu.com 
​```

#### 修复方案:

官方已经进行安全升级，受影响用户请尽快升级到修复版本: Spring Cloud Netflix： 2.2.4 2.1.6 较旧的版本应升级到受支持的分支
```

