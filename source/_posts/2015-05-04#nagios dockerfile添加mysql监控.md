---
title: nagios dockerfile添加mysql监控
permalink: nagios-mysql
tags:
    - nagios
    - mysql
    - docker
date: 2015-05-04
---

## 配置过程:

确保nagios宿主机即监控主节点安装了mysql-client，被监控节点不需要安装任何插件,只需要mysql service正常running即可。首先确保有这样的一个user(以下的操作发生在被监控节点):

The following command will create a user named "nagios" with a password "password" and grant him access on the local MySQL DB.

    CREATE USER 'nagios'@'localhost' IDENTIFIED BY 'password'; 

The following command issues full permissions to the nagios user.

    GRANT USAGE ON *.* TO 'nagios'@'localhost';

The following command will create a user named "nagios" with a password "password" and allow him to access the DB from any (%) location.

    CREATE USER 'nagios'@'%' IDENTIFIED BY 'password'; 

The following command issues full permissions to the nagios user from any location.

    GRANT USAGE ON *.* TO 'nagios'@'%';

    flush privileges;

我使用的是**CREATE USER 'nagios'@'%' IDENTIFIED BY 'password';** 

此外,注释掉mysql配置文件my.cnf中如下一行,

    bind-address   =   127.0.0.1

## 在dockerfile里边添加(以下的操作都发生在nagios主节点)

**RUN wget http://labs.consol.de/download/shinken-nagios-plugins/check_mysql_health-2.1.8.2.tar.gz && tar -xvzf check_mysql_health-2.1.8.2.tar.gz && cd check_mysql_health-2.1.8.2 &&  ./configure --with-nagios-user=${NAGIOS_USER} --with-nagios-group=${NAGIOS_USER} && make && make install**

编译安装软件之后,在**/usr/local/nagios/libexec**可以看到 check_mysql_health插件(默认安装)

在**remotehost.cfg**中添加command和service

    define command{
    command_name check_mysql_health
    command_line $USER1$/check_mysql_health --hostname $HOSTADDRESS$ --port $ARG1$ --username $ARG2$ --         password $ARG3$ --mode $ARG4$ 
    }

    define service{
    use generic-service
    host_name localhost
    service_description MySQL_threads-connected
    check_command check_mysql_health!3306!user!password!threads-connected
    }
    
    define service{
    use generic-service
    host_name localhost
    service_description MySQL_connection-time
    check_command check_mysql_health!3306!user!password!connection-time
    }

    define service{
    use generic-service
    host_name localhost
    service_description MySQL_uptime
    check_command check_mysql_health!3306!user!password!uptime
    }

注：

* user和password具体替换
*hots_name具体指定

然后运行

    service nagios restart

注意,在command的定义中,还可以添加的参数包括:

* --database  dbname (默认是information_schema )
* --warning  range
* --critical range 

相应的,在service定义中就可以多使用!符号把参数传进去,后俩个具体数值我不清楚设置多少合适,所以就使用了默认值
,这样应该就可以了

## 参考链接:

* [文档一](http://labs.consol.de/nagios/check_mysql_health/)
* [文档二](http://exchange.nagios.org/directory/MySQL/check_mysql_health/details)
* [monitoring mysql usingnagios](http://www.yoyoclouds.com/2014/08/monitoring-mysql-using-nagios.html)

