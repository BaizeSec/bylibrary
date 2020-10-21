---
title: '绿盟UTS综合威胁探针管理员任意登录'
date: Fri, 11 Sep 2020 04:51:49 +0000
draft: false
tags: ['白阁-漏洞库']
---

**漏洞详情：** 绿盟全流量威胁分析解决方案针对原始流量进行采集和监控，对流量信息进行深度还原、存储、查询和分析，可以及时掌握重要信息系统相关网络安全威胁风险，及时检测漏洞、病毒木马、网络攻击情况，及时发现网络安全事件线索，及时通报预警重大网络安全威胁，调查、防范和打击网络攻击等恶意行为，保障重要信息系统的网络安全。 绿盟综合威胁探针设备版本V2.0R00F02SP02及之前存在此漏洞。 **处置意见:** 建议尽快更新补丁至最新： http://update.nsfocus.com/update/listBsaUtsDetail/v/F02 **漏洞利用过程：** ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/1.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/2.png) 对响应包进行修改，将false更改为true的时候可以泄露管理用户的md5值密码 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/3.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/4.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/5.png) 利用渠道的md5值去登录页面 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/6.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/7.png) 7ac301836522b54afcbbed714534c7fb ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/8.png) 成功登录，登录后通过管理员权限对设备进行管控，并且可以看到大量的攻击信息，泄露内部网络地址包括资产管理。