---
title: gitlab-docker更新指南
permalink: igtlab-docker-update
tags:
    - gitlab
date: 2016-02-29
---

## 1. build新版本的gitlab的docker image文件 

    cd ~/dockerimages/gitlab/no-nrpe;
    
修改Dockerfile中FROM指令gitlab为最新版本号,然后:

    docker build -t docker.answ.me:5000/aplusplus/gitlab:8.5.1 .     #本次更新的版本号为8.5.1

build过程时间会略长,之后会生成新的gitlab image文件，之后的过程都在/ICSapps/compose-file/ics目录下：

    cd /ICSapps/compose-file/ics

## 2. 接下来build数据库和redis(这一块不一定需要，因为redis和postgresql版本更新的很慢)

    cd /ICSapps/compose-file/ics
    docker-compose stop; #把三个进程都停掉

然后pull 数据库和redis的image:

    docker pull docker.answ.me:5000/aplusplus/redis
    docker pull docker.answ.me:5000/aplusplus/postgresql:9.4-13  #新的版本号,要改
    docker-compose up -d


## 3. 备份数据(**如果无需更新redis和postgresql,可直接到这步**)

先停掉gitlab:
    
    docker-compose stop gitlab
    screen -S i

修改**backup.sh**中的版本,然后运行该脚本,进行数据备份(修改为这次要备份的版本号),这个过程要花费一些时间

## 4. 重新启动

    docker-compose stop
    docker-compose rm -vf #删除已经stop的container,container里边不存有数据,因为数据都在数据库和挂载到主机的目录里,因此可以放心删除之
    vi docker-compose.yml #修改所有的版本号,三个软件的
    docker-compose up -d

最后更新完成,全程需要root权限。

