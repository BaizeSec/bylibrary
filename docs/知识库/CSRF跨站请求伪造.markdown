# CSRF跨站请求伪造详解

## 简介：

**跨站请求伪造**（英语：Cross-site request forgery），也被称为 **one-click attack**或者 **session riding**，通常缩写为 **CSRF**或者 **XSRF**， 是一种挟制用户在当前已登录的Web[应用程序](https://baike.baidu.com/item/应用程序/5985445)上执行非本意的操作的攻击方法。跟[跨网站脚本](https://baike.baidu.com/item/跨网站脚本/23316003)（XSS）相比，**XSS**利用的是用户对指定网站的信任，CSRF 利用的是[网站](https://baike.baidu.com/item/网站/155722)对用户网页浏览器的信任。

## 漏洞原理举例：

假如一家银行用以运行转账操作的URL地址如下：http://www.examplebank.com/withdraw?account=AccoutName&amount=1000&for=PayeeName

那么，一个恶意攻击者可以在另一个网站上放置如下代码：

```
<img src="http://www.examplebank.com/withdraw?account=Alice&amount=1000&for=Badman">
```

如果有账户名为Alice的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失1000资金。

这种恶意的网址可以有很多种形式，藏身于网页中的许多地方。此外，攻击者也不需要控制放置恶意网址的网站。例如他可以将这种地址藏在论坛，博客等任何[用户生成内容](https://baike.baidu.com/item/用户生成内容)的网站中。这意味着**如果服务端没有合适的防御措施的话，用户即使访问熟悉的可信网站也有受攻击的危险**。

透过例子能够看出，攻击者并不能通过CSRF攻击来直接获取用户的账户控制权，也不能直接窃取用户的任何信息。他们能做到的，是**欺骗用户浏览器，让其以用户的名义运行操作**。

### 漏洞检测：

##### 数据包无token和referer验证：

无token验证并且无referer验证时，就基本存在跨站请求伪造，但基于功能点不同，一些为无意义无危害的跨站请求伪造。

提交数据包时抓包删除referer字段，如果不报错，则基本存在跨域请求伪造，GET型构造链接，POST型写一个提交表单，测试有跨域情况下提交的数据包是否生效。

##### 数据包无token有referer验证：

只有referer验证时，可尝试空referer，或者尝试域名伪造。

例如只验证referer是否存在bylibrary.cn时：

伪造三级域名为bylibrary.cn.baidu.com来绕过referer字段验证；

在bylibrary.cn网站下发帖引导别人点击我们构造的CSRF链接或者在此网站下发布我们构造的CSRF表单地址来绕过referer的检测。

## 漏洞利用：

##### 自动提交表单POC：

```
<html>
<head></head>
<body onload="form1.submit()">
<form id="form1" method="post" action="http://example.com">
<input type="hidden" name="sex" value="2" />
</form>
</body>
</html>
```

## 常见场景：

在需要验证用户身份的post表单或者get请求处理时，例如修改密码，修改个人信息，删除文件，添加用户等

## 漏洞实例：

这里就用一个我测试中发现的csrf来作为示例吧，但这个并不能称之为漏洞，厂商也忽略了，因为几乎没有危害，那么就演示一下大概的利用流程

首先出现csrf的地方为途虎养车个人中心：https://my.tuhu.cn/Account/UserInfo.html

1.修改个人信息用户名和真实姓名时抓包

![1605199184_5fad6550ce738709f54db.png!small?1605199185224](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199184_5fad6550ce738709f54db.png!small)

2.利用burp的CSRF测试插件生成html文件进行测试

![1605199220_5fad65748fd791a548d75.png!small?1605199221023](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199220_5fad65748fd791a548d75.png!small)

![1605199235_5fad6583b29057150e07e.png!small?1605199236122](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199235_5fad6583b29057150e07e.png!small)

3.生成的POC修改用户名为CSRFtest并保存为HTML文件

![1605199275_5fad65ab54848a95100ca.png!small?1605199275796](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199275_5fad65ab54848a95100ca.png!small)

4.打开生成的html页面点击按钮

![1605199354_5fad65fa8030d87147d76.png!small?1605199354869](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199354_5fad65fa8030d87147d76.png!small)

5.查看用户中心是否已经修改成功

![1605199405_5fad662d4b79832abcf76.png!small?1605199405744](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605199405_5fad662d4b79832abcf76.png!small)

已经修改成功了，但是没有任何危害，只能修改用户姓名和昵称，SRC给忽略了。

## 漏洞防御：

##### 检测referer字段：

严格检测referer字段，防止可以被绕过。

##### 添加token校验：

添加token伪随机参数，后端校验token有效性。

附上一张我觉得对token原理表述的比较明白的图：

![1605023189_5faab5d5bb6b2af52ba8a.png!small?1605023190827](CSRF%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/1605023189_5faab5d5bb6b2af52ba8a.png!small)

签名是关键，用户提交的数据后台先根据算法和密钥对数据加密后和用户提交时附带的token校验，相同则校验通过，反之则校验失败，返回错误。