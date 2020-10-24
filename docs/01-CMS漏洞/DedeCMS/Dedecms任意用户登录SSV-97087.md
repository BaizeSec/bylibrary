---
title: 'Dedecms任意用户登录SSV-97087'
date: Tue, 13 Oct 2020 01:13:11 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 影响版本

dedecmsV5.7 SP2

#### 漏洞成因

dedecms的会员模块的身份认证使用的是客户端session，在Cookie中写入用户ID并且附上ID\_\_ckMd5，用做签名。主页存在逻辑漏洞，导致可以返回指定uid的ID的Md5散列值。原理上可以伪造任意用户登录。

#### 复现

现在我们的思路就是 先从member/index.php中获取伪造的DedeUserID和它对于的md5 使用它登录 访问member/index.php?uid=0000001并抓包(注意cookie中last\_vid值应该为空)。 ![](Dedecms%E4%BB%BB%E6%84%8F%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95SSV-97087/f09e67a7e30cf8167f0e1f0e01ae01d9.png) 可以看到已经获取到了，拿去当做DeDeUserID![](Dedecms%E4%BB%BB%E6%84%8F%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95SSV-97087/a599b95d431c365e3edc7ba540b363a1.png) 可以看到，登陆了admin用户。

#### 修复意见

M\_ID被intval后还要判断是否与未intval之前相同。