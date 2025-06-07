// 模拟钱包余额（固定为1000）
const WALLET_BALANCE = 1000;

// 页面加载时初始化
window.onload = function () {
  // 从 URL 参数获取支付金额
  const urlParams = new URLSearchParams(window.location.search);
  const price = urlParams.get('price');
  
  // 显示价格
  const totalPriceElement = document.getElementById('total-price');
  totalPriceElement.textContent = `价格：¥${price}`;

  // 显示钱包余额
  const balanceElement = document.getElementById('wallet-balance');
  balanceElement.textContent = WALLET_BALANCE;
};

// 结算功能
// 新增：立即购买功能（商品详情页）
function buyNow(price) {
  // 直接跳转到支付页，传递商品价格
  window.location.href = `payment.html?price=${price.toFixed(2)}`;
}

// 修改：结算功能（购物车页）
function checkout() {
  // 计算已勾选商品的总价
  let total = 0;
  cartItems.forEach(item => {
    if (item.checked) {
      total += item.price * item.quantity;
    }
  });
}
// 返回首页（示例：可替换为实际首页地址）
function goToIndex() {
  window.location.href = 'index.html';
}