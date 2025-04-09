# 🐱 猫咪风格个人主页

一个超可爱的猫咪风格个人导航页面，带有精美的动画效果、响应式设计和完整的后台内容管理系统。

## ✨ 特点

- 🎨 猫咪主题设计，超可爱风格
- 🌓 支持亮色/暗色模式切换
- 🖥️ 完全响应式，适配各种设备
- 🎭 猫咪互动动画效果（点击、波纹、猫爪）
- 🔗 简洁美观的链接展示方式
- 🚀 轻量级，加载迅速
- 📊 完整的后台内容管理系统
- 🔄 数据实时同步，自动更新

## 📦 目录结构

```
.
├── index.html          # 主页面
├── admin.html          # 管理界面
├── static/             # 静态资源
│   ├── css/            # 样式文件
│   │   └── style.css   # 主样式表
│   ├── js/             # JavaScript脚本
│   │   ├── script.js   # 前端脚本
│   │   └── admin.js    # 管理界面脚本
│   ├── img/            # 图片资源
│   │   ├── cat-logo.svg    # 猫咪logo
│   │   ├── favicon.svg     # 网站图标
│   │   └── paw-pattern.svg # 猫爪图案
│   ├── sound/          # 音效文件
│   │   └── meow.mp3    # 猫咪叫声
│   └── fonts/          # 字体文件
├── worker.js           # Cloudflare Worker 后端
├── ADMIN_README.md     # 管理系统文档
└── README.md           # 项目说明
```

## 🚀 部署指南

### 前端部署 (GitHub Pages)

1. **Fork 或克隆仓库**
   ```bash
   git clone https://github.com/Jeffrey-done/cat-zhuye.git
   cd cat-zhuye
   ```

2. **修改个性化设置**
   - 使用管理界面修改内容，或
   - 直接编辑 `index.html` 中的链接和个人信息

3. **部署到 GitHub Pages**
   - 推送代码到你的 GitHub 仓库
   - 在仓库设置中启用 GitHub Pages
   - 选择 main 分支作为源

### 后端部署 (Cloudflare Worker)

1. **创建 Cloudflare 账户**
   - 注册 [Cloudflare](https://dash.cloudflare.com/) 账户

2. **创建 KV 命名空间**
   - 进入 Workers & Pages
   - 点击 "KV" 选项卡
   - 创建一个名为 `CATPAGE` 的命名空间

3. **部署 Worker**
   - 在 Workers & Pages 中创建新 Worker
   - 复制 `worker.js` 的内容到编辑器
   - 修改以下配置：
     ```javascript
     const ADMIN_USERNAME = 'admin';  // 设置管理员用户名
     const ADMIN_PASSWORD_HASH = '5f4dcc3b5aa765d61d8327deb882cf99';  // 默认密码为 'password'
     const JWT_SECRET = 'your-secret-key';  // 更改为随机字符串
     const CORS_ORIGINS = ['https://your-github-username.github.io', 'http://localhost:3000'];
     ```
   - 点击 "保存并部署"

4. **绑定 KV 命名空间**
   - 在 Worker 设置中找到 "变量绑定"
   - 添加 KV 命名空间绑定
   - 变量名设为 `CATPAGE`，选择之前创建的命名空间

5. **配置前端连接**
   - 修改 `static/js/admin.js` 和 `static/js/script.js` 中的 API URL：
     ```javascript
     const API_URL = 'https://your-worker-name.your-account.workers.dev';
     ```
   - 推送更改到 GitHub 仓库

## 🔧 使用指南

### 前端浏览

访问部署好的网站 (例如：https://jeffrey-done.github.io/cat-zhuye/)，享受以下功能：

- **主题切换**：点击右上角的图标切换亮色/暗色模式
- **猫咪互动**：点击右下角的猫咪触发动画
- **项目卡片**：点击卡片查看波纹效果
- **自动适配**：在不同设备上自动调整布局

### 后台管理

1. **访问管理界面**
   - 打开 `/admin.html` (例如：https://jeffrey-done.github.io/cat-zhuye/admin.html)

2. **登录系统**
   - 使用设置的管理员用户名和密码 (默认: admin/password)

3. **内容管理**
   - **个人资料**：修改名称和简介
   - **社交链接**：管理各种社交媒体链接
   - **项目管理**：添加、编辑、删除项目卡片
   - **网站设置**：修改网站标题和描述

## 🔒 安全建议

1. **修改默认密码**：部署后立即更改默认密码
2. **使用强JWT密钥**：设置复杂的 JWT_SECRET
3. **定期备份数据**：从 KV 存储导出数据备份
4. **启用额外保护**：考虑为管理页面添加额外的访问控制

## 🛠️ 高级定制

### 自定义域名

1. **GitHub Pages 自定义域名**：
   - 在仓库设置中配置自定义域名
   - 设置 DNS 记录指向 GitHub Pages

2. **更新 Worker CORS 配置**：
   - 在 `worker.js` 中添加您的自定义域名到 `CORS_ORIGINS` 数组

### 添加更多功能

- **图片上传**：扩展管理界面以支持图片上传
- **内容编辑器**：添加富文本编辑功能
- **分析集成**：添加访问统计功能

## 📝 技术文档

### 前端技术

- **HTML5/CSS3**: 页面结构和样式
- **Vanilla JavaScript**: 无依赖的原生JavaScript实现
- **响应式设计**: 使用媒体查询适配不同屏幕尺寸
- **CSS动画**: 使用CSS实现各种动画效果

### 后端技术

- **Cloudflare Workers**: 无服务器函数即服务
- **KV存储**: 键值对数据库存储网站内容
- **JWT认证**: JSON Web Token实现安全认证
- **CORS**: 跨域资源共享，允许前端访问API

### 数据流程

1. **管理界面授权**:
   - 用户通过管理界面登录获取JWT令牌
   - 使用令牌进行后续API请求

2. **数据同步**:
   - 后台保存数据到KV存储
   - 前端从KV存储自动获取最新数据

3. **缓存机制**:
   - 前端实现本地缓存，减少API请求
   - 设置缓存有效期，确保数据最终一致性

## 🙏 致谢

- 灵感来源于各种猫咪图片和动画
- 感谢开源社区的支持
- 特别感谢 Cloudflare 提供的优质平台

## 📄 许可

MIT 许可证
