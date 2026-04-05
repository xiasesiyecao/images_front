# Docker Image Asset Frontend

前端管理台，面向公司内部的 Docker 镜像资产登记与查询场景。

当前第一版重点解决：

- 根据镜像名快速检索镜像资产
- 维护 Harbor 镜像与 GitLab 构建来源的映射关系
- 记录镜像内容摘要、关键依赖、维护人和复用建议

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Axios

## 当前功能

- 镜像资产列表页
- 镜像资产新增页
- 镜像资产编辑页
- 镜像资产详情页
- 状态、运行时、构建来源类型等元数据下拉

## 目录结构

```text
src/
  api/        接口封装
  router/     路由配置
  styles/     全局样式
  types/      前端类型定义
  views/      页面视图
```

## 本地启动

安装依赖：

```bash
npm install
```

开发启动：

```bash
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173
```

## 打包

```bash
npm run build
```

## 接口代理

开发环境通过 `vite.config.ts` 代理后端接口：

- `/api` -> `http://127.0.0.1:8080`

如果后端端口调整，需要同步修改 [vite.config.ts](/home/ubuntu/Docker/frontend/vite.config.ts)。

## 页面说明

### 1. 镜像资产列表

用于搜索和浏览镜像资产，支持按以下条件筛选：

- 关键字
- Harbor 项目
- 状态
- 运行时
- 维护人

### 2. 新增 / 编辑镜像资产

录入内容包括：

- 基础信息
- 构建来源
- 镜像内容摘要
- 关键依赖
- 确认信息

### 3. 镜像资产详情

展示内容包括：

- 镜像基本信息
- Harbor 仓库信息
- 构建来源路径
- 镜像内容摘要
- 依赖标签
- 最近确认信息

## 当前适用范围

这版前端主要用于“资产台账管理”，不包含：

- GitLab 在线编辑构建文件
- Harbor 自动同步
- GitLab 自动扫描构建文件
- 权限体系和 SSO

## 后续建议

- 增加构建文件内容快照展示
- 增加 Excel 导入历史资产
- 增加变更记录与审计页
- 接入 Harbor / GitLab 实际项目数据
