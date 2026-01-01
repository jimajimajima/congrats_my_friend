// ====== 要素取得 ======
const sideMenu   = document.getElementById('side-menu');
const openBtn    = document.getElementById('menu-toggle');
const closeBtn   = document.getElementById('close-menu');
const menuLinks  = sideMenu.querySelectorAll('a');
const sections   = document.querySelectorAll('.section');

// ホーム（Hero）のボタン
const heroMsgBtn = document.getElementById('hero-message-btn');
const heroGalBtn = document.getElementById('hero-gallery-btn');

// ====== セクション切替（フェードアニメ付き） ======
function showSection(id) {
  sections.forEach(sec => {
    if (sec.classList.contains('active')) {
      sec.classList.add('fade-out');
      setTimeout(() => {
        sec.classList.remove('active', 'fade-out');
      }, 400);
    }
  });

  setTimeout(() => {
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active', 'fade-in');
      setTimeout(() => target.classList.remove('fade-in'), 400);
    }
    if (id === 'messages') resetMessageTabs();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 400);
}

// ハッシュ → セクション反映
function syncFromHash() {
  const id = (location.hash || '#intro').replace('#', '');
  const exists = Array.from(sections).some(sec => sec.id === id);
  showSection(exists ? id : 'intro');
}

// ====== メニュー開閉 ======
openBtn.addEventListener('click', () => sideMenu.classList.add('open'));
closeBtn.addEventListener('click', () => sideMenu.classList.remove('open'));

menuLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.dataset.target;
    history.pushState(null, '', `#${id}`);
    showSection(id);
    sideMenu.classList.remove('open');
  });
});

// ====== ホームの2ボタン ======
if (heroMsgBtn) {
  heroMsgBtn.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState(null, '', '#messages');
    showSection('messages');
  });
}
if (heroGalBtn) {
  heroGalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState(null, '', '#gallery');
    showSection('gallery');
  });
}

// ====== メッセージ内部タブ ======
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels  = document.querySelectorAll('.tab-panel');

function activateMessageTab(targetId) {
  tabButtons.forEach(btn => {
    const active = btn.getAttribute('aria-controls') === targetId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === targetId);
  });

  // 背景切り替え（概要は変更なし）
  document.body.classList.remove('bg-groom', 'bg-bride');
  if (targetId === 'msg-groom') document.body.classList.add('bg-groom');
  else if (targetId === 'msg-bride') document.body.classList.add('bg-bride');
}
function resetMessageTabs() { activateMessageTab('msg-overview'); }

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('aria-controls');
    activateMessageTab(targetId);
  });
});

// ====== ギャラリー：一覧→アルバム遷移と戻る ======
function bindGalleryNav() {
  const galleryLinks = document.querySelectorAll('.gallery-link');
  const backLinks = document.querySelectorAll('.back-link');

  galleryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.target;
      history.pushState(null, '', `#${id}`);
      showSection(id);
    });
  });

  backLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.target || 'gallery';
      history.pushState(null, '', `#${id}`);
      showSection(id);
    });
  });
}

// ====== 初期化 ======
window.addEventListener('hashchange', syncFromHash);
window.addEventListener('DOMContentLoaded', () => {
  syncFromHash();
  bindGalleryNav();
});

// ====== フェード用CSSを追加 ======
const style = document.createElement('style');
style.textContent = `
.section.fade-in { animation: fadeIn 0.4s ease forwards; }
.section.fade-out { animation: fadeOut 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-15px); } }

/* 背景切り替え（メッセージ内タブ） */
body.bg-groom::before { background: url("images/小西①.jpg") center/cover no-repeat; }
body.bg-bride::before { background: url("images/待鳥①.jpg") center/cover no-repeat; }
`;
document.head.appendChild(style);
