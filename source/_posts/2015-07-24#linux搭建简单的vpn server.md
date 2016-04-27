---
title: linux搭建简单的vpn server
permalink: vpn-server
tags:
    - vpn server
    - linux
date: 2015-07-24 
---

这几天跑实验，内网服务器想连外网，于是就想到在自己电脑搭一个vpn server来搞。今天折腾大半天搞定了，这里简单记录下操作步骤。

1.使用pptpd,所以先安装:

    sudo apt-get install pptpd

修改**/etc/pptpd.conf**这个文件:

找到以下俩行：

    #localip 192.168.0.1
    #remoteip 192.168.0.234-238,192.168.0.245

把前面的#号去掉，然后保存就行了。这里，localip 是 VPN 链接成功后服务器的 ip 地址， 最后会是是你客户端的网关,remoteip 则客户端的可分配 ip 地址范围.最大连接数有默认限制,不过可以修改.其实随便在可用内网ip范围改啦：

* --10.0.0.0/8：10.0.0.0～10.255.255.255 
* --172.16.0.0/12：172.16.0.0～172.31.255.255 
* --192.168.0.0/16：192.168.0.0～192.168.255.255

编辑**/etc/ppp/pptpd-options**这个文件,为VPN指定DNS服务器，找到ms-dns这项，去掉前面的#号，修改成google提供的DNS

    ms-dns 8.8.8.8
    ms-dns 8.8.4.4
    
这是google的公开DNS ip,不过后来发现部分国内网站的解析会有问题,所以最后换成了ali的,这个问题就解决了.我把它归因于GFW，修改好后保存。

- - - -

接下来建立VPN账号和密码了，修改**/etc/ppp/chap-secrets**文件，按一行四列添加：

* 账号
* 服务器名 
* 密码
* IP

即第一行是用户名，第二行是服务器名（默认写pptpd 即可，注意与 pptpd-options 文件保持一致,要改的话俩个地方都要改保持一致,不过没有意义），第三行是密码，第四列是 IP 限制（不做限制用 * ）。如创建一个名为test，密码为123，不限制登录IP的VPN账号：

    mzs pptpd 123 *
     
多个账号另起一行就可以了.如果限制登陆地点,可以修改*处另作文章。重启：

    service pptpd restart
    service pppd-dns restart

此时就可以用一个vpn客户端来登陆了,不过**还不能连外网**。
修改**/etc/sysctl.conf**这个文件，把ipv4 forward开启，方法是找到**/etc/sysctl.conf**这个文件里的这一行：

    #net.ipv4.ip_forward=1
    
去掉前面的#号，使之生效，然后保存，运行命令sysctl –p。如果显示：
    
    net.ipv4.ip_forward = 1

这样初步搭完了,但是不能连外网,我在这个坑里跳了很久，要继续操作.

- - - -

**下边这边部分不是很懂，今天还没来得及研究，日后有理解补上来，**
**弄懂了，补上来，将要从eth0出去的包，来源Ip，也就是从内网来的数据包，都替换成vpn server的public ip，这边是所谓的NAT，postrouting修改来源ip，prerouting则修改目的ip，一个是SNAT，一个是DNAT** 

设置iptables规则
首先配置nat表的翻译规则, 将目标IP为192.168.0.0/24的包转向eth0接口. 在iptables配置文件的nat表中添加如下规则,指令:(如果有需要,先安装iptables)

    iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -o eth0 -j MASQUERADE

OK，到了这一步就应该可以用VPN了。如果不能，我也不知是哪里出问题了。
如果要防止重启服务器后iptables丢失，先运行：

    iptables-save > /etc/iptables-rules

然后修改**/etc/network/interfaces**文件，在eth0 下面加入：

    pre-up iptables-restore < /etc/iptables-rules
这样，服务器重启后，就能自动挂载规则了。可以考虑租个服务器卖翻墙vpn了。

- - - -
