// Minimal UI wiring for navbar/cart/wishlist badges + auth modal.
// This file previously contained only a stub; auth modal + user name rendering depend on it.

import { cartCount, wishlistCount, loadAuth, saveAuth } from './store.js';
import { initAuth } from './auth.js';
import { showToast } from './views/toast.js';

function setText(el, value) {
  if (!el) return;
  el.textContent = value;
}

function getEls() {
  return {
    // cart.js uses #cartCount / #wishlistCount badges for navbar counts
    cartCount: document.getElementById('cartCount'),
    wishlistCount: document.getElementById('wishlistCount'),

    avatarName: document.getElementById('avatarName'),
    profileMenuUser: document.getElementById('profileMenuUser'),
    authBtn: document.getElementById('authBtn'),
    profileWrap: document.getElementById('profileWrap'),
    profileMenu: document.getElementById('profileMenu'),

    openAuthModalBtn: document.getElementById('openAuthModalBtn'),
    authOverlay: document.getElementById('authOverlay'),
    authCloseBtn: document.getElementById('authCloseBtn'),

    logoutBtn: document.getElementById('logoutBtn'),

    tabs: document.querySelectorAll('.tabs .tab'),
  };
}

function openModal() {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.style.display = 'flex';
}

function closeModal() {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.display = 'none';
}

function syncBadges() {
  const { cartCount: cartEl, wishlistCount: wishEl } = getEls();
  if (cartEl) setText(cartEl, String(cartCount()));
  if (wishEl) setText(wishEl, String(wishlistCount()));
}

function syncAuthUI() {
  const { avatarName, profileMenuUser, authBtn, profileMenu } = getEls();
  const { user } = loadAuth();

  if (!user) {
    setText(avatarName, 'Login');
    setText(profileMenuUser, 'Hi!');
    if (authBtn) authBtn.setAttribute('aria-label', 'Profile');
    return;
  }

  const name = user.firstName || user.email?.split('@')?.[0] || 'User';
  setText(avatarName, name);
  setText(profileMenuUser, `Hi! ${name}`);

  if (profileMenu) {
    // keep menu open/closed as-is
  }
}

function initNavbarInteractions() {
  const {
    authBtn,
    profileWrap,
    profileMenu,
    openAuthModalBtn,
    authOverlay,
    authCloseBtn,
    logoutBtn,
    tabs,
  } = getEls();

  // expose modal controls used by auth.js
  window.__myntraUI = window.__myntraUI || {};
  window.__myntraUI.openModal = () => openModal();
  window.__myntraUI.closeModal = () => closeModal();

  // close modal on overlay click
  authOverlay?.addEventListener('click', (e) => {
    if (e.target === authOverlay) closeModal();
  });

  // close button
  authCloseBtn?.addEventListener('click', closeModal);

  // open from navbar profile
  authBtn?.addEventListener('click', () => {
    if (!profileMenu) return;
    profileMenu.classList.toggle('open');
  });

  // open auth modal
  openAuthModalBtn?.addEventListener('click', () => {
    closeProfileMenu();
    openModal();
  });

  function closeProfileMenu() {
    getEls().profileMenu?.classList.remove('open');
  }

  // logout
  logoutBtn?.addEventListener('click', () => {
    saveAuth({ user: null });
    window.dispatchEvent(new Event('myntra:auth-changed'));
    syncAuthUI();
    showToast('Logged out', 'success');
    closeProfileMenu();
  });

  // tabs (login/signup)
  document.querySelectorAll('.tabs .tab')?.forEach((t) => {
    t.addEventListener('click', () => {
      const tabKey = t.dataset.tab;
      document.querySelectorAll('.tabs .tab').forEach((x) => x.classList.toggle('active', x === t));
      const loginForm = document.getElementById('loginForm');
      const signupForm = document.getElementById('signupForm');
      if (tabKey === 'login') {
        if (loginForm) loginForm.style.display = 'flex';
        if (signupForm) signupForm.style.display = 'none';
      } else {
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'flex';
      }
    });
  });

  // keep clicks outside profile menu from leaving it open
  document.addEventListener('click', (e) => {
    const { profileMenu } = getEls();
    if (!profileMenu) return;
    if (profileMenu.contains(e.target)) return;
    if (profileWrap?.contains(e.target)) return;
    profileMenu.classList.remove('open');
  });
}

export function initUI() {
  syncBadges();
  syncAuthUI();
  initNavbarInteractions();

  window.addEventListener('myntra:cart-changed', () => syncBadges());
  window.addEventListener('myntra:wishlist-changed', () => syncBadges());
  window.addEventListener('myntra:auth-changed', () => syncAuthUI());
}

// bootstrap
initUI();

