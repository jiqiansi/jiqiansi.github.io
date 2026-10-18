/* ============================================================
   VBlog 增强脚本（全局注入，零构建）
   - 回到顶部按钮
   - 文章/动态详情页顶部阅读进度条
   - 文章自动目录 TOC（提取 h2/h3，sticky 吸顶 + 滚动高亮）
   - 代码块一键复制
   纯原生实现，不依赖任何框架；监听 hashchange 适配 vue-router hash 模式。
   ============================================================ */
(function () {
  'use strict';

  function slug(text, i) {
    return 'vblog-h-' + i + '-' + (text || '').replace(/[^\w一-龥]+/g, '-').slice(0, 24);
  }

  function isArticle() {
    // 文章详情 / 动态详情 路径
    var h = location.hash || '';
    return /#\/user\/blog\/details\//.test(h) || /#\/user\/new\/details\//.test(h);
  }

  function buildTOC() {
    var body = document.querySelector('.markdown-body');
    if (!body || body.getAttribute('data-toc') === '1') return;
    // 源码已在详情页渲染侧栏目录卡(.toc-card),避免双目录,改用浮层 TOC 只留给动态页
    if (document.querySelector('.toc-card')) return;
    var hs = body.querySelectorAll('h1, h2, h3');
    if (hs.length < 2) return;

    var toc = document.createElement('nav');
    toc.className = 'vblog-toc';
    var title = document.createElement('div');
    title.className = 'vblog-toc-title';
    title.textContent = '目录';
    toc.appendChild(title);

    var ul = document.createElement('ul');
    var heads = [];
    for (var i = 0; i < hs.length; i++) {
      var hx = hs[i];
      var id = slug(hx.textContent, i);
      hx.id = id;
      heads.push(hx);
      var li = document.createElement('li');
      li.className = hx.tagName === 'H3' ? 'vblog-toc-sub' : (hx.tagName === 'H1' ? 'vblog-toc-h1' : '');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = hx.textContent;
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var t = document.getElementById(this.getAttribute('href').slice(1));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      ul.appendChild(li);
    }
    toc.appendChild(ul);
    // 插到正文之前，作为吸顶目录卡
    body.parentNode.insertBefore(toc, body);
    body.setAttribute('data-toc', '1');

    // 滚动高亮当前章节
    function highlight() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var active = heads[0];
      for (var j = 0; j < heads.length; j++) {
        if (heads[j].offsetTop - 120 <= scrollTop) {
          active = heads[j];
        } else {
          break;
        }
      }
      var links = toc.querySelectorAll('a');
      for (var k = 0; k < links.length; k++) {
        links[k].classList.toggle('active', active && links[k].getAttribute('href') === '#' + active.id);
      }
    }
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  function addCopyButtons() {
    var pres = document.querySelectorAll('.markdown-body pre');
    for (var i = 0; i < pres.length; i++) {
      var pre = pres[i];
      if (pre.getAttribute('data-copy') === '1') continue;
      pre.style.position = 'relative';
      var btn = document.createElement('button');
      btn.className = 'vblog-copy-btn';
      btn.type = 'button';
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var code = this.parentNode.querySelector('code') ? this.parentNode.querySelector('code').innerText : this.parentNode.innerText;
        var done = function (self) {
          self.textContent = '已复制';
          setTimeout(function () { self.textContent = '复制'; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(function () { done(btn); }, function () { fallback(code); });
        } else {
          fallback(code);
        }
        function fallback(text) {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(btn); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
      pre.appendChild(btn);
      pre.setAttribute('data-copy', '1');
    }
  }

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
        // 章节目录 + 代码复制（幂等）
        buildTOC();
        addCopyButtons();
      } else {
        progress.style.width = '0';
        progress.style.opacity = '0';
      }
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('hashchange', tick);
    // 内容异步加载后多触发几次，保证进度/TOC/复制按钮计算正确
    setInterval(tick, 600);
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
