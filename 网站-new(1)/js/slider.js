// slider.js - 轮播图组件

document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const bannerContainer = document.getElementById('banner-container');
  const bannerItems = document.querySelectorAll('.banner-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  // 配置参数
  const slideCount = bannerItems.length;
  const slideInterval = 5000; // 5秒切换一次
  let currentIndex = 0;
  let autoPlayTimer;
  
  // 初始化轮播图
  function initSlider() {
    // 设置初始位置
    updateSliderPosition();
    
    // 绑定按钮事件
    prevBtn.addEventListener('click', goToPrevSlide);
    nextBtn.addEventListener('click', goToNextSlide);
    
    // 添加鼠标悬停暂停功能
    bannerContainer.addEventListener('mouseenter', pauseAutoPlay);
    bannerContainer.addEventListener('mouseleave', startAutoPlay);
    
    // 开始自动轮播
    startAutoPlay();
  }
  
  // 更新轮播图位置
  function updateSliderPosition() {
    // 计算偏移量百分比
    const offset = -currentIndex * (100 / slideCount);
    // 应用变换
    bannerContainer.style.transform = `translateX(${offset}%)`;
  }
  
  // 前往下一张幻灯片
  function goToNextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSliderPosition();
    resetAutoPlayTimer();
  }
  
  // 前往上一张幻灯片
  function goToPrevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSliderPosition();
    resetAutoPlayTimer();
  }
  
  // 开始自动轮播
  function startAutoPlay() {
    autoPlayTimer = setInterval(goToNextSlide, slideInterval);
  }
  
  // 暂停自动轮播
  function pauseAutoPlay() {
    clearInterval(autoPlayTimer);
  }
  
  // 重置自动轮播计时器
  function resetAutoPlayTimer() {
    pauseAutoPlay();
    startAutoPlay();
  }
  
  // 初始化轮播图
  initSlider();
});