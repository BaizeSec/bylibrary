###1.影响版本 ###
YXcms 1.4.7
### 2.复现过程 ###
前台有留言板的功能，进行测试：
payload：

    <svg/onload=alert(1)>


![](YXCMS%201.4.7%E5%82%A8%E5%AD%98%E5%9E%8Bxss/YPUuIs.png) 
当管理员在后台查看留言的时候，就能触发`xss：`
![](YXCMS%201.4.7%E5%82%A8%E5%AD%98%E5%9E%8Bxss/YPUJLF.png) 
可以通过这个xss来获取管理员的cookie，从而进入网站后台。。