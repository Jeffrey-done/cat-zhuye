/**
 * 猫咪主页 - 后台管理脚本
 */

// API地址 - 部署到Cloudflare Worker后替换
const API_URL = 'https://cat-zhuye.jeffreyy.workers.dev';
// 测试模式 - 部署后设为false
const TEST_MODE = false;

// 测试用户名和密码 (仅在测试模式下使用)
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'password123';

// 可用主题列表
const AVAILABLE_THEMES = [
  { id: 'default', name: '默认主题', color: '#ffb173' },
  { id: 'pastel', name: '柔和粉彩主题', color: '#f2a6c2' },
  { id: 'ocean', name: '海洋风格主题', color: '#40b9e6' },
  { id: 'forest', name: '森林绿风格主题', color: '#5cad7c' },
  { id: 'night', name: '暗夜风格主题', color: '#7c5ae6' },
  { id: 'cute', name: '可爱卡通风格主题', color: '#ff82b2' }
];

// 保存的数据
let siteData = {
  profile: {
    name: '猫咪主人',
    bio: '🐱 喵喵喵！这是一个充满猫咪元素的个人主页，用来展示我的项目。欢迎来到我的猫咪世界！',
    socialLinks: [
      { platform: 'github', url: '#', icon: 'github' },
      { platform: 'twitter', url: '#', icon: 'twitter-x' },
      { platform: 'email', url: '#', icon: 'envelope' },
      { platform: 'blog', url: '#', icon: 'journal-text' }
    ]
  },
  projects: [
    { id: '1', title: '项目一', icon: 'github', link: '#' },
    { id: '2', title: '项目二', icon: 'github', link: '#' },
    { id: '3', title: '项目三', icon: 'github', link: '#' }
  ],
  settings: {
    siteTitle: '猫咪风格个人主页',
    siteDescription: '一个超可爱的猫咪风格个人导航页面，带有精美的动画效果和响应式设计。',
    theme: 'default' // 默认主题
  }
};

// DOM 元素
const loginPage = document.getElementById('login-page');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const profileForm = document.getElementById('profile-form');
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const socialLinksContainer = document.getElementById('social-links-container');
const addSocialLinkBtn = document.getElementById('add-social-link');
const saveSocialLinksBtn = document.getElementById('save-social-links');
const projectsContainer = document.getElementById('projects-container');
const addProjectBtn = document.getElementById('add-project');
const projectEditCard = document.getElementById('project-edit-card');
const projectForm = document.getElementById('project-form');
const projectId = document.getElementById('project-id');
const projectTitle = document.getElementById('project-title');
const projectIcon = document.getElementById('project-icon');
const projectLink = document.getElementById('project-link');
const cancelProjectEditBtn = document.getElementById('cancel-project-edit');
const settingsForm = document.getElementById('settings-form');
const siteTitle = document.getElementById('site-title');
const siteDescription = document.getElementById('site-description');

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initEventListeners();
  initThemeSelector();
});

// 初始化事件监听器
function initEventListeners() {
  // 登录表单提交
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login();
  });

  // 退出登录
  logoutBtn.addEventListener('click', logout);

  // 个人资料表单提交
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfile();
  });

  // 添加社交链接
  addSocialLinkBtn.addEventListener('click', addSocialLink);
  
  // 保存社交链接
  saveSocialLinksBtn.addEventListener('click', saveSocialLinks);

  // 添加项目
  addProjectBtn.addEventListener('click', () => showProjectForm());

  // 项目表单提交
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProject();
  });

  // 取消项目编辑
  cancelProjectEditBtn.addEventListener('click', hideProjectForm);

  // 网站设置表单提交
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSettings();
  });
}

// 初始化主题选择器
function initThemeSelector() {
  const themeSelectContainer = document.getElementById('theme-select-container');
  if (!themeSelectContainer) return;
  
  // 清空容器
  themeSelectContainer.innerHTML = '';
  
  // 创建主题预览卡片
  AVAILABLE_THEMES.forEach(theme => {
    const themeCard = document.createElement('div');
    themeCard.className = 'theme-card';
    themeCard.setAttribute('data-theme', theme.id);
    
    // 设置当前主题指示器
    if (siteData.settings && siteData.settings.theme === theme.id) {
      themeCard.classList.add('active');
    }
    
    // 创建主题预览样式
    const previewStyle = document.createElement('div');
    previewStyle.className = 'theme-preview';
    previewStyle.style.backgroundColor = theme.color;
    
    // 创建主题信息
    const themeInfo = document.createElement('div');
    themeInfo.className = 'theme-info';
    themeInfo.innerHTML = `
      <h5>${theme.name}</h5>
      <small>${theme.id === 'default' ? '默认主题' : ''}</small>
    `;
    
    // 添加点击事件
    themeCard.addEventListener('click', () => {
      // 移除所有活动状态
      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
      });
      
      // 添加活动状态到当前卡片
      themeCard.classList.add('active');
      
      // 更新主题设置
      if (!siteData.settings) {
        siteData.settings = {};
      }
      siteData.settings.theme = theme.id;
      
      // 更新隐藏字段值
      document.getElementById('site-theme').value = theme.id;
      
      // 应用主题预览
      previewTheme(theme.id);
    });
    
    // 组装主题卡片
    themeCard.appendChild(previewStyle);
    themeCard.appendChild(themeInfo);
    themeSelectContainer.appendChild(themeCard);
  });
  
  // 如果有当前选中的主题，显示预览
  if (siteData.settings && siteData.settings.theme) {
    previewTheme(siteData.settings.theme);
  }
}

// 预览主题
function previewTheme(themeId) {
  // 移除当前主题样式
  const currentThemeLink = document.getElementById('preview-theme-link');
  if (currentThemeLink) {
    currentThemeLink.remove();
  }
  
  // 如果不是默认主题，添加新主题样式
  if (themeId !== 'default') {
    const themeLink = document.createElement('link');
    themeLink.id = 'preview-theme-link';
    themeLink.rel = 'stylesheet';
    themeLink.href = `themes/${themeId}-theme.css`;
    document.head.appendChild(themeLink);
  }
  
  // 更新预览文本
  const previewText = document.getElementById('theme-preview-text');
  if (previewText) {
    const themeName = AVAILABLE_THEMES.find(t => t.id === themeId)?.name || '默认主题';
    previewText.textContent = `当前选择: ${themeName}`;
  }
  
  console.log('预览主题:', themeId);
}

// 检查用户身份验证
async function checkAuth() {
  const token = localStorage.getItem('auth_token');
  
  if (TEST_MODE) {
    // 测试模式下，如果有任意token就显示管理面板
    if (token) {
      showAdminPanel();
      loadData();
    } else {
      showLoginPage();
    }
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      showAdminPanel();
      loadData();
    } else {
      showLoginPage();
    }
  } catch (error) {
    console.error('身份验证错误:', error);
    showLoginPage();
  }
}

// 登录
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (TEST_MODE) {
    // 测试模式下的简单验证
    if (username === TEST_USERNAME && password === TEST_PASSWORD) {
      localStorage.setItem('auth_token', 'test_token_123');
      showAdminPanel();
      loadData();
    } else {
      showLoginError();
    }
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('auth_token', data.token);
      showAdminPanel();
      loadData();
    } else {
      showLoginError();
    }
  } catch (error) {
    console.error('登录错误:', error);
    showLoginError();
  }
}

// 显示登录错误
function showLoginError() {
  loginError.classList.remove('hidden');
  setTimeout(() => {
    loginError.classList.add('hidden');
  }, 3000);
}

// 退出登录
function logout() {
  localStorage.removeItem('auth_token');
  showLoginPage();
}

// 显示登录页面
function showLoginPage() {
  adminPanel.classList.add('hidden');
  loginPage.classList.remove('hidden');
}

// 显示管理面板
function showAdminPanel() {
  loginPage.classList.add('hidden');
  adminPanel.classList.remove('hidden');
}

// 加载数据
async function loadData() {
  if (TEST_MODE) {
    // 使用测试数据
    populateFormFields(siteData);
    return;
  }
  
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch(`${API_URL}/data`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      siteData = data;
      populateFormFields(data);
    }
  } catch (error) {
    console.error('加载数据错误:', error);
    alert('加载数据失败，请检查网络连接后重试');
  }
}

// 填充表单字段
function populateFormFields(data) {
  // 个人资料
  profileName.value = data.profile.name || '';
  profileBio.value = data.profile.bio || '';
  
  // 社交链接
  renderSocialLinks(data.profile.socialLinks || []);
  
  // 项目
  renderProjects(data.projects || []);
  
  // 网站设置
  siteTitle.value = data.settings?.siteTitle || '';
  siteDescription.value = data.settings?.siteDescription || '';
  
  // 主题设置
  if (data.settings && data.settings.theme) {
    document.getElementById('site-theme').value = data.settings.theme;
    // 高亮选中的主题
    const themeCard = document.querySelector(`.theme-card[data-theme="${data.settings.theme}"]`);
    if (themeCard) {
      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
      });
      themeCard.classList.add('active');
    }
    // 预览主题
    previewTheme(data.settings.theme);
  }
}

// 渲染社交链接
function renderSocialLinks(links) {
  socialLinksContainer.innerHTML = '';
  
  links.forEach((link, index) => {
    const linkHtml = `
      <div class="social-link-item mb-2 border p-3 rounded d-flex align-items-center" data-index="${index}">
        <div class="flex-grow-1">
          <div class="input-group mb-2">
            <span class="input-group-text">平台</span>
            <input type="text" class="form-control social-platform" value="${link.platform || ''}" placeholder="github">
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">图标</span>
            <input type="text" class="form-control social-icon" value="${link.icon || ''}" placeholder="github">
          </div>
          <div class="input-group">
            <span class="input-group-text">链接</span>
            <input type="url" class="form-control social-url" value="${link.url || ''}" placeholder="https://...">
          </div>
        </div>
        <button type="button" class="btn btn-outline-danger ms-3 remove-social-link" data-index="${index}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    
    socialLinksContainer.insertAdjacentHTML('beforeend', linkHtml);
  });
  
  // 添加删除按钮事件
  document.querySelectorAll('.remove-social-link').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      siteData.profile.socialLinks.splice(index, 1);
      renderSocialLinks(siteData.profile.socialLinks);
    });
  });
}

// 添加社交链接
function addSocialLink() {
  siteData.profile.socialLinks.push({ platform: '', icon: '', url: '' });
  renderSocialLinks(siteData.profile.socialLinks);
}

// 保存社交链接
function saveSocialLinks() {
  const links = [];
  
  document.querySelectorAll('.social-link-item').forEach(item => {
    const platform = item.querySelector('.social-platform').value;
    const icon = item.querySelector('.social-icon').value;
    const url = item.querySelector('.social-url').value;
    
    links.push({ platform, icon, url });
  });
  
  siteData.profile.socialLinks = links;
  saveData();
}

// 渲染项目列表
function renderProjects(projects) {
  projectsContainer.innerHTML = '';
  
  projects.forEach(project => {
    const projectHtml = `
      <div class="list-group-item d-flex justify-content-between align-items-center" data-id="${project.id}">
        <div class="d-flex align-items-center">
          <div class="project-icon-preview me-3 bg-light rounded-circle p-2">
            <i class="bi bi-${project.icon || 'question-circle'}"></i>
          </div>
          <div>
            <h5 class="mb-1">${project.title || '未命名项目'}</h5>
            <p class="mb-0 text-muted small">${project.link || '#'}</p>
          </div>
        </div>
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-primary edit-project" data-id="${project.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger delete-project" data-id="${project.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
    
    projectsContainer.insertAdjacentHTML('beforeend', projectHtml);
  });
  
  // 添加编辑按钮事件
  document.querySelectorAll('.edit-project').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      editProject(id);
    });
  });
  
  // 添加删除按钮事件
  document.querySelectorAll('.delete-project').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      if (confirm('确定要删除这个项目吗？')) {
        deleteProject(id);
      }
    });
  });
}

// 显示项目表单
function showProjectForm(project = null) {
  projectEditCard.classList.remove('hidden');
  
  if (project) {
    projectId.value = project.id;
    projectTitle.value = project.title || '';
    projectIcon.value = project.icon || '';
    projectLink.value = project.link || '';
  } else {
    projectId.value = '';
    projectForm.reset();
  }
}

// 隐藏项目表单
function hideProjectForm() {
  projectEditCard.classList.add('hidden');
  projectForm.reset();
}

// 编辑项目
function editProject(id) {
  const project = siteData.projects.find(p => p.id === id);
  if (project) {
    showProjectForm(project);
  }
}

// 删除项目
function deleteProject(id) {
  siteData.projects = siteData.projects.filter(p => p.id !== id);
  renderProjects(siteData.projects);
  saveData();
}

// 保存项目
function saveProject() {
  const id = projectId.value;
  const title = projectTitle.value;
  const icon = projectIcon.value;
  const link = projectLink.value;
  
  if (id) {
    // 更新现有项目
    const index = siteData.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      siteData.projects[index] = { id, title, icon, link };
    }
  } else {
    // 添加新项目
    const newId = Date.now().toString();
    siteData.projects.push({ id: newId, title, icon, link });
  }
  
  renderProjects(siteData.projects);
  hideProjectForm();
  saveData();
}

// 保存个人资料
function saveProfile() {
  siteData.profile.name = profileName.value;
  siteData.profile.bio = profileBio.value;
  
  saveData();
  alert('个人资料已保存');
}

// 保存网站设置
function saveSettings() {
  if (!siteData.settings) {
    siteData.settings = {};
  }
  
  siteData.settings.siteTitle = siteTitle.value;
  siteData.settings.siteDescription = siteDescription.value;
  siteData.settings.theme = document.getElementById('site-theme').value || 'default';
  
  saveData();
  alert('网站设置已保存');
}

// 保存所有数据
async function saveData() {
  if (TEST_MODE) {
    console.log('保存的数据:', siteData);
    updateWebsite(siteData);
    return;
  }
  
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(siteData)
    });
    
    if (response.ok) {
      console.log('数据保存成功');
      updateWebsite(siteData);
    } else {
      alert('保存失败，请重试');
    }
  } catch (error) {
    console.error('保存数据错误:', error);
    alert('保存数据失败，请检查网络连接后重试');
  }
}

// 更新网站内容（预览更改）
function updateWebsite(data) {
  // 这个函数在测试模式下模拟更新网站
  // 在实际部署时，Worker会负责更新网站内容
  
  try {
    // 仅在同一窗口下的index.html存在时执行
    if (window.opener && !window.opener.closed) {
      // 更新父窗口的内容
      const parentDoc = window.opener.document;
      
      // 更新个人信息
      if (data.profile) {
        const nameEl = parentDoc.querySelector('.profile-name');
        const bioEl = parentDoc.querySelector('.profile-bio');
        
        if (nameEl) nameEl.textContent = data.profile.name;
        if (bioEl) bioEl.textContent = data.profile.bio;
        
        // 更新社交链接
        if (data.profile.socialLinks) {
          const socialLinksEl = parentDoc.querySelector('.social-links');
          if (socialLinksEl) {
            socialLinksEl.innerHTML = '';
            
            data.profile.socialLinks.forEach(link => {
              const linkEl = document.createElement('a');
              linkEl.href = link.url;
              linkEl.className = 'social-link';
              linkEl.title = link.platform;
              linkEl.innerHTML = `<i class="bi bi-${link.icon}"></i>`;
              socialLinksEl.appendChild(linkEl);
            });
          }
        }
      }
      
      // 更新项目
      if (data.projects) {
        const projectsEl = parentDoc.querySelector('.projects-section');
        if (projectsEl) {
          projectsEl.innerHTML = '';
          
          data.projects.forEach(project => {
            const projectEl = document.createElement('a');
            projectEl.href = project.link;
            projectEl.className = 'project-card';
            projectEl.innerHTML = `
              <div class="project-icon">
                <i class="bi bi-${project.icon}"></i>
              </div>
              <h2 class="project-title">${project.title}</h2>
            `;
            projectsEl.appendChild(projectEl);
          });
        }
      }
      
      // 更新网站标题和描述
      if (data.settings) {
        const titleEl = parentDoc.querySelector('title');
        const descEl = parentDoc.querySelector('meta[name="description"]');
        
        if (titleEl) titleEl.textContent = data.settings.siteTitle;
        if (descEl) descEl.setAttribute('content', data.settings.siteDescription);
      }
    }
  } catch (error) {
    console.log('预览更新功能仅在开发模式可用');
  }
} 