/**
 * 猫咪主页 - 主题选择器脚本
 * 提供简单的主题切换功能
 */

// 初始化主题选择器功能
function initThemeSelector() {
  // 创建主题选择界面
  createThemeSelector();
  
  // 获取主题按钮
  const themeButtons = document.querySelectorAll('.theme-selector button');
  const head = document.querySelector('head');
  let currentThemeLink = null;
  
  // 从本地存储中获取已保存的主题
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && savedTheme !== 'default') {
    loadTheme(savedTheme);
  }
  
  // 添加按钮点击事件
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
  
  // 加载主题的函数
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

// 创建主题选择器的HTML元素
function createThemeSelector() {
  // 检查是否已存在主题选择器
  if (document.querySelector('.theme-selector')) {
    return;
  }
  
  // 定义可用主题
  const themes = [
    { id: 'default', name: '默认主题' },
    { id: 'pastel', name: '粉彩主题' },
    { id: 'ocean', name: '海洋主题' },
    { id: 'forest', name: '森林主题' },
    { id: 'night', name: '暗夜主题' },
    { id: 'cute', name: '可爱主题' }
  ];
  
  // 创建主题选择器容器
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'theme-selector';
  
  // 创建标题
  const title = document.createElement('h3');
  title.textContent = '选择主题';
  title.style.width = '100%';
  title.style.textAlign = 'center';
  title.style.marginBottom = '15px';
  title.style.color = 'var(--title-color)';
  selectorContainer.appendChild(title);
  
  // 为每个主题创建按钮
  themes.forEach(theme => {
    const button = document.createElement('button');
    button.setAttribute('data-theme', theme.id);
    button.textContent = theme.name;
    
    // 检查当前活动主题
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    if (theme.id === savedTheme) {
      button.classList.add('active');
    }
    
    selectorContainer.appendChild(button);
  });
  
  // 添加主题选择器到页面
  // 尝试将其插入到 profile-section 之后
  const profileSection = document.querySelector('.profile-section');
  
  if (profileSection && profileSection.parentNode) {
    profileSection.parentNode.insertBefore(selectorContainer, profileSection.nextSibling);
  } else {
    // 回退方案：添加到main-container
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.insertBefore(selectorContainer, mainContainer.firstChild);
    }
  }
  
  // 添加主题选择器样式
  addThemeSelectorStyles();
}

// 添加主题选择器的CSS样式
function addThemeSelectorStyles() {
  // 检查是否已添加样式
  if (document.getElementById('theme-selector-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'theme-selector-styles';
  style.textContent = `
    .theme-selector {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 20px auto;
      max-width: 600px;
      padding: 20px;
      background: var(--card-bg);
      border-radius: 15px;
      box-shadow: 0 5px 15px var(--shadow-color);
      border: 1px solid var(--border-color);
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
        padding: 15px 10px;
      }
      
      .theme-selector button {
        padding: 5px 10px;
        font-size: 0.8rem;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// 添加主题切换按钮到页面顶部导航
function addThemeToggleButton() {
  // 创建显示/隐藏主题选择器的按钮
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggle-themes';
  toggleButton.className = 'theme-toggle-btn';
  toggleButton.innerHTML = '<i class="bi bi-palette"></i>';
  toggleButton.title = '更换主题';
  
  // 设置按钮样式
  toggleButton.style.background = 'transparent';
  toggleButton.style.border = 'none';
  toggleButton.style.color = 'var(--text-color)';
  toggleButton.style.fontSize = '1.2rem';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.marginLeft = '10px';
  toggleButton.style.transition = 'all 0.3s ease';
  
  // 添加悬停效果
  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.transform = 'rotate(30deg)';
    toggleButton.style.color = 'var(--accent-color)';
  });
  
  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.transform = 'rotate(0deg)';
    toggleButton.style.color = 'var(--text-color)';
  });
  
  // 添加点击事件：显示/隐藏主题选择器
  toggleButton.addEventListener('click', () => {
    const selector = document.querySelector('.theme-selector');
    if (selector) {
      selector.style.display = selector.style.display === 'none' ? 'flex' : 'none';
    }
  });
  
  // 将按钮添加到导航栏
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle && themeToggle.parentNode) {
    themeToggle.parentNode.insertBefore(toggleButton, themeToggle.nextSibling);
  }
}

// 在文档加载完成后初始化主题选择器
document.addEventListener('DOMContentLoaded', function() {
  initThemeSelector();
  addThemeToggleButton();
  
  // 初始隐藏主题选择器(可选)
  // setTimeout(() => {
  //   const selector = document.querySelector('.theme-selector');
  //   if (selector) {
  //     selector.style.display = 'none';
  //   }
  // }, 100);
}); 