---
title: 'Thinkphp 5.x远程代码执行漏洞环境'
date: Mon, 31 Aug 2020 10:32:23 +0000
draft: false
tags: ['白阁-环境库']
---

#### 安装docker环境

##### 点击查看教程

#### 下载vulhub项目

项目地址：[https://github.com/vulhub/vulhub](https://github.com/vulhub/vulhub) 下载后进入项目目录下thinkphp/5-rce目录：

```
cd vunhub-master/thinkphp/5-rce
```

开启本次漏洞环境：

```
docker-compose up -d
```

浏览器访问环境服务器**ip:8080** ![](https://www.bylibrary.cn/wp-content/uploads/2020/08/15988699031.png)

#### 环境搭建完成！