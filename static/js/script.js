/*
 * 猫咪风格个人主页 - JavaScript脚本
 * 作者: AI助手
 */

// 等待DOM内容加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题
  initTheme();
  
  // 加载随机头像
  loadRandomAvatar();
  
  // 初始化猫咪互动效果
  initCatInteraction();
  
  // 初始化页面过渡效果
  initPageTransitions();
  
  // 初始化猫爪点击效果
  initPawClickEffect();
  
  // 初始化项目卡片动画
  initProjectCards();
});

// 初始化主题设置
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 检查本地存储中是否有保存的主题设置
  let currentTheme = localStorage.getItem('theme');
  
  // 如果没有保存的主题，则根据系统偏好设置
  if (!currentTheme) {
    currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  }
  
  // 应用主题
  applyTheme(currentTheme);
  
  // 添加主题切换按钮点击事件
  themeToggle.addEventListener('click', function() {
    let newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    currentTheme = newTheme;
  });
  
  // 系统主题变化时自动调整
  prefersDarkScheme.addEventListener('change', function(e) {
    const newTheme = e.matches ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    currentTheme = newTheme;
  });
}

// 应用主题样式
function applyTheme(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('bi-moon');
    themeIcon.classList.add('bi-sun');
    
    // 猫咪眼睛变化
    animateCatEyes(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.classList.remove('bi-sun');
    themeIcon.classList.add('bi-moon');
    
    // 猫咪眼睛变化
    animateCatEyes(false);
  }
}

// 猫咪眼睛暗模式变化动画
function animateCatEyes(isDark) {
  const catEyes = document.querySelectorAll('.cat-eye');
  catEyes.forEach(eye => {
    eye.style.transition = 'background 0.5s ease, box-shadow 0.5s ease';
  });
}

// 初始化猫咪互动效果
function initCatInteraction() {
  const cat = document.querySelector('.cat-container');
  if (!cat) return;
  
  cat.addEventListener('click', function() {
    this.classList.add('cat-animate');
    
    // 猫咪喵喵叫声
    playCatSound();
    
    // 删除动画类以便下次点击可以再次触发
    setTimeout(() => {
      this.classList.remove('cat-animate');
    }, 500);
  });
  
  // 定时摇尾巴
  setInterval(() => {
    const catTail = document.querySelector('.cat-tail');
    if (catTail) {
      catTail.style.animation = 'none';
      setTimeout(() => {
        catTail.style.animation = 'tail-wag 3s infinite ease-in-out';
      }, 10);
    }
  }, 10000);
}

// 播放猫咪叫声
function playCatSound() {
  const meowSound = new Audio();
  meowSound.src = '/static/sound/meow.mp3';
  meowSound.volume = 0.5;
  meowSound.play().catch(e => console.log('播放声音失败:', e));
}

// 初始化页面过渡效果
function initPageTransitions() {
  // 为所有内容添加淡入效果
  const elements = [
    '.profile-section',
    '.projects-section .project-card'
  ];
  
  elements.forEach((selector, index) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, i) => {
      item.classList.add('fade-transition');
      item.style.animationDelay = `${(index * 0.1) + (i * 0.1)}s`;
    });
  });
}

// 初始化项目卡片动画
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card, index) => {
    // 设置卡片出现的动画延迟
    card.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    
    // 鼠标悬停动画
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.project-icon');
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.project-icon');
      icon.style.transform = 'scale(1)';
    });
    
    // 点击项目卡片动画
    card.addEventListener('click', function(e) {
      // 点击动画效果
      this.style.transform = 'scale(0.95)';
      
      // 创建波纹效果
      createRippleEffect(e, this);
      
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
}

// 创建波纹点击效果
function createRippleEffect(e, element) {
  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// 猫爪点击效果
function initPawClickEffect() {
  // 创建猫爪SVG元素
  const pawSVG = `
    <svg class="paw-effect" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--paw-color)" d="M50,35 C55,25 65,20 75,35 C85,50 75,65 50,65 C25,65 15,50 25,35 C35,20 45,25 50,35 Z" />
      <circle fill="var(--paw-color)" cx="30" cy="25" r="10" />
      <circle fill="var(--paw-color)" cx="70" cy="25" r="10" />
      <circle fill="var(--paw-color)" cx="30" cy="55" r="10" />
      <circle fill="var(--paw-color)" cx="70" cy="55" r="10" />
    </svg>
  `;
  
  // 添加猫爪元素到body
  const pawElement = document.createElement('div');
  pawElement.innerHTML = pawSVG;
  document.body.appendChild(pawElement.firstElementChild);
  
  // 获取猫爪元素
  const paw = document.querySelector('.paw-effect');
  
  // 点击事件处理
  document.addEventListener('click', (e) => {
    // 如果点击的是项目卡片，则不显示猫爪效果（避免重叠）
    if (e.target.closest('.project-card')) return;
    
    // 设置猫爪位置
    paw.style.left = `${e.clientX - 20}px`;
    paw.style.top = `${e.clientY - 20}px`;
    
    // 显示猫爪
    paw.style.opacity = '0.6';
    paw.style.transform = 'scale(0.1)';
    
    // 添加过渡动画
    paw.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // 放大并淡出
    setTimeout(() => {
      paw.style.transform = 'scale(1)';
      paw.style.opacity = '0';
    }, 10);
  });
}

// 网站链接悬停效果
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('.site-link')) {
    const link = e.target.closest('.site-link');
    link.style.transition = 'transform 0.3s ease, background 0.3s ease';
  }
});

// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

// 加载随机头像API
function loadRandomAvatar() {
  const profileImg = document.querySelector('.profile-img');
  if (!profileImg) return;
  
  // 设置加载中的状态
  profileImg.style.opacity = '0.5';
  
  // 使用新的头像API - 直接返回图片
  profileImg.src = 'https://www.loliapi.com/acg/pp/';
  
  // 图片加载完成后恢复不透明度
  profileImg.onload = function() {
    profileImg.style.opacity = '1';
  };
  
  // 图片加载失败时使用默认头像
  profileImg.onerror = function() {
    console.error('头像加载失败');
    profileImg.src = 'static/img/cat-logo.svg';
    profileImg.style.opacity = '1';
  };
} 