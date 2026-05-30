import { loadAuth, saveAuth } from './store.js';
import { showToast } from './views/toast.js';

const AUTH_KEY = 'myntra_auth_v1';

function getEls() {
  return {
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginSubmit: document.getElementById('loginSubmit'),
    loginHint: document.getElementById('loginHint'),

    signupFirstName: document.getElementById('signupFirstName'),
    signupLastName: document.getElementById('signupLastName'),
    signupEmail: document.getElementById('signupEmail'),
    signupPassword: document.getElementById('signupPassword'),
    signupSubmit: document.getElementById('signupSubmit'),
    signupHint: document.getElementById('signupHint'),

    demoFillLogin: document.getElementById('demoFillLogin'),
    demoFillSignup: document.getElementById('demoFillSignup'),

    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(p) {
  return String(p || '').length >= 6;
}

function closeModalIfPossible() {
  window.__myntraUI?.closeModal?.();
}

export function initAuth() {
  const els = getEls();
  if (!els.loginSubmit || !els.signupSubmit) return;

  els.demoFillLogin?.addEventListener('click', () => {
    els.loginEmail.value = 'demo@user.com';
    els.loginPassword.value = 'demopass';
    if (els.loginHint) els.loginHint.textContent = '';
  });

  els.demoFillSignup?.addEventListener('click', () => {
    els.signupFirstName.value = 'Demo';
    els.signupLastName.value = 'User';
    els.signupEmail.value = 'demo@user.com';
    els.signupPassword.value = 'demopass';
    if (els.signupHint) els.signupHint.textContent = '';
  });

  els.loginSubmit?.addEventListener('click', () => {
    const email = (els.loginEmail?.value || '').trim();
    const password = els.loginPassword?.value || '';

    if (!email || !isValidEmail(email)) {
      if (els.loginHint) els.loginHint.textContent = 'Enter a valid email.';
      return;
    }
    if (!validatePassword(password)) {
      if (els.loginHint) els.loginHint.textContent = 'Password must be at least 6 characters.';
      return;
    }

    const firstName = email.split('@')[0].slice(0, 1).toUpperCase() + email.split('@')[0].slice(1);
    saveAuth({ user: { firstName, lastName: '', email } });
    window.__myntraUI?.openModal?.();
    closeModalIfPossible();
    window.dispatchEvent(new Event('myntra:auth-changed'));
    showToast('Login successful', 'success');
  });

  els.signupSubmit?.addEventListener('click', () => {
    const firstName = (els.signupFirstName?.value || '').trim();
    const lastName = (els.signupLastName?.value || '').trim();
    const email = (els.signupEmail?.value || '').trim();
    const password = els.signupPassword?.value || '';

    if (!firstName || !lastName) {
      if (els.signupHint) els.signupHint.textContent = 'First and last name are required.';
      return;
    }
    if (!email || !isValidEmail(email)) {
      if (els.signupHint) els.signupHint.textContent = 'Enter a valid email.';
      return;
    }
    if (!validatePassword(password)) {
      if (els.signupHint) els.signupHint.textContent = 'Password must be at least 6 characters.';
      return;
    }

    saveAuth({ user: { firstName, lastName, email } });
    closeModalIfPossible();
    window.dispatchEvent(new Event('myntra:auth-changed'));
    showToast('Signup successful', 'success');
  });
}

// auto-init
initAuth();

