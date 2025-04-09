/**
 * 猫咪主页 - Cloudflare Worker API
 * 
 * 这个Worker处理后台管理API请求，包括身份验证和数据存储
 * 部署前请创建KV命名空间并绑定到Worker
 */

// 环境变量
const ADMIN_USERNAME = 'admin';  // 将此更改为您的用户名
const ADMIN_PASSWORD_HASH = '5f4dcc3b5aa765d61d8327deb882cf99';  // 'password'的MD5哈希，请更改为安全密码
const JWT_SECRET = 'your-secret-key';  // 更改为随机字符串
const CORS_ORIGINS = ['https://jeffrey-done.github.io', 'http://localhost:3000'];  // 允许的源
const TEMP_TOKEN = 'temporary_token_for_frontend';  // 用于前端访问数据的临时令牌

// KV 命名空间绑定
// 部署时在Cloudflare Workers界面中设置
// const CATPAGE = CATPAGE;  // 取消注释并确保在Cloudflare中绑定了KV命名空间

// 路由处理
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return handleCORS(request);
  }

  // 添加CORS头到所有响应
  const responseInit = {
    headers: getCORSHeaders(request)
  };

  // API路由
  if (path.startsWith('/auth/login')) {
    return handleLogin(request, responseInit);
  } else if (path.startsWith('/auth/verify')) {
    return handleVerify(request, responseInit);
  } else if (path === '/data') {
    if (request.method === 'GET') {
      return handleGetData(request, responseInit);
    } else if (request.method === 'POST') {
      return handleSaveData(request, responseInit);
    }
  }

  // 未找到的路由返回404
  return new Response('Not Found', { 
    status: 404, 
    headers: responseInit.headers 
  });
}

// 处理登录请求
async function handleLogin(request, responseInit) {
  try {
    // 解析请求数据
    const { username, password } = await request.json();
    
    // 验证用户名和密码（此处使用简单示例方式，生产环境应使用更安全的方法）
    // password哈希是MD5，生产环境应使用更安全的哈希算法
    if (username === ADMIN_USERNAME && md5(password) === ADMIN_PASSWORD_HASH) {
      // 生成JWT token
      const token = generateJWT({ username });
      
      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: '用户名或密码错误' }), {
        status: 401,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '登录失败', error: error.message }), {
      status: 500,
      headers: {
        ...responseInit.headers,
        'Content-Type': 'application/json'
      }
    });
  }
}

// 验证Token
async function handleVerify(request, responseInit) {
  try {
    // 验证Token
    const token = getTokenFromRequest(request);
    if (!token) {
      return new Response(JSON.stringify({ verified: false }), {
        status: 401,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    }

    // 验证JWT签名
    try {
      const payload = verifyJWT(token);
      return new Response(JSON.stringify({ verified: true, username: payload.username }), {
        status: 200,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ verified: false, message: 'Token无效' }), {
        status: 401,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ verified: false, message: '验证失败', error: error.message }), {
      status: 500,
      headers: {
        ...responseInit.headers,
        'Content-Type': 'application/json'
      }
    });
  }
}

// 获取网站数据
async function handleGetData(request, responseInit) {
  try {
    const token = getTokenFromRequest(request);
    
    // 检查是否是临时令牌（用于前端访问）或有效的管理员令牌
    const isTempToken = token === TEMP_TOKEN;
    const isAdmin = token && token !== TEMP_TOKEN ? await isAuthenticated(request) : false;
    
    // 如果既不是临时令牌也不是管理员令牌，则拒绝访问
    if (!isTempToken && !isAdmin) {
      return new Response(JSON.stringify({ success: false, message: '未授权' }), {
        status: 401,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    }

    // 从KV获取数据
    let data = await CATPAGE.get('siteData', { type: 'json' });
    
    // 如果数据不存在，返回默认数据
    if (!data) {
      data = getDefaultData();
    }
    
    // 设置缓存控制头以确保前端始终获取最新数据
    const headers = {
      ...responseInit.headers,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '获取数据失败', error: error.message }), {
      status: 500,
      headers: {
        ...responseInit.headers,
        'Content-Type': 'application/json'
      }
    });
  }
}

// 保存网站数据
async function handleSaveData(request, responseInit) {
  try {
    // 验证Token - 只有管理员才能保存数据
    if (!await isAuthenticated(request)) {
      return new Response(JSON.stringify({ success: false, message: '未授权' }), {
        status: 401,
        headers: {
          ...responseInit.headers,
          'Content-Type': 'application/json'
        }
      });
    }

    // 解析请求数据
    const data = await request.json();
    
    // 保存到KV
    await CATPAGE.put('siteData', JSON.stringify(data));
    
    return new Response(JSON.stringify({ success: true, message: '数据保存成功' }), {
      status: 200,
      headers: {
        ...responseInit.headers,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '保存数据失败', error: error.message }), {
      status: 500,
      headers: {
        ...responseInit.headers,
        'Content-Type': 'application/json'
      }
    });
  }
}

// 验证身份
async function isAuthenticated(request) {
  const token = getTokenFromRequest(request);
  if (!token || token === TEMP_TOKEN) return false;
  
  try {
    verifyJWT(token);
    return true;
  } catch (err) {
    return false;
  }
}

// 从请求中获取Token
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

// 生成JWT
function generateJWT(payload) {
  // 简化版JWT，仅作演示
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 24 * 60 * 60; // 24小时
  
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };
  
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(tokenPayload));
  const signature = md5(base64Header + '.' + base64Payload + JWT_SECRET);
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

// 验证JWT
function verifyJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token格式无效');
  }
  
  const [base64Header, base64Payload, signature] = parts;
  const expectedSignature = md5(base64Header + '.' + base64Payload + JWT_SECRET);
  
  if (signature !== expectedSignature) {
    throw new Error('Token签名无效');
  }
  
  const payload = JSON.parse(atob(base64Payload));
  const now = Math.floor(Date.now() / 1000);
  
  if (payload.exp < now) {
    throw new Error('Token已过期');
  }
  
  return payload;
}

// 简单的MD5哈希实现（仅作演示，实际应使用更安全的方法）
function md5(string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  return crypto.subtle.digest('MD5', data)
    .then(hash => {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
}

// 获取默认网站数据
function getDefaultData() {
  return {
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
      siteDescription: '一个超可爱的猫咪风格个人导航页面，带有精美的动画效果和响应式设计。'
    }
  };
}

// 处理CORS预检请求
function handleCORS(request) {
  const headers = getCORSHeaders(request);
  return new Response(null, { status: 204, headers });
}

// 获取CORS响应头
function getCORSHeaders(request) {
  const origin = request.headers.get('Origin');
  
  // 基础 CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400' // 24小时缓存预检响应
  };
  
  // 检查请求来源是否在允许的列表中
  if (CORS_ORIGINS.includes(origin) || origin.endsWith('.github.io')) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  } else {
    // 如果源不在允许列表中，默认使用第一个允许的源
    // 这样可以防止CORS问题，但应该根据实际情况调整
    corsHeaders['Access-Control-Allow-Origin'] = CORS_ORIGINS[0];
  }
  
  return corsHeaders;
}

// 监听请求
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
}); 