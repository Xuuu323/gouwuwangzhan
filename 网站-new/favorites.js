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