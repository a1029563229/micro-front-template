# 微前端架构模板

## 介绍

> 微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。

为实现多个独立应用（功能独立，业务耦合度高）之间无缝切换，借鉴了蚂蚁金服的微前端架构方案，将多个应用聚合在一起。通过自定义配置，实现不同应用之间页面级别的自由组合，搭建了这套微前端架构模板。（如下图）


![架构图](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/3.png)

效果图：

![效果图](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/4.png)