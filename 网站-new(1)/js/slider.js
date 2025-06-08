let currentIndex = 0;
const bannerItems = document.querySelectorAll('.banner-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const autoPlayInterval = 3000; // 3秒切换一次

// 初始化轮播
function initSlider() {
  bannerItems.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 自动轮播
  setInterval(showNextItem, autoPlayInterval);

  // 左右切换按钮
  prevBtn.addEventListener('click', showPrevItem);
  nextBtn.addEventListener('click', showNextItem);
}

// 显示下一个商品
function showNextItem() {
  currentIndex = (currentIndex + 1) % bannerItems.length;
  updateActiveItem();
}

// 显示上一个商品
function showPrevItem() {
  currentIndex = (currentIndex - 1 + bannerItems.length) % bannerItems.length;
  updateActiveItem();
}

// 更新激活状态
function updateActiveItem() {
  bannerItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentIndex);
  });
}

// 页面加载后初始化
window.addEventListener('DOMContentLoaded', initSlider);