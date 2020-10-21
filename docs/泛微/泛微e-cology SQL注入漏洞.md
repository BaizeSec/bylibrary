---
title: '泛微e-cology SQL注入漏洞'
date: Mon, 14 Sep 2020 07:38:27 +0000
draft: false
tags: ['白阁-漏洞库']
---

泛微e-cology SQL注入漏洞 发布日期：2020-09-13 适用范围：使用了泛微e-cology的用户 处置建议： 检测：a.人工，可通过向目标系统提交以下请求进行漏洞验证： ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/AAA.png) ，如果页面返回32位长度的密文则系统受此漏洞影响。若页面返回404或者403状态则表示不存在此漏洞。 b.产品检测：升级RSAS/UTS/WVSS至最新版本即可检测。 防护：a.官方升级 b.升级WAF/NF/IPS至最新版本即可防护。