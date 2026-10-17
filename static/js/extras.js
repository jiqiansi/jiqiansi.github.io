/* ============================================================
   VBlog 增强脚本（全局注入，零构建）
   - 回到顶部按钮
   - 文章/动态详情页顶部阅读进度条
   纯原生实现，不依赖任何框架；监听 hashchange 适配 vue-router hash 模式。
   ============================================================ */
(function () {
  'use strict';

  function inject() {
    if (document.getElementById('vblog-back-top')) return;

    var progress = document.createElement('div');
    progress.id = 'vblog-read-progress';
    document.body.appendChild(progress);

    var backTop = document.createElement('div');
    backTop.id = 'vblog-back-top';
    backTop.innerHTML = '↑';
    backTop.title = '回到顶部';
    document.body.appendChild(backTop);

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function isArticle() {
      // 文章详情 / 最新动态详情 路径
      var h = location.hash || '';
      return /#\/user\/blog\/details\//.test(h) || /#\/user\/new\/main/.test(h);
    }

    function tick() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // 回到顶部按钮：任意页滚动超过一屏高度出现
      if (scrollTop > 400) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }

      // 阅读进度条：仅文章/动态详情页
      if (isArticle()) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = docH > 0 ? scrollTop / docH : 0;
        ratio = Math.max(0, Math.min(1, ratio));
        progress.style.width = (ratio * 100) + '%';
        progress.style.opacity = '1';
      } else {
        progress.style.width = '0';
        progress.style.opacity = '0';
      }
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('hashchange', tick);
    // 内容异步加载后多触发几次，保证进度计算正确
    setInterval(tick, 600);
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
