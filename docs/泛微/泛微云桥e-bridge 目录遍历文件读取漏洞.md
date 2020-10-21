---
title: '泛微云桥e-bridge 目录遍历/文件读取漏洞'
date: Mon, 21 Sep 2020 01:12:13 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 漏洞信息:

泛微云桥是一个为了满足用户提出的阿里钉钉与泛微OA集成需泛微0A云桥e-bridge 其 /wxjsapi/saveYZJFile 接口可以读取文件内容并保存，而后可通过/file/fileNoLogin/{id}，读取文件内容。

#### 影响范围:

主要影响 2018-2019 版本

#### 漏洞复现:

fofa\_dork : “泛微云桥” ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/QQ截图20200921090748-1.jpg) 读取并保存文件 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200921090006.jpg) 结果中提取id值，拼接到/file/fileNoLogin/{id} 中 即可读取数据，读取成功 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/微信图片_20200921090013.jpg) windows平台可读取c://windows/win.ini文件用于漏洞验证，Linux下则读取etc/passwd文件进行验证 ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/QQ截图20200921091109.jpg)

#### 修复方案:

尽快升级到最新版本