# 猫咪主页 - 主题包

这个目录包含了适用于猫咪风格个人主页的多种主题样式。您可以轻松切换这些主题，为您的个人主页带来全新的视觉体验。

## 可用主题

1. **柔和粉彩主题** (pastel-theme.css)
   - 以柔和的粉彩色调为基础的清新主题
   - 主色调：紫色和粉红色
   - 适合喜欢温柔、梦幻风格的用户

2. **海洋风格主题** (ocean-theme.css)
   - 以海洋蓝色系为基础的清爽主题
   - 主色调：蓝色和青色
   - 适合喜欢清新、专业风格的用户

3. **森林绿风格主题** (forest-theme.css)
   - 以自然森林色调为基础的清新主题
   - 主色调：绿色和棕色
   - 适合喜欢自然、平静风格的用户

4. **暗夜风格主题** (night-theme.css)
   - 以暗黑星空为灵感的酷炫主题
   - 主色调：深蓝和紫色
   - 适合喜欢科技感、神秘风格的用户

5. **可爱卡通风格主题** (cute-theme.css)
   - 以卡通和可爱元素为主的充满童趣的主题
   - 主色调：粉红色和紫色
   - 适合喜欢可爱、活泼风格的用户

## 如何使用

### 方法一：直接链接主题文件

在 `index.html` 的 `<head>` 部分添加对应主题的 CSS 文件链接：

```html
<!-- 在原有样式表之后添加主题样式 -->
<link rel="stylesheet" href="static/css/style.css">
<link rel="stylesheet" href="themes/pastel-theme.css">  <!-- 更换为您想使用的主题 -->
```

### 方法二：添加主题切换功能

1. 在 `index.html` 中添加主题选择器：

```html
<div class="theme-selector">
  <button data-theme="default">默认主题</button>
  <button data-theme="pastel">粉彩主题</button>
  <button data-theme="ocean">海洋主题</button>
  <button data-theme="forest">森林主题</button>
  <button data-theme="night">暗夜主题</button>
  <button data-theme="cute">可爱主题</button>
</div>
```

2. 在 `script.js` 中添加主题切换功能：

```javascript
// 主题切换功能
function initThemeSelector() {
  const themeButtons = document.querySelectorAll('.theme-selector button');
  const head = document.querySelector('head');
  let currentThemeLink = null;
  
  // 从本地存储中获取已保存的主题
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && savedTheme !== 'default') {
    loadTheme(savedTheme);
  }
  
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      
      // 保存主题选择到本地存储
      localStorage.setItem('selectedTheme', theme);
      
      if (theme === 'default') {
        // 移除当前主题
        if (currentThemeLink) {
          currentThemeLink.remove();
          currentThemeLink = null;
        }
      } else {
        loadTheme(theme);
      }
      
      // 更新活动按钮状态
      themeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  function loadTheme(theme) {
    // 移除当前主题
    if (currentThemeLink) {
      currentThemeLink.remove();
    }
    
    // 添加新主题
    currentThemeLink = document.createElement('link');
    currentThemeLink.rel = 'stylesheet';
    currentThemeLink.href = `themes/${theme}-theme.css`;
    head.appendChild(currentThemeLink);
    
    // 高亮当前主题按钮
    const activeButton = document.querySelector(`.theme-selector button[data-theme="${theme}"]`);
    if (activeButton) {
      document.querySelectorAll('.theme-selector button').forEach(btn => btn.classList.remove('active'));
      activeButton.classList.add('active');
    }
  }
}

// 在页面加载完成后初始化主题选择器
document.addEventListener('DOMContentLoaded', function() {
  // 其他初始化代码...
  initThemeSelector();
});
```

3. 添加主题选择器样式到 `style.css`：

```css
/* 主题选择器样式 */
.theme-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 20px auto;
  max-width: 600px;
}

.theme-selector button {
  padding: 8px 15px;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.theme-selector button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px var(--shadow-color);
}

.theme-selector button.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

@media (max-width: 600px) {
  .theme-selector {
    gap: 5px;
  }
  
  .theme-selector button {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}
```

## 自定义主题

您可以通过复制现有主题文件并修改其中的颜色变量来创建自己的主题：

```css
:root {
  --bg-color: #你的背景色;
  --card-bg: #你的卡片背景色;
  --text-color: #你的文本颜色;
  --title-color: #你的标题颜色;
  --accent-color: #你的强调色;
  --hover-color: #你的悬停颜色;
  --shadow-color: rgba(R, G, B, 0.1);
  --paw-color: rgba(R, G, B, 0.8);
  --border-color: #你的边框颜色;
}

[data-theme="dark"] {
  /* 暗色模式下的颜色设置 */
  --bg-color: #你的暗色背景色;
  /* 其他颜色... */
}
```

## 注意事项

1. 主题文件仅修改颜色、阴影和简单的视觉效果，不会更改页面布局
2. 所有主题都支持明/暗模式切换
3. 您可以将多个主题文件混合使用创建独特的风格
4. 建议使用浏览器开发工具预览颜色更改效果

## 寻求帮助

如果您在使用主题时遇到任何问题，或者希望获得更多自定义主题的帮助，请提交 Issue 或直接联系我们。 