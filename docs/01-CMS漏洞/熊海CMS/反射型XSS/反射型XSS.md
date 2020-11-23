#### 漏洞详情： ####
反射型XSS

漏洞位置：files/contact.php 第12~15行
![](反射型XSS/20200417211129-f38ef3a2-80ac-1.png)

    $page=addslashes($_GET['page']);
    if ($page<>""){
    if ($page<>1){
    $pages="第".$page."页 - ";

经过一次addslashes函数处理就直接带入页面。

#### 复现过程  ####

我们访问网址的联系功能，找到了代码对于的page参数，其实就是留言列表的页数。
![](反射型XSS/20200417211052-dd4dec10-80ac-1.png)
我们尝试插入一个简单XSS payload

    page=<img src=x onerror=alert(/xss/);>
![](反射型XSS/20200417211013-c6557776-80ac-1.png)

漏洞利用成功。


### 参考链接 ###
https://xz.aliyun.com/t/7629