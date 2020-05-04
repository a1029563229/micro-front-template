# 微前端架构模板

## 介绍

> 微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。

为实现多个独立应用（功能独立，业务耦合度高）之间无缝切换，借鉴了蚂蚁金服的微前端架构方案，将多个应用聚合在一起。通过自定义配置，实现不同应用之间页面级别的自由组合，搭建了这套微前端架构模板。（如下图）


![架构图](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/3.png)

效果图：

![效果图](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/4.png)

本仓库基于 `qiankun` 实现微前端架构，借鉴了 `qiankun` 官方提供的 `Demo`，运行命令如下：

```bash
yarn examples:install
yarn examples:start
```

### 关于跨域

由于 `qiankun` 内部使用的是 `Fetch HTML` 的方式加载子应用，所以会遇到跨域问题。我们需要先解决跨域问题，使我们的主应用可以正常加载子应用相关资源。

在开发环境下，本项目配置了跨域解决方案，所以在直接运行项目并不会遇到跨域问题，生产环境的跨域问题可以参考下面的方案。

#### 扩展阅读

本项目在生产环境（和开发环境），采用 `caddy` 解决应用间跨域问题及生产部署问题，`caddy` 的安装和使用可以参照 [`caddy` 入门教程](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/4.png)。

`caddy` 可以在本地开发和生产环境可以提供同一套跨域解决方案，建议使用。如果你不想使用 `caddy`，那么也可以通过其他方案（如 `nginx` 等等）解决跨域问题。