---

title: 'DedeCms v5.6 嵌入恶意代码执行漏洞'
date: Wed, 14 Oct 2020 01:00:11 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 影响版本

DedeCms v5.6

#### 复现

注册会员，上传软件：本地地址中填入 ![](DedeCms%20v5.6%20%E5%B5%8C%E5%85%A5%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/QQ%E6%88%AA%E5%9B%BE20201014085731.jpg) ![](DedeCms%20v5.6%20%E5%B5%8C%E5%85%A5%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E/QQ%E6%88%AA%E5%9B%BE20201014085849.jpg) 生成x.php 密码xiao，直接生成一句话。