# ShiroScan
Shiro&lt;=1.2.4反序列化，一键检测工具

    改动内容：1.新增4个利用链模块(CommonsCollections7-10)，预计增加成功率30%，已打包成新ysoserial的jar包，请勿更换
    改动内容：2.增加多线程，虽模块增加但速度却提高300%

```
集成21个key进行fuzz
```

* 如果有帮助，请点个star哦，对应blog文章：http://www.svenbeast.com/post/tskRKJIPg/
* pip3 install -r requirments.txt     

* Usage：python3 shiro.py  url  command
* Usage：python3 shiro.py  https://url.com  whoami

* http://www.dnslog.cn/   验证推荐使用这个dnslog平台，速度比ceye.io要快很多
* 执行的命令带空格记得用""引起来

* usage：python3 shiro.py  http://url.com  "ping dnslog.cn"
* 11个模块全部跑一遍,然后去dnslog平台查看是否收到请求，不出来就GG，也可能是因为编码还不够多

* 请自行收集编码，在moule下的源代码中自行添加方法即可

* 为了脚本运行简单，多线程数量不是使用者传参控制，默认20线程，如需改动请到/moule/main.py第20行代码自行修改控制线程的参数
## 不推荐当做exp使用，效率问题
## 仅供安全人员验证,测试是否存在此漏洞
