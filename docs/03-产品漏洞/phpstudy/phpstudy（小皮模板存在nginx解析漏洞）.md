---
title: 'phpstudy（小皮模板存在nginx解析漏洞）'
date: Sat, 12 Sep 2020 04:48:16 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 版本影响

phptsuy8.1.07的Nginx1.5.11版本

#### phpstudy介绍

PhpStudy国内12年老牌公益软件，集安全、高效、功能与一体，已获得全球用户认可安装，运维也高效。支持一键LAMP、LNMP、集群、监控、网站、数据库、FTP、软件中心、伪静态、云备份、SSL、多版本共存、Nginx反向代理、服务器防火墙、web防火墙、监控大屏等100多项服务器管理功能

#### 漏洞复现

1、双击打开phpstudy，启动nginx中间件和mysql。 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200912123756.png) 2.右击创建一个php文件，写入 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/QQ截图20200912124024.jpg) 3.然后和一个图片合成一个图片马，然后再打开cmd，进入存放图片以及木马的目录，输入命令：```
copy 1.png/b+1.txt/a 3.png 
```4.打开本地搭建的靶场，使用upload-labs。在pass-01上上传图片马 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200912124300.png) 5..漏洞利用，在.png后面添加/xxx.php，url为：```
http://127.0.0.1/upload-labs-master/upload/3.png/xx.php 
```![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200912124521.png) 漏洞利用完成。