// 用户数据（实际项目中应从后端获取）
const USER_DATA = {
  username: 'abc',
  password: '123456',
  balance: 1000  // 初始余额
};

// 初始化：检查用户是否已登录
function initAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  updateLoginStatus(user);
}

// 登录处理
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === USER_DATA.username && password === USER_DATA.password) {
    // 登录成功
    localStorage.setItem('currentUser', JSON.stringify({
      username: username,
      balance: USER_DATA.balance
    }));
    
    document.getElementById('login-message').textContent = '登录成功，正在跳转...';
    document.getElementById('login-message').style.color = 'green';
    
    // 2秒后跳转到首页
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } else {
    // 登录失败
    document.getElementById('login-message').textContent = '用户名或密码错误';
  }
});

// 更新页面上的登录状态
function updateLoginStatus(user) {
  const loginStatus = document.getElementById('login-status');
  if (loginStatus) {
    if (user) {
      loginStatus.innerHTML = `
        <span>已登录：${user.username}</span>
        <button onclick="logout()">退出登录</button>
      `;
    } else {
      loginStatus.innerHTML = `
        <span>未登录</span>
        <button onclick="goToLogin()">登录</button>
      `;
    }
  }
}

// 退出登录
function logout() {
  localStorage.removeItem('currentUser');
  updateLoginStatus(null);
  window.location.href = 'index.html';
}

// 跳转到登录页
function goToLogin() {
  window.location.href = 'login.html';
}

// 检查是否登录，如果未登录则跳转到登录页
function checkLogin() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    alert('请先登录');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// 获取当前用户余额
function getCurrentBalance() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user ? user.balance : 0;
}

// 更新用户余额
function updateBalance(amount) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    user.balance -= amount;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user.balance;
  }
  return 0;
}

// 页面加载时初始化认证状态
window.addEventListener('load', initAuth);

// ...原有代码...

// 修改：添加交易记录
function recordTransaction(type, amount) {
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  transactions.unshift({
    type,
    amount,
    date: new Date().toLocaleString()
  });
  
  // 只保留最近10条记录
  if (transactions.length > 10) {
    transactions = transactions.slice(0, 10);
  }
  
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 更新用户余额并记录交易
function updateBalance(amount) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return 0;
  
  const oldBalance = user.balance;
  user.balance -= parseFloat(amount);
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // 记录交易
  recordTransaction('购物消费', amount);
  
  return user.balance;
}