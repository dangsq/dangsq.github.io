<style>
/* --- 画廊定制样式：融入 Doudou / Dream Pop Aesthetic --- */

/* 容器和重置 */
.doudou-gallery-wrapper {
  width: 100%;
  margin: 3rem auto;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
}

.gallery-container {
  max-width: 900px; 
  margin: 0 auto;
  text-align: center;
  position: relative;
  padding: 0; 
  border-radius: 0;
  box-shadow: none;
}

/* 主图容器 */
.main-image-container {
  position: relative;
  margin-bottom: 25px;
  padding: 30px 15px 15px 15px;
  height: 600px;
  background: color(var(--glass-bg) alpha(0.0));
  backdrop-filter: var(--blur-amount);
  -webkit-backdrop-filter: var(--blur-amount);
  border: var(--glass-border);
  border-radius: 25px;
  box-shadow: var(--doudou-shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: all 0.5s ease;
  overflow: hidden; /* 防止放大时溢出 */
}

/* --- 核心修改：主图样式 --- */
.main-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 18px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  display: block;
  margin: 0 auto;
  
  /* 初始状态：完全显示 */
  opacity: 1;
  transform: scale(1);
  filter: blur(0px); /* 清晰 */
  
  /* 
     修改点：使用 ease-in-out 让开始和结束都变慢，更柔和。
     时间统一设定为 0.6s 
  */
  transition: opacity 0.6s ease-in-out, 
              transform 0.6s ease-in-out, 
              filter 0.6s ease-in-out;
}

/* --- 新增：图片隐藏状态（淡出+模糊+微缩） --- */
.main-image.image-hidden {
  opacity: 0;
  transform: scale(0.96); /* 稍微缩小一点点，增加呼吸感 */
  filter: blur(10px);     /* 梦幻模糊效果 */
}

.image-title {
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 400;
  font-family: 'Cormorant Garamond', serif;
  color: var(--text-main);
  background: var(--doudou-cream);
  padding: 8px 24px;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-block;
  
  /* 标题也跟随渐变 */
  opacity: 1;
  transition: opacity 0.6s ease-in-out;
}

.image-title.title-hidden {
  opacity: 0;
}

/* 导航按钮 */
.gallery-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--doudou-cream) !important;
  border: none !important;
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  font-size: 26px !important;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  color: var(--text-accent) !important;
  outline: none;
  opacity: 0.9;
}

.gallery-nav-button:hover {
  background: white !important;
  transform: translateY(-50%) scale(1.2); 
  box-shadow: 0 6px 20px rgba(123, 108, 150, 0.3);
  color: var(--link-color) !important;
  opacity: 1;
}

.gallery-nav-button.prev { left: 15px; }
.gallery-nav-button.next { right: 15px; }

/* 缩略图区域 */
.thumbnail-scroll-area {
  width: 100%;
  overflow-x: auto;
  padding: 15px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.thumbnail-scroll-area::-webkit-scrollbar { display: none; }

.thumbnail-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  min-width: min-content;
  padding: 0 20px;
}

.thumbnail {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  border: 3px solid transparent;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.thumbnail:hover { 
  opacity: 0.9; 
  transform: scale(1.1); 
}

.thumbnail.active {
  border-color: var(--dream-pink); 
  opacity: 1;
  transform: scale(1.15); 
  box-shadow: 0 5px 15px rgba(251, 194, 235, 0.5); 
}

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

<div class="doudou-gallery-wrapper">
  <div class="gallery-container">
    <div class="main-image-container">
      <button class="gallery-nav-button prev" onclick="window.galleryPrev()">&#8249;</button>
      <img id="mainImage" class="main-image" src="" alt=""/>
      <button class="gallery-nav-button next" onclick="window.galleryNext()">&#8250;</button>
      <div id="imageTitle" class="image-title"></div>
    </div>
    
    <div class="thumbnail-scroll-area">
      <div id="thumbnailContainer" class="thumbnail-container">
        </div>
    </div>
  </div>
</div>

<script>
(function() {
  var images = [
    { src: 'figs/artworks/b496380d49a63fcf3e8a6df65988fd1f.jpg', title: '立姿展翅 · Daydream I' },
    { src: 'figs/artworks/6FC7E738-0AC9-45B9-BC0F-7D8EDDD2CB4F_1_105_c.jpeg', title: '顿感 · Soft Flow' },
    { src: 'figs/artworks/EB4A3E87-0A18-4392-AE7A-5CC1A134A662_1_105_c.jpeg', title: '后花园 · Fading Memory' },
    { src: 'figs/artworks/微信图片_20251125212941_37_331.jpg', title: '机械蝴蝶 · Dream Machine' },
    { src: 'figs/artworks/微信图片_20251125212942_38_331.jpg', title: '玫瑰青凤蝶？ · Hazy Bloom' },
    { src: 'figs/artworks/眼.jpeg', title: '眼 · Eye' },
    { src: 'figs/artworks/被刺穿的.jpeg', title: '被刺穿的 · Buried' },
  ];

  var currentIndex = 0;
  var visibleThumbnailsCount = 7;
  var mainImage = document.getElementById('mainImage');
  var imageTitle = document.getElementById('imageTitle');
  var thumbnailContainer = document.getElementById('thumbnailContainer');
  var thumbnailScrollArea = document.querySelector('.thumbnail-scroll-area');
  
  // 标记当前是否正在切换中，防止狂点按钮导致动画错乱
  var isAnimating = false; 

  function generateVisibleThumbnails() {
    if (!thumbnailContainer || images.length === 0) return;
    thumbnailContainer.innerHTML = ''; 
    const total = images.length;
    let start = Math.max(0, currentIndex - Math.floor(visibleThumbnailsCount / 2));
    let end = start + visibleThumbnailsCount;

    if (end > total) {
      end = total;
      start = Math.max(0, total - visibleThumbnailsCount);
    }
    if (total <= visibleThumbnailsCount) {
        start = 0;
        end = total;
    }

    for (let i = start; i < end; i++) {
      const img = images[i];
      var thumb = document.createElement('img');
      thumb.className = 'thumbnail';
      thumb.src = img.src; 
      thumb.alt = img.title;
      thumb.dataset.index = i; 
      
      thumb.onclick = function() {
        const clickedIndex = parseInt(this.dataset.index);
        // 如果点击的是当前图，不执行动作
        if (clickedIndex !== currentIndex) {
            window.galleryShow(clickedIndex);
        }
      };
      
      if (i === currentIndex) {
        thumb.classList.add('active');
      }
      thumbnailContainer.appendChild(thumb);
    }

    setTimeout(() => {
        const activeThumb = document.querySelector('.thumbnail.active');
        if (activeThumb && thumbnailScrollArea) {
            const scrollCenter = activeThumb.offsetLeft + activeThumb.offsetWidth / 2 - thumbnailScrollArea.offsetWidth / 2;
            thumbnailScrollArea.scrollTo({ left: scrollCenter, behavior: 'smooth' });
        }
    }, 50);
  }

  window.galleryShow = function(index) {
    // 如果正在动画中，忽略新的请求（防止快速点击造成的闪烁）
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = index;
    var currentImage = images[index];
    
    // 1. 立即更新缩略图状态
    generateVisibleThumbnails(); 
    
    if (mainImage && currentImage) {
      // 2. 开始淡出（添加 CSS 类）
      // 添加 .image-hidden 类，触发 CSS 的 opacity: 0 和 filter: blur
      mainImage.classList.add('image-hidden');
      imageTitle.classList.add('title-hidden');
      
      // 3. 等待 CSS 动画完成 (600ms)
      setTimeout(function() {
        // 4. 切换图片源和文字
        mainImage.src = currentImage.src;
        mainImage.alt = currentImage.title;
        imageTitle.textContent = currentImage.title;
        
        // 5. 确保浏览器渲染了新图片源后，再移除隐藏类
        // 使用 requestAnimationFrame 确保平滑
        requestAnimationFrame(() => {
            mainImage.classList.remove('image-hidden');
            imageTitle.classList.remove('title-hidden');
            
            // 动画结束，解锁
            // 再给一点点缓冲时间，确保 transitionend 逻辑
            setTimeout(() => {
                isAnimating = false;
            }, 600); 
        });
        
      }, 600); // 这个时间必须匹配 CSS 中的 transition duration (0.6s)
    } else {
        isAnimating = false;
    }
  };

  window.galleryPrev = function() {
    if (isAnimating) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    window.galleryShow(newIndex);
  };

  window.galleryNext = function() {
    if (isAnimating) return;
    const newIndex = (currentIndex + 1) % images.length;
    window.galleryShow(newIndex);
  };

  // 初始化：不带动画直接显示第一张
  (function init() {
      if(images.length > 0) {
          mainImage.src = images[0].src;
          imageTitle.textContent = images[0].title;
          generateVisibleThumbnails();
      }
  })();

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
