/* Prop Explore · 交互脚本 */
(function () {
  'use strict';

  /* ---------- 1920×1080 舞台等比缩放居中 ---------- */
  var stage = document.getElementById('stage');
  function fitStage() {
    if (!stage) return;
    // 移动端（≤900px）：CSS 断点内切换为文档流布局，不再等比缩放
    if (window.innerWidth <= 900) {
      stage.style.transform = 'none';
      var hero = document.getElementById('loginHero');
      if (hero) { hero.style.left = ''; hero.style.width = ''; }
      return;
    }
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    var tx = (window.innerWidth - 1920 * s) / 2;
    var ty = (window.innerHeight - 1080 * s) / 2;
    stage.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
    // 登录页主视觉向左出血到浏览器边缘，消除宽屏下的黑色边条
    var hero = document.getElementById('loginHero');
    if (hero && stage.classList.contains('login-stage')) {
      var bleed = Math.max(0, tx) / s; // 设计稿坐标系中的出血量
      hero.style.left = -bleed + 'px';
      hero.style.width = 1080 + bleed + 'px';
    }
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  /* ============================================================
     登录页
     ============================================================ */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // 显示/隐藏密码（睁眼 ⇄ 闭眼图标切换）
    var eyeBtn = document.getElementById('eyeBtn');
    var pwd = document.getElementById('password');
    var iconEyeOpen = document.getElementById('iconEyeOpen');
    var iconEyeOff = document.getElementById('iconEyeOff');
    eyeBtn.addEventListener('click', function () {
      var show = pwd.type === 'password';
      pwd.type = show ? 'text' : 'password';
      iconEyeOpen.style.display = show ? 'none' : '';
      iconEyeOff.style.display = show ? '' : 'none';
      eyeBtn.style.color = show ? '#E48715' : '';
      eyeBtn.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
    });

    // 记住我
    var rememberBox = document.getElementById('rememberBox');
    document.getElementById('rememberRow').addEventListener('click', function () {
      rememberBox.classList.toggle('unchecked');
    });

    // 登录 → 主页
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'home.html';
    });
    return;
  }

  /* ============================================================
     主页
     ============================================================ */

  /* ---------- 地图数据（与设计稿组件一一对应） ---------- */
  var MAPS = [
    { cn: '荒漠迷城', en: 'MIRAGE', img: 'assets/map-mirage.png', live: true },
    { cn: '炙热沙城 II', en: 'DUST II', img: 'assets/map-dust2.png', live: false },
    { cn: '炼狱小镇', en: 'INFERNO', img: 'assets/map-inferno.png', live: false },
    { cn: '核子危机', en: 'NUKE', img: 'assets/map-nuke.png', live: false },
    { cn: '远古遗迹', en: 'ANCIENT', img: 'assets/map-ancient.png', live: false },
    { cn: '阿努比斯', en: 'ANUBIS', img: 'assets/map-anubis.png', live: false },
    { cn: '列车停放站', en: 'TRAIN', img: 'assets/map-train.png', live: false },
    { cn: '死亡游乐园', en: 'OVERPASS', img: 'assets/map-overpass.png', live: false },
    { cn: '殒命大厦', en: 'VERTIGO', img: 'assets/map-vertigo.png', live: false },
    { cn: '死城之谜', en: 'CACHE', img: 'assets/map-cache.png', live: false },
    { cn: '办公室', en: 'OFFICE', img: 'assets/map-office.png', live: false },
    { cn: '意大利小镇', en: 'ITALY', img: 'assets/map-italy.png', live: false, long: true }
  ];

  var mapTrack = document.getElementById('mapTrack');
  var modalMask = document.getElementById('modalMask');

  MAPS.forEach(function (m, i) {
    var card = document.createElement('div');
    card.className = 'map-card' + (i === 0 ? ' selected' : '') + (m.long ? ' name-long' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML =
      '<img class="cover" src="' + m.img + '" alt="' + m.cn + '">' +
      '<span class="map-name">' + m.cn + '</span>' +
      '<span class="map-en">' + m.en + '</span>' +
      '<span class="selected-bar"></span>' +
      '<span class="check"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.8 5.2 10 11 3.5"/></svg></span>';
    card.addEventListener('click', function () {
      if (!m.live) {
        // 未上线地图：提示弹窗（设计稿「地图未上线 · 提示弹窗」）
        modalMask.classList.add('show');
        return;
      }
      var prev = mapTrack.querySelector('.map-card.selected');
      if (prev) prev.classList.remove('selected');
      card.classList.add('selected');
    });
    mapTrack.appendChild(card);
  });

  /* ---------- 提示弹窗 ---------- */
  function closeModal() { modalMask.classList.remove('show'); }
  document.getElementById('modalOk').addEventListener('click', closeModal);
  modalMask.addEventListener('click', function (e) {
    if (e.target === modalMask) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- 地图列表滑动 ---------- */
  document.getElementById('slideHint').addEventListener('click', function () {
    var strip = document.querySelector('.map-strip');
    strip.scrollTo({ left: strip.scrollWidth, behavior: 'smooth' });
  });

  /* ---------- 主题切换 ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var iconSun = document.getElementById('iconSun');
  var iconMoon = document.getElementById('iconMoon');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var light = t === 'light';
    iconSun.style.display = light ? 'none' : '';
    iconMoon.style.display = light ? '' : 'none';
    themeBtn.setAttribute('aria-label', light ? '切换至暗色主题' : '切换至浅色主题');
    try { localStorage.setItem('pe-theme', t); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('pe-theme'); } catch (e) {}
  applyTheme(saved === 'light' ? 'light' : 'dark');

  themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- 退出登录 ---------- */
  document.getElementById('logoutBtn').addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  /* ---------- 移动端：筛选面板向右展开/收起 ---------- */
  var filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    var filterPanel = document.querySelector('.filter-panel');
    filterBtn.addEventListener('click', function () {
      var open = filterPanel.classList.toggle('open');
      filterBtn.setAttribute('aria-label', open ? '收起筛选面板' : '展开筛选面板');
    });
  }

  /* ---------- 道具数据（Mirage · CT/T 方点位图） ----------
     文件夹规则：同一点位内「N.1站位 + N.2投掷」为一组；
     效果图不区分 N 时所有组共用，区分 N 时按组对应。 */
  var PROP_DATA = {
    ct: {
      smoke: [
        { spot: 'B2', region: 'B点', effect: 'B2烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跳投.jpg', note: '左键跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键跳投.jpg', note: '左键跳投' }
        ] }
      ],
      flash: [
        { spot: 'B2', region: 'B点', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跳投.jpg', note: '左键跳投', effect: '1闪光弹效果图.jpg' },
          { stand: '2.1站位.jpg', throw: '2.2左键投掷.jpg', note: '左键投掷', effect: '2闪光弹效果图.jpg' }
        ] },
        { spot: '超市窗口', region: 'B点', effect: '超市窗口闪光弹效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2双键投掷.jpg', note: '双键投掷' }
        ] }
      ],
      molotov: [
        { spot: 'B包', region: 'B点', effect: 'B包燃烧瓶效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跑一步投掷.jpg', note: '左键跑一步投掷' }
        ] }
      ]
    },
    t: {
      smoke: [
        { spot: 'B小', region: 'B小', effect: 'B小烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跳投1.jpg', note: '左键跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键跳投.jpg', note: '左键跳投' }
        ] },
        { spot: 'VIP', region: 'VIP', effect: 'VIP烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2双键静走一步跳投.jpg', note: '双键静走一步跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键投掷.jpg', note: '左键投掷' }
        ] },
        { spot: 'jungle', region: '中路', effect: 'jungle烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2蹲左键跳投.jpg', note: '蹲左键跳投' },
          { stand: '2.1站位.jpg', throw: '2.1左键跳投.jpg', note: '左键跳投' },
          { stand: '3.1站位.jpg', throw: '3.2左键跳投.jpg', note: '左键跳投' },
          { stand: '4.1站位.jpg', throw: '4.2左键跳投.jpg', note: '左键跳投' }
        ] },
        { spot: '匪口', region: '中路', effect: '匪口烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键蹲投.jpg', note: '左键蹲投' }
        ] },
        { spot: '拱门', region: '拱门', effect: '拱门烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键蹲下w+跳投.jpg', note: '左键蹲下W+跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键跳投.jpg', note: '左键跳投' },
          { stand: '3.1站位.jpg', throw: '3.2左键+W+跳投.jpg', note: '左键+W+跳投' },
          { stand: '4.1站位.jpg', throw: '4.2左键静走两步跳投.jpg', note: '左键静走两步跳投' },
          { stand: '5.1站位.jpg', throw: '5.2左键跳投.jpg', note: '左键跳投' }
        ] },
        { spot: '拱门内侧', region: '拱门', effect: '拱门内侧烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键站投.jpg', note: '左键站投' },
          { stand: '2.1站位.jpg', throw: '2.2左键站投.jpg', note: '左键站投' },
          { stand: '3.1站位.jpg', throw: '3.2左键站投.jpg', note: '左键站投' },
          { stand: '4.1站位.jpg', throw: '4.2左键跳投.jpg', note: '左键跳投' }
        ] },
        { spot: '警家', region: 'A点', effect: '警家烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键W+跳投.jpg', note: '左键W+跳投' }
        ] },
        { spot: '超市窗口', region: 'B点', effect: '超市窗口烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2蹲左键跳投.jpg', note: '蹲左键跳投' },
          { stand: '2.1站位.jpg', throw: '2.1左键跳投.jpg', note: '左键跳投' },
          { stand: '3.1站位.jpg', throw: '3.2左键跳投.jpg', note: '左键跳投' }
        ] },
        { spot: '超市门口', region: 'B点', effect: '超市门口烟效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跑一步跳投.jpg', note: '左键跑一步跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键W+跳投.jpg', note: '左键W+跳投' },
          { stand: '3.1站位.jpg', throw: '3.2左键跳投.jpg', note: '左键跳投' }
        ] }
      ],
      molotov: [
        { spot: 'A二楼下', region: 'A点', effect: 'A二楼下燃烧瓶效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键投掷.jpg', note: '左键投掷' },
          { stand: '2.1站位.jpg', throw: '2.2左键跑四步投掷.jpg', note: '左键跑四步投掷' }
        ] },
        { spot: 'A短箱外侧', region: 'A点', effect: 'A短箱外侧燃烧瓶效果图.jpg', groups: [
          { stand: '1.1站位.jpg', throw: '1.2左键跳投.jpg', note: '左键跳投' },
          { stand: '2.1站位.jpg', throw: '2.2左键跑一步投掷.jpg', note: '左键跑一步投掷' }
        ] }
      ]
    }
  };
  var PROP_BASE = 'assets/props/';

  var state = { faction: 't', prop: 'smoke', page: 0, regions: ['全部'], search: '' };

  /* ---------- 轻提示 Toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* ---------- 内容区渲染 ---------- */
  var thumbA = document.querySelector('.card-a .thumb');
  var thumbB = document.querySelector('.card-b .thumb');
  var capA = document.querySelector('.card-a .caption span');
  var capB = document.querySelector('.card-b .caption span');
  var effectImg = document.getElementById('effectImg');
  var effectPh = document.querySelectorAll('.effect-box .ph1, .effect-box .ph2');
  var counterCur = document.querySelector('.page-counter .cur');
  var counterTotal = document.querySelector('.page-counter .total');
  var prevBtn = document.querySelector('.page-btn.prev');
  var nextBtn = document.querySelector('.page-btn.next');
  var regionGrid = document.getElementById('regionGrid');

  function propAvailable(prop) {
    return ((PROP_DATA[state.faction] || {})[prop] || []).length > 0;
  }

  function currentPairs() {
    var list = (PROP_DATA[state.faction] || {})[state.prop] || [];
    var tags = state.regions.indexOf('全部') >= 0 ? null : state.regions;
    return (tags ? list.filter(function (s) { return tags.indexOf(s.spot) >= 0; }) : list).reduce(function (acc, s) {
      s.groups.forEach(function (g) { acc.push({ spot: s, group: g }); });
      return acc;
    }, []);
  }

  function setThumb(el, url) {
    el.style.backgroundImage = url ? 'url("' + url + '")' : 'none';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.filter = 'none';
  }

  function renderProps() {
    var pairs = currentPairs();
    if (state.page >= pairs.length) state.page = 0;
    if (pairs.length === 0) {
      setThumb(thumbA, null);
      setThumb(thumbB, null);
      capA.textContent = '暂无该条件下的道具图';
      capB.textContent = '换个区域或道具试试';
      effectImg.style.display = 'none';
      effectPh.forEach(function (el) { el.style.display = ''; });
      counterCur.textContent = '0';
      counterTotal.textContent = '/ 0';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    var p = pairs[state.page];
    var dir = PROP_BASE + state.faction + '/' + state.prop + '/' + p.spot.spot + '/';
    setThumb(thumbA, dir + p.group.stand);
    setThumb(thumbB, dir + p.group.throw);
    capA.textContent = p.spot.spot + ' · ' + p.group.note;
    capB.textContent = p.spot.spot + ' · ' + p.group.note;
    var eff = p.group.effect || p.spot.effect;
    effectImg.src = dir + eff;
    effectImg.style.display = 'block';
    effectPh.forEach(function (el) { el.style.display = 'none'; });
    counterCur.textContent = String(state.page + 1);
    counterTotal.textContent = '/ ' + pairs.length;
    prevBtn.disabled = state.page === 0;
    nextBtn.disabled = state.page >= pairs.length - 1;
  }

  /* ---------- 阵营分段按钮 ---------- */
  var seg = document.getElementById('factionSeg');
  seg.querySelectorAll('.seg-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      seg.setAttribute('data-active', btn.getAttribute('data-side'));
      state.faction = btn.getAttribute('data-side');
      state.page = 0;
      state.regions = ['全部'];
      refreshChips();
      renderRegions();
      renderProps();
    });
  });

  /* ---------- 道具类型（单选，未上新禁用） ---------- */
  var chips = document.getElementById('propChips').querySelectorAll('.chip');

  function refreshChips() {
    chips.forEach(function (chip) {
      var avail = propAvailable(chip.getAttribute('data-prop'));
      chip.classList.toggle('disabled', !avail);
      if (!avail && chip.classList.contains('active')) {
        // 当前选中道具在新阵营未上新 → 回退到第一个可用道具
        chip.classList.remove('active');
        for (var i = 0; i < chips.length; i++) {
          if (propAvailable(chips[i].getAttribute('data-prop'))) {
            chips[i].classList.add('active');
            state.prop = chips[i].getAttribute('data-prop');
            break;
          }
        }
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.classList.contains('disabled')) {
        showToast('该道具暂未上新，敬请期待');
        return;
      }
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      state.prop = chip.getAttribute('data-prop');
      state.page = 0;
      state.regions = ['全部'];
      renderRegions();
      renderProps();
    });
  });

  /* ---------- 区域标签（按当前阵营+道具实际点位动态生成） ----------
     固定规格：等宽 71.33px、统一字号；搜索框可按点位名实时过滤。 */
  function bindRegionTags() {
    regionGrid.querySelectorAll('.region-tag').forEach(function (tag) {
      tag.addEventListener('click', function () {
        var name = tag.textContent;
        if (name === '全部') {
          state.regions = ['全部'];
        } else {
          var i = state.regions.indexOf('全部');
          if (i >= 0) state.regions.splice(i, 1);
          var j = state.regions.indexOf(name);
          if (j >= 0) state.regions.splice(j, 1); else state.regions.push(name);
          if (state.regions.length === 0) state.regions = ['全部'];
        }
        regionGrid.querySelectorAll('.region-tag').forEach(function (t) {
          t.classList.toggle('active', state.regions.indexOf(t.textContent) >= 0);
        });
        state.page = 0;
        renderProps();
      });
    });
  }

  function renderRegions() {
    var spots = (PROP_DATA[state.faction] || {})[state.prop] || [];
    var names = [];
    spots.forEach(function (s) { if (names.indexOf(s.spot) < 0) names.push(s.spot); });
    var kw = state.search.trim().toLowerCase();
    if (kw) names = names.filter(function (n) { return n.toLowerCase().indexOf(kw) >= 0; });
    regionGrid.innerHTML = '';
    var row = null;
    var items = ['全部'].concat(names);
    items.forEach(function (name, i) {
      if (i % 3 === 0) {
        row = document.createElement('div');
        row.className = 'region-row';
        regionGrid.appendChild(row);
      }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'region-tag' + (state.regions.indexOf(name) >= 0 ? ' active' : '');
      b.textContent = name;
      row.appendChild(b);
    });
    bindRegionTags();
  }

  /* ---------- 搜索点位：实时过滤区域标签 ---------- */
  document.querySelector('.search-box input').addEventListener('input', function () {
    state.search = this.value;
    state.regions = ['全部']; // 过滤后重置选择，避免选中隐藏项
    state.page = 0;
    renderRegions();
    renderProps();
  });

  /* ---------- 点位翻页 ---------- */
  prevBtn.addEventListener('click', function () {
    if (state.page > 0) { state.page--; renderProps(); }
  });
  nextBtn.addEventListener('click', function () {
    if (state.page < currentPairs().length - 1) { state.page++; renderProps(); }
  });

  /* ---------- 移动端：雷达图向上收起 / 点击展开 ---------- */
  var radarToggle = document.getElementById('radarToggle');
  if (radarToggle) {
    var radarCol = document.querySelector('.radar-col');
    var radarText = radarToggle.querySelector('.radar-toggle-text');
    radarToggle.addEventListener('click', function () {
      var collapsed = radarCol.classList.toggle('collapsed');
      radarText.textContent = collapsed ? '点击展开地图点位图' : '地图点位图';
      radarToggle.setAttribute('aria-expanded', String(!collapsed));
    });
    /* 同步初始状态（如页面载入即为收起态） */
    if (radarCol.classList.contains('collapsed')) {
      radarText.textContent = '点击展开地图点位图';
      radarToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* ---------- 移动端：预览区左右滑动切换上/下一组 ---------- */
  var previewCol = document.querySelector('.preview-col');
  if (previewCol) {
    var touchX = null;
    previewCol.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    previewCol.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 48) return; /* 位移过小视为误触 */
      if (dx < 0 && state.page < currentPairs().length - 1) { state.page++; renderProps(); }
      else if (dx > 0 && state.page > 0) { state.page--; renderProps(); }
    }, { passive: true });
  }

  refreshChips();
  renderRegions();
  renderProps();
})();
