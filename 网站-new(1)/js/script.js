// 数据持久化：从localStorage读取，无则初始化
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let favoriteItems = JSON.parse(localStorage.getItem('favoriteItems')) || [];
const WALLET_BALANCE = 1000; // 固定钱包余额

// 通用函数：返回首页
function goToIndex() {
  window.location.href = 'index.html';
}

// ========== 商品详情页逻辑 ==========
// 加入购物车
function addToCart(name, price, category) {
  const existing = cartItems.find(item => item.name === name && item.category === category);
  if (existing) {
    existing.quantity++;
  } else {
    cartItems.push({ name, price, category, quantity: 1, checked: true });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  alert('已加入购物车！');
}

// 加入收藏夹
function addToFavorite(name, price, category) {
  const existing = favoriteItems.find(item => item.name === name && item.category === category);
  if (existing) {
    alert('该商品已在收藏夹中');
  } else {
    favoriteItems.push({ name, price, category });
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    alert('已加入收藏夹！');
  }
}

// 立即购买
function buyNow(price) {
  window.location.href = `payment.html?price=${price.toFixed(2)}`;
}

// ========== 购物车页逻辑 ==========
window.onload = function() {
  if (window.location.href.includes('cart.html')) {
    renderCart();
    setupManageButton();
  } else if (window.location.href.includes('favorites.html')) {
    renderFavorites();
  } else if (window.location.href.includes('payment.html')) {
    renderPayment();
  }
};

// 渲染购物车（按分类显示）
function renderCart() {
  const cartContent = document.getElementById('cart-content');
  cartContent.innerHTML = '';

  // 按分类分组
  const categories = {};
  cartItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // 渲染每个分类
  for (const category in categories) {
    const categoryItems = categories[category];
    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'category-group';
    
    // 分类头部（含分类名称和分类总价）
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.innerHTML = `
      <input type="checkbox" class="category-checkbox" data-category="${category}" onclick="toggleCategory('${category}')">
      <span class="category-name">${category}</span>
      <span class="category-total">分类总价: ¥<span id="category-total-${category}">0.00</span></span>
    `;
    categoryGroup.appendChild(categoryHeader);

    // 分类商品表格
    const table = document.createElement('table');
    table.className = 'cart-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>选择</th>
          <th>商品</th>
          <th>价格</th>
          <th>数量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="category-body-${category}">
        <!-- 商品行通过 JS 动态添加 -->
      </tbody>
    `;
    categoryGroup.appendChild(table);

    // 渲染分类下的商品
    const categoryBody = table.querySelector(`tbody`);
    categoryItems.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <input 
            type="checkbox" 
            class="item-checkbox" 
            data-category="${category}"
            data-index="${index}"
            ${item.checked ? 'checked' : ''} 
            onchange="updateTotal()"
          >
        </td>
        <td>${item.name}</td>
        <td>¥${item.price.toFixed(2)}</td>
        <td>
          <input 
            type="number" 
            class="quantity-input" 
            value="${item.quantity}" 
            onchange="updateQuantity(${index}, '${category}', this)"
          >
        </td>
        <td>
          <button class="remove-btn" onclick="removeItem(${index}, '${category}')">删除</button>
        </td>
      `;
      categoryBody.appendChild(row);
    });

    cartContent.appendChild(categoryGroup);
  }

  // 更新分类总价和购物车总价
  updateCategoryTotals();
  updateTotal();
}

// 更新商品数量
function updateQuantity(index, category, input) {
  const categoryItems = cartItems.filter(item => item.category === category);
  const newQuantity = parseInt(input.value);
  
  if (newQuantity <= 0) {
    // 数量 ≤0 则移除商品
    const itemIndex = cartItems.findIndex(item => 
      item.name === categoryItems[index].name && 
      item.category === category
    );
    cartItems.splice(itemIndex, 1);
  } else {
    // 更新数量
    categoryItems[index].quantity = newQuantity;
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
}

// 删除单个商品
function removeItem(index, category) {
  const categoryItems = cartItems.filter(item => item.category === category);
  const itemIndex = cartItems.findIndex(item => 
    item.name === categoryItems[index].name && 
    item.category === category
  );
  
  cartItems.splice(itemIndex, 1);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
}

// 切换分类全选状态
function toggleCategory(category) {
  const categoryCheckbox = document.querySelector(`.category-checkbox[data-category="${category}"]`);
  const isChecked = categoryCheckbox.checked;
  
  // 更新该分类下所有商品的勾选状态
  document.querySelectorAll(`.item-checkbox[data-category="${category}"]`).forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  
  // 更新该分类下所有商品对象的勾选状态
  cartItems.forEach(item => {
    if (item.category === category) {
      item.checked = isChecked;
    }
  });
  
  updateTotal();
  updateCategoryTotals();
}

// 全选/反选
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById('select-all');
  const isChecked = selectAllCheckbox.checked;
  
  // 更新所有分类勾选状态
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  
  // 更新所有商品勾选状态
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  
  // 更新所有商品对象的勾选状态
  cartItems.forEach(item => {
    item.checked = isChecked;
  });
  
  updateTotal();
  updateCategoryTotals();
}

// 更新分类总价
function updateCategoryTotals() {
  const categories = {};
  
  // 计算每个分类的总价
  cartItems.forEach(item => {
    if (item.checked) {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.price * item.quantity;
    }
  });
  
  // 更新 DOM 显示
  for (const category in categories) {
    const totalElement = document.getElementById(`category-total-${category}`);
    if (totalElement) {
      totalElement.textContent = categories[category].toFixed(2);
    }
  }
}

// 更新购物车总价格
function updateTotal() {
  let total = 0;
  
  cartItems.forEach(item => {
    if (item.checked) {
      total += item.price * item.quantity;
    }
  });
  
  document.getElementById('total-price').textContent = total.toFixed(2);
  updateCategoryTotals();
}

// 结算功能
function checkout() {
  // 检查登录状态
  if (!checkLogin()) return;
  
  // 计算勾选商品的总价
  let total = 0;
  cartItems.forEach(item => {
    if (item.checked) {
      total += item.price * item.quantity;
    }
  });
  
  // 跳转到支付页，传递总价
  window.location.href = `payment.html?price=${total.toFixed(2)}`;
}
// 设置管理按钮逻辑
function setupManageButton() {
  const manageBtn = document.getElementById('manage-btn');
  let isManaging = false;
  
  manageBtn.onclick = function() {
    isManaging = !isManaging;
    manageBtn.textContent = isManaging ? '完成' : '管理';
    
    // 显示/隐藏删除按钮
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.style.display = isManaging ? 'inline-block' : 'none';
    });
  };
}

// ========== 收藏夹页逻辑 ==========
// 渲染收藏夹（按分类显示）
function renderFavorites() {
  const favoritesContent = document.getElementById('favorites-content');
  favoritesContent.innerHTML = '';

  // 按分类分组
  const categories = {};
  favoriteItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // 渲染每个分类
  for (const category in categories) {
    const categoryItems = categories[category];
    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'favorites-category';
    
    // 分类头部
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'favorites-category-header';
    categoryHeader.textContent = category;
    categoryGroup.appendChild(categoryHeader);

    // 分类商品表格
    const table = document.createElement('table');
    table.className = 'favorites-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>商品</th>
          <th>价格</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${categoryItems.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>¥${item.price.toFixed(2)}</td>
            <td>
              <button onclick="removeFavoriteItem('${item.name}', '${category}')">移除</button>
              <button onclick="addToCart('${item.name}', ${item.price}, '${category}')">加入购物车</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    categoryGroup.appendChild(table);

    favoritesContent.appendChild(categoryGroup);
  }
}

// 从收藏夹移除商品
function removeFavoriteItem(name, category) {
  const itemIndex = favoriteItems.findIndex(
    item => item.name === name && item.category === category
  );
  
  if (itemIndex !== -1) {
    favoriteItems.splice(itemIndex, 1);
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    renderFavorites();
  }
}

// ========== 支付页逻辑 ==========
// 渲染支付页
function renderPayment() {
  // 检查登录状态
  if (!checkLogin()) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const price = parseFloat(urlParams.get('price'));
  
  if (isNaN(price)) {
    alert('支付金额无效');
    goToIndex();
    return;
  }
  
  document.getElementById('payment-amount').textContent = price.toFixed(2);
  
  // 从localStorage获取用户余额
  const balance = getCurrentBalance();
  document.getElementById('wallet-balance').textContent = balance.toFixed(2);
}

// 确认支付
function checkoutPayment() {
  // 检查登录状态
  if (!checkLogin()) return;
  
  const paymentAmount = parseFloat(document.getElementById('payment-amount').textContent);
  const balance = getCurrentBalance();
  
  if (paymentAmount <= 0) {
    alert('支付金额无效');
    return;
  }
  
  if (paymentAmount > balance) {
    alert('余额不足，支付失败！');
    return;
  }
  
  // 更新余额并记录交易
  const newBalance = updateBalance(paymentAmount);
  
  // 显示支付成功消息
  const message = `
    支付成功！
    支付金额：¥${paymentAmount.toFixed(2)}
    原余额：¥${balance.toFixed(2)}
    新余额：¥${newBalance.toFixed(2)}
  `;
  alert(message);
  
  // 支付成功后清空购物车中已勾选的商品
  if (document.referrer.includes('cart.html')) {
    cartItems = cartItems.filter(item => !item.checked);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
  
  // 跳转到余额页面
  window.location.href = 'balance.html';
}