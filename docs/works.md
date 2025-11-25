<style>
/* 强制重置容器样式，防止被 docsify 样式覆盖 */
.custom-gallery-wrapper {
  width: 100%;
  margin: 2rem auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.custom-gallery-wrapper * {
  box-sizing: border-box;
}

.gallery-container {
  max-width: 1000px; /*稍微调小一点以适应文档流*/
  margin: 0 auto;
  text-align: center;
  position: relative;
}

/* 主图区域 */
.main-image-container {
  position: relative;
  margin-bottom: 20px;
  background: rgba(0,0,0,0.02); /* 添加轻微背景以便在图片加载前占位 */
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.main-image {
  max-width: 100%;
  max-height: 65vh; /* 稍微减小高度以免在小屏占满 */
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s ease;
  display: block; /* 修复 Docsify 图片可能的 inline 属性 */
  margin: 0 auto;
}

.image-title {
  margin-top: 15px;
  font-size: 18px;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  display: inline-block;
}

/* 导航按钮 - 增加 !important 覆盖 docsify 默认样式 */
.gallery-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0,0,0,0.1) !important;
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  font-size: 24px !important;
  line-height: 1 !important;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100; /* 确保在最上层 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333 !important;
  outline: none;
  padding: 0 !important;
  margin: 0 !important;
}

.gallery-nav-button:hover {
  background: white !important;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.gallery-nav-button.prev { left: 10px; }
.gallery-nav-button.next { right: 10px; }

/* 缩略图区域 */
.thumbnail-scroll-area {
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
  /* 隐藏滚动条但保留功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE */
}
.thumbnail-scroll-area::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.thumbnail-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  min-width: min-content; /* 确保内容撑开 */
  padding: 0 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  flex-shrink: 0; /* 防止缩略图被压缩 */
}

.thumbnail:hover { opacity: 0.9; }

.thumbnail.active {
  border-color: #42b983; /* Docsify 绿色风格 */
  opacity: 1;
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gallery-nav-button {
    width: 40px !important;
    height: 40px !important;
    font-size: 20px !important;
  }
  .thumbnail {
    width: 60px;
    height: 60px;
  }
}
</style>

<div class="custom-gallery-wrapper">
  <div class="main-image-container">
    <button class="gallery-nav-button prev" onclick="window.galleryPrev()">&#8249;</button>
    <img id="mainImage" class="main-image" src="figs/artworks/b496380d49a63fcf3e8a6df65988fd1f.jpg" alt="立姿展翅1"/>
    <button class="gallery-nav-button next" onclick="window.galleryNext()">&#8250;</button>
    <div id="imageTitle" class="image-title">立姿展翅1</div>
  </div>
  
  <div class="thumbnail-scroll-area">
    <div class="thumbnail-container">
      <img class="thumbnail active" src="figs/artworks/b496380d49a63fcf3e8a6df65988fd1f.jpg" onclick="window.galleryShow(0)"/>
      <img class="thumbnail" src="figs/artworks/6FC7E738-0AC9-45B9-BC0F-7D8EDDD2CB4F_1_105_c.jpeg" onclick="window.galleryShow(1)"/>
      <img class="thumbnail" src="figs/artworks/EB4A3E87-0A18-4392-AE7A-5CC1A134A662_1_105_c.jpeg" onclick="window.galleryShow(2)"/>
      <img class="thumbnail" src="figs/artworks/微信图片_20251125212941_37_331.jpg" onclick="window.galleryShow(3)"/>
      <img class="thumbnail" src="figs/artworks/微信图片_20251125212942_38_331.jpg" onclick="window.galleryShow(4)"/>
    </div>
  </div>
</div>

<script>
// 使用立即执行函数包裹配置，但将功能函数挂载到 window
(function() {
  var images = [
    { src: 'figs/artworks/b496380d49a63fcf3e8a6df65988fd1f.jpg', title: '立姿展翅1' },
    { src: 'figs/artworks/6FC7E738-0AC9-45B9-BC0F-7D8EDDD2CB4F_1_105_c.jpeg', title: '顿感' },
    { src: 'figs/artworks/EB4A3E87-0A18-4392-AE7A-5CC1A134A662_1_105_c.jpeg', title: '后花园' },
    { src: 'figs/artworks/微信图片_20251125212941_37_331.jpg', title: '机械蝴蝶' },
    { src: 'figs/artworks/微信图片_20251125212942_38_331.jpg', title: '玫瑰青凤蝶？' }
  ];

  var currentIndex = 0;

  // 挂载到 window 对象，这样 HTML 里的 onclick 才能找到它们
  window.galleryShow = function(index) {
    currentIndex = index;
    var mainImage = document.getElementById('mainImage');
    var imageTitle = document.getElementById('imageTitle');
    var thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && images[index]) {
      // 简单的淡入淡出效果
      mainImage.style.opacity = '0.5';
      setTimeout(function() {
        mainImage.src = images[index].src;
        mainImage.alt = images[index].title;
        imageTitle.textContent = images[index].title;
        mainImage.style.opacity = '1';
      }, 150);
      
      // 更新缩略图状态
      thumbnails.forEach(function(thumb, i) {
        if (i === index) thumb.classList.add('active');
        else thumb.classList.remove('active');
      });
    }
  };

  window.galleryPrev = function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    window.galleryShow(currentIndex);
  };

  window.galleryNext = function() {
    currentIndex = (currentIndex + 1) % images.length;
    window.galleryShow(currentIndex);
  };

  // 键盘事件 - 仅当画廊在视口中时或简单绑定
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') window.galleryPrev();
    if (e.key === 'ArrowRight') window.galleryNext();
  });

})();
</script>

<center style="margin-top: 50px; color: #888; font-size: 12pt;">
  © 2025 Shengqi Dang. All rights reserved.<br/>
  版权所有 © 2025 党圣奇
</center>