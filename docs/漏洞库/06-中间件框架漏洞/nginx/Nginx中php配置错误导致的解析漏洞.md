### 影响范围 ###
这一漏洞是由于Nginx中php配置不当而造成的，与Nginx版本无关
### 漏洞详情 ###
Nginx拿到文件路径（更专业的说法是URI）/test.jpg/test.php后，一看后缀是.php，便认为该文件是php文件，转交给php去处理。php一看/test.jpg/test.php不存在，便删去最后的/test.php，又看/test.jpg存在，便把/test.jpg当成要执行的文件了

这其中涉及到php的一个选项：cgi.fix_pathinfo，该值默认为1，表示开启。开启这一选项有什么用呢？看名字就知道是对文件路径进行“修理”。何谓“修理”？举个例子，当php遇到文件路径“/aaa.xxx/bbb.yyy/ccc.zzz”时，若“/aaa.xxx/bbb.yyy/ccc.zzz”不存在，则会去掉最后的“/ccc.zzz”，然后判断“/aaa.xxx/bbb.yyy”是否存在，若存在，则把“/aaa.xxx/bbb.yyy”当做文件“/aaa.xxx/bbb.yyy/ccc.zzz”，若“/aaa.xxx/bbb.yyy”仍不存在，则继续去掉“/bbb.yyy”，以此类推。

该选项在配置文件php.ini中

新版本的php引入了“security.limit_extensions”，限制了可执行文件的后缀，默认只允许执行.php文件

### 复现过程 ###
1、 使用docker搭建漏洞环境

2、 执行如下命令,运行环境

docker-compose up -d

3、 浏览器访问http://192.168.247.129/

![](Nginx%E4%B8%ADphp%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF%E5%AF%BC%E8%87%B4%E7%9A%84%E8%A7%A3%E6%9E%90%E6%BC%8F%E6%B4%9E/1.png)
4.上传一个图片马

5.浏览器访问http://192.168.247.129/uploadfiles/156005c5baf40ff51a327f1c34f2975b.jpg/a.php

下图看到成功执行了php代码,说明存在解析漏洞
![](Nginx%E4%B8%ADphp%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF%E5%AF%BC%E8%87%B4%E7%9A%84%E8%A7%A3%E6%9E%90%E6%BC%8F%E6%B4%9E/2.png)
6.我们用中国蚁剑去连接
![](Nginx%E4%B8%ADphp%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF%E5%AF%BC%E8%87%B4%E7%9A%84%E8%A7%A3%E6%9E%90%E6%BC%8F%E6%B4%9E/3.png)

### 漏洞修复 ###
主要是两个配置文件中配置不当造成的。

1. 修改配置文件vim /etc/php5/fpm/php.ini

 将cgi.fix_pathinfo=1，设置为0

 2.修改配置文件vim /etc/php5/fpm/pool.d/www.conf

 将security.limit_extensions=，设置为：

 security.limit_extensions=.php，只允许php文件解析