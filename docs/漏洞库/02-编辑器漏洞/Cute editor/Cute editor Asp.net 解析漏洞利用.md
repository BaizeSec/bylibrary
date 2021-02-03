### Cute Editor Asp.Net版利用iis解析漏洞获得权限

影响版本：
CuteEditor for ASP.NET中文版脆弱描述：
脆弱描述：
CuteEditor对上传文件名未重命名，导致其可利用IIS文件名解析Bug获得webshell权限。
攻击利用：
可通过在搜索引擎中键入关键字 inurl:Post.aspx?SmallClassID= 来找到测试目标。
在编辑器中点击“多媒体插入”，上传一个名为“xxx.asp;.avi”的网马，以此获得权限。