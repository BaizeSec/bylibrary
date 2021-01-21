### 1.影响版本 ###
YXcms 1.4.7
### 2.复现过程 ###
进入网站后台。

    /index.php?r=admin/set/tpadd&Mname=default

新建模板文件：
![](YXCMS%201.4.7%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E5%86%99%E5%85%A5/YiVDXV.png)
可以创建任意的文件。。

通过目录结构，可以找到新的模板文件的位置：

    /protected/apps/default/view/default/phpinfo.php


![](YXCMS%201.4.7%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E5%86%99%E5%85%A5/YiZPAg.png)
可以看到是我们写入的文件被执行了，所有可以写入一句话木马，来进行getshell。。