#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
name: phpstudy探针
referer: unknown
author: Lucifer
description: phpstudy默认存在探针l.php,泄露敏感信息。
'''
import sys
import requests
import warnings
def run(url):
        result = ['phpstudy探针', '', '']
        headers = {
            "User-Agent":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50"
        }
        payload = "/l.php"
        vulnurl = url + payload
        try:
            req = requests.get(vulnurl, headers=headers, timeout=10, verify=False)
            if r"phpStudy" in req.text and r"php_version" in req.text:
                result[2]=  '存在'
                result[1] = vulnurl
            else:
                result[2]=  '不存在'

        except:
            result[2]='不存在'
        return result

if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    testVuln = run(sys.argv[1])
