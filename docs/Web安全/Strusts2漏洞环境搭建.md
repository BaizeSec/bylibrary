---
title: 'Strusts2漏洞环境搭建'
date: Mon, 24 Aug 2020 12:54:10 +0000
draft: false
tags: ['白阁-环境库']
---

### 该文章于以下环境测试有效

系统环境：centos7 java环境：1.8.0 tomcat环境：7.0.105 struts2环境：2.3.2

#### 1.安装java

```
yum -y install java-1.8.0-openjdk
```

#### 2.安装tomcat

下载tomcat [tomcat下载地址](http://mirror.bit.edu.cn/apache/tomcat/tomcat-7/v7.0.105/bin/ "tomcat下载地址") 下载后解压

```
tar -zxvf apache-tomcat-7.0.105.tar.gz
```

#### 3.安装strust2

下载struts2 链接: [百度云盘](https://pan.baidu.com/s/1OhL3YcTz0-XuTTiC-hEojw "百度云盘") 提取码: ycb3 将apps下的所有示例（.war）拷贝到tomcat路径下（路径为`/tomcat目录/webapps/`）

#### 4.启动tomcat服务

进入tomcat bin目录下，`sh start.sh`或者`./start.sh`