# 猫咪主页 - 后台管理系统

这是猫咪风格个人主页的后台管理系统，允许您轻松地管理网站内容而无需直接编辑代码。

## 系统架构

后台管理系统由以下部分组成：

1. **管理界面 (admin.html)** - 基于Bootstrap 5的用户界面
2. **管理脚本 (static/js/admin.js)** - 前端JavaScript逻辑
3. **Cloudflare Worker (worker.js)** - 处理API请求和数据存储

## 部署指南

### 1. 部署前端文件

确保您的Cloudflare Pages项目中包含以下文件：

- `index.html` - 主页面
- `admin.html` - 后台管理界面
- `static/css/style.css` - 样式文件
- `static/js/script.js` - 前端脚本
- `static/js/admin.js` - 管理脚本
- 所有图像和资源文件

### 2. 创建Cloudflare Worker

1. 登录[Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入Workers & Pages
3. 创建新Worker
4. 复制`worker.js`的内容到编辑器中
5. 点击"保存并部署"

### 3. 创建KV命名空间

1. 在Cloudflare Workers界面中，转到"KV"选项卡
2. 点击"创建命名空间"
3. 命名为`CATPAGE`(或您选择的名称)
4. 返回Worker编辑界面，转到"设置"选项卡
5. 在"变量绑定"部分，点击"添加绑定"
6. 变量名输入`CATPAGE`，类型选择"KV命名空间"，选择刚创建的命名空间
7. 保存并重新部署Worker

### 4. 配置Worker

在Worker中，需要修改以下变量：

```javascript
// 环境变量
const ADMIN_USERNAME = 'admin';  // 更改为您的用户名
const ADMIN_PASSWORD_HASH = '5f4dcc3b5aa765d61d8327deb882cf99';  // 更改为您密码的MD5哈希
const JWT_SECRET = 'your-secret-key';  // 更改为随机字符串
const CORS_ORIGINS = ['https://your-site.pages.dev', 'http://localhost:3000']; // 更改为您网站的域名
```

要生成密码的MD5哈希，可以使用在线工具如[MD5 Hash Generator](https://www.md5hashgenerator.com/)。

### 5. 配置管理脚本

编辑`static/js/admin.js`文件，更改API地址：

```javascript
// API地址 - 部署到Cloudflare Worker后替换
const API_URL = 'https://your-worker.your-account.workers.dev';
// 测试模式 - 部署后设为false
const TEST_MODE = false;
```

## 使用方法

### 访问管理界面

访问`https://your-site.pages.dev/admin.html`登录管理界面。默认登录凭证：

- 用户名：`admin`
- 密码：`password123`

**重要：** 部署后请立即修改默认密码！

### 管理功能

后台管理系统允许您：

1. **编辑个人信息**
   - 更改名称和简介

2. **管理社交链接**
   - 添加/删除/编辑社交媒体链接
   - 更改图标和链接地址

3. **管理项目**
   - 添加新项目
   - 编辑现有项目
   - 删除项目
   - 自定义项目图标和链接

4. **网站设置**
   - 修改网站标题
   - 更新网站描述

## 安全注意事项

1. **更改默认密码** - 务必在部署后立即更改默认的用户名和密码
2. **使用强JWT密钥** - 在Worker代码中使用长而复杂的随机字符串作为JWT_SECRET
3. **启用Cloudflare访问策略** - 考虑为管理页面设置Cloudflare Access策略，增加一层额外保护

## 测试模式

初始部署时，`admin.js`中的`TEST_MODE`设置为`true`，这让您可以在本地测试所有功能而无需实际的API连接。完成部署后，请将其设置为`false`以启用与Worker的通信。

## 故障排除

如果遇到问题：

1. **登录失败** - 检查Worker是否正确部署，API_URL是否正确
2. **保存失败** - 检查KV命名空间是否正确绑定
3. **CORS错误** - 确保在Worker中正确设置了CORS_ORIGINS

## 进一步定制

本系统设计为一个简单的起点，您可以根据需要进一步扩展：

- 添加更多网站设置选项
- 实现更复杂的内容编辑器
- 添加图片上传功能
- 集成其他Cloudflare服务 