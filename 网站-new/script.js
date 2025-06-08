// 存储购物车数据，从localStorage读取，若无则初始化为空数组
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// 商品详情页 - 加入购物车函数
function addToCart(productName, price, category) {
  const existingItem = cartItems.find(item => item.name === productName && item.category === category);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      name: productName,
      price: price,
      quantity: 1,
      category: category,
      checked: true
    });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  alert('商品已加入购物车！');
}

// 页面加载时，若为购物车页则渲染商品
window.onload = function () {
  if (window.location.href.includes('cart.html')) {
    renderCartItems();
    setupManageButton();
  }
};

// 按分类渲染购物车商品
function renderCartItems() {
  const cartContent = document.getElementById('cart-content');
  cartContent.innerHTML = '';

  // 按分类分组，遍历分类渲染商品
  const categoryMap = {};
  cartItems.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = [];
    }
    categoryMap[item.category].push(item);
  });

  for (const category in categoryMap) {
    const categoryItems = categoryMap[category];
    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'category-group';

    // 分类头部，包含分类复选框、名称、分类总价
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
      </tbody>
    `;
    categoryGroup.appendChild(table);

    // 渲染分类下的商品行
    const categoryBody = table.querySelector('tbody');
    categoryItems.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <input 
            type="checkbox" 
            class="item-checkbox" 
            data-category="${category}"
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
    const itemIndex = cartItems.findIndex(item => 
      item.name === categoryItems[index].name && 
      item.category === category
    );
    cartItems.splice(itemIndex, 1);
  } else {
    categoryItems[index].quantity = newQuantity;
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCartItems();
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
  renderCartItems();
}

// 切换分类全选状态
function toggleCategory(category) {
  const categoryCheckbox = document.querySelector(`.category-checkbox[data-category="${category}"]`);
  const isChecked = categoryCheckbox.checked;
  document.querySelectorAll(`.item-checkbox[data-category="${category}"]`).forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  cartItems.forEach(item => {
    if (item.category === category) {
      item.checked = isChecked;
    }
  });
  updateTotal();
  updateCategoryTotals();
}

// 全选/反选功能
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById('select-all');
  const isChecked = selectAllCheckbox.checked;
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  cartItems.forEach(item => {
    item.checked = isChecked;
  });
  updateTotal();
  updateCategoryTotals();
}

// 更新分类总价
function updateCategoryTotals() {
  const categoryTotals = {};
  cartItems.forEach(item => {
    if (item.checked) {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += item.price * item.quantity;
    }
  });
  for (const category in categoryTotals) {
    const totalElement = document.getElementById(`category-total-${category}`);
    if (totalElement) {
      totalElement.textContent = categoryTotals[category].toFixed(2);
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
  const total = document.getElementById('total-price').textContent;
  alert(`结算成功！总价格：¥${total}`);
  cartItems = cartItems.filter(item => !item.checked);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCartItems();
}

// 返回首页
function goToIndex() {
  window.location.href = 'index.html';
}

// 设置管理按钮逻辑，控制删除按钮显示/隐藏
function setupManageButton() {
  const manageBtn = document.getElementById('manage-btn');
  let isManaging = false;
  manageBtn.onclick = function () {
    isManaging = !isManaging;
    manageBtn.textContent = isManaging ? '完成' : '管理';
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.style.display = isManaging ? 'inline-block' : 'none';
    });
  };
}
// 跳转到首页（示例：可替换为实际首页地址）
function goToIndex() {
  window.location.href = "index.html"; 
}

// 商品详情页：加入收藏夹逻辑
function addToFavorite() {
  // 获取商品名称和价格（价格可从页面元素或固定值读取，这里写死示例）
  const productName = document.querySelector('.product-name').textContent;
  const productPrice = document.querySelector('.product-price').textContent;

  // 从本地存储读取已收藏数据
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // 检查是否已收藏，避免重复添加
  const isExisted = favorites.some(item => item.name === productName);
  if (isExisted) {
    alert('该商品已在收藏夹中');
    return;
  }

  // 添加新商品到收藏列表
  favorites.push({ 
    name: productName, 
    price: productPrice 
  });

  // 重新存入本地存储
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('已加入收藏夹');
}

// 收藏夹页：页面加载时渲染收藏列表
window.onload = function () {
  if (window.location.href.includes('favorites.html')) {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // 遍历收藏数据，渲染到页面
    favorites.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'favorite-item';
      itemDiv.innerHTML = `
        <span>${item.name}</span>
        <span>${item.price}</span>
        <button onclick="removeFromFavorite(${index})">移除收藏夹</button>
      `;
      favoritesList.appendChild(itemDiv);
    });
  }
};

// 收藏夹页：移除收藏逻辑
function removeFromFavorite(index) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  // 删除对应索引的商品
  favorites.splice(index, 1); 
  // 重新存入本地存储
  localStorage.setItem('favorites', JSON.stringify(favorites)); 
  // 刷新页面（或重新渲染列表，这里简单刷新）
  window.location.reload(); 
}
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