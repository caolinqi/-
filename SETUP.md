# 项目设置指南

## 📦 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置高德地图 API Key

在 `src/views/Map.vue` 文件中，找到以下代码：

```typescript
const AMAP_KEY = 'YOUR_AMAP_KEY' // 请替换为你的高德地图API Key
```

将其替换为你的高德地图 API Key。

**获取高德地图 API Key 的步骤：**

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册/登录账号
3. 进入控制台，创建新应用
4. 添加 Key，选择 "Web 端（JS API）"
5. 复制生成的 Key 并替换上述代码中的 `YOUR_AMAP_KEY`

**注意：** 如果暂时没有 API Key，地图功能将无法使用，但其他功能不受影响。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看项目。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## ⚠️ 常见问题

### TypeScript 类型错误

如果遇到 TypeScript 类型错误（如找不到模块），请确保：

1. 已安装所有依赖：`npm install`
2. 重启 IDE 或 TypeScript 服务器

### 地图无法加载

如果地图页面显示空白：

1. 检查是否已正确配置高德地图 API Key
2. 检查浏览器控制台是否有错误信息
3. 确认 API Key 的域名白名单配置正确

### 样式未生效

如果样式未正确显示：

1. 确保 `src/styles/main.scss` 文件存在
2. 检查 `src/main.ts` 中是否正确导入了样式文件

## 📝 下一步

项目已配置完成！你可以：

- 查看 `README.md` 了解项目详情
- 修改 `src/assets/data/` 下的 JSON 文件添加更多数据
- 自定义样式和主题色

