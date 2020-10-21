---
title: 'EmpireCMS V7.5后台任意代码执行漏洞'
date: Mon, 07 Sep 2020 13:20:50 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

EmpireCMS V7.5

### 漏洞验证

需要有后台权限。 1.登入后台管理页面 2.点击系统->备份->备份数据 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/15994843291.png) 3.随便选择一个表，点击最下面的开始备份，抓包 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/15994844081.png) 4.抓包后修改tablename字段为命令执行语句 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/15994845901.png) 5.返回页面 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/V663PE4R39@A5RTG.png) 6.访问备份路径下config.php亦可 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/15994847861.png) 7.查看config.php,命令已经写进去了

 ![](EmpireCMS%20V7.5%E5%90%8E%E5%8F%B0%E4%BB%BB%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/15994849521.png)