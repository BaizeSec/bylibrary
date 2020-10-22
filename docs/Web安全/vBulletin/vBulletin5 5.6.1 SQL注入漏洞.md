# vBulletin5 5.6.1 SQL注入漏洞

最后更新于：2020-09-20 16:06:02

#### 漏洞描述

5.5.6pl1之前的vBulletin，5.6.0pl1之前的5.6.0和5.6.1pl1之前的5.6.1具有错误的访问控制。
实际是nodeId未授权sql注入漏洞，且危害较大。

#### 影响范围

vBulletin 5.5.6pl1之前版本
vBulletin 5.6.0pl1之前的5.6.0版本
vBulletin 5.6.1pl1之前的5.6.1版本

#### payload：

![img](vBulletin5%205.6.1%20SQL%E6%B3%A8%E5%85%A5%E6%BC%8F%E6%B4%9E/QQ%E6%88%AA%E5%9B%BE20200920160511.jpg)

#### 修复建议

官方已发布最新安全补丁，请及时更新补丁