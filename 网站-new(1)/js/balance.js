// 初始化余额页面
window.onload = function() {
  // 检查登录状态
  if (!checkLogin()) return;
  
  // 显示当前余额
  const balance = getCurrentBalance();
  document.getElementById('current-balance').textContent = balance.toFixed(2);
  
  // 显示交易记录
  renderTransactionHistory();
};

// 充值功能
function recharge() {
  const amount = parseFloat(prompt('请输入充值金额：'));
  
  if (isNaN(amount) || amount <= 0) {
    alert('请输入有效的充值金额');
    return;
  }
  
  // 更新余额
  const user = JSON.parse(localStorage.getItem('currentUser'));
  user.balance += amount;
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // 添加交易记录
  addTransaction('充值', amount);
  
  // 更新显示
  document.getElementById('current-balance').textContent = user.balance.toFixed(2);
  renderTransactionHistory();
  
  alert(`充值成功！当前余额：¥${user.balance.toFixed(2)}`);
}

// 添加交易记录
function addTransaction(type, amount) {
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

// 渲染交易记录
function renderTransactionHistory() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const historyContainer = document.getElementById('transaction-history');
  
  if (transactions.length === 0) {
    historyContainer.innerHTML = '<p>暂无交易记录</p>';
    return;
  }
  
  historyContainer.innerHTML = '';
  transactions.forEach(tx => {
    const txItem = document.createElement('div');
    txItem.className = 'transaction-item';
    txItem.innerHTML = `
      <div>
        <div>${tx.type}</div>
        <div class="transaction-date">${tx.date}</div>
      </div>
      <div class="transaction-amount ${tx.type === '充值' ? 'income' : 'expense'}">
        ${tx.type === '充值' ? '+' : '-'}¥${tx.amount.toFixed(2)}
      </div>
    `;
    historyContainer.appendChild(txItem);
  });
}