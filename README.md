# flycast-service

[flycast.co](https://flycast.co) 的后端服务，处理前端发起的所有 API 请求。

面向开发者与基础设施运维人员，当前支持以下功能模块：

| 模块 | 描述 |
|------|------|
| QR Code 生成器 | 单条/批量生成二维码，支持图片下载与 ZIP 打包导出 |
| Caddyfile 远程编辑器 | 多节点 Caddyfile 配置管理，语法高亮、一键保存与重载 |
| 超管控制台 | Token 鉴权的运维后台，支持阿里云 CDN 缓存刷新等操作 |

## API 概览

| 方法 | 路径 | 描述 |
|------|------|------|
| `POST` | `/check-token` | 验证控制台访问 Token |
| `POST` | `/v1/aliyun-cdn-refresh` | 刷新阿里云 CDN 缓存 |

> 所有需要鉴权的接口通过 `Authorization: Bearer <token>` 请求头传递令牌。

## 相关项目

- [flycast-web](https://github.flycastco/flycastco/flycast-web) — flycast.co 前端（Vue 3 + Vite）

## License

Private — All rights reserved.
