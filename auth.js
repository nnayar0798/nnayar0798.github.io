// ─────────────────────────────────────────────────────────────
// auth.js — Yorkseed shared auth module
// Include on EVERY page: <script src="auth.js"></script>
// Place this script tag just before </body> on every page.
// ─────────────────────────────────────────────────────────────

const Auth = (() => {

  const KEY = 'ys_user';

  // ── Read / Write ──────────────────────────────────────────
  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch { return null; }
  }

  function setUser(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(KEY);
    window.location.href = 'login.html';
  }

  function isLoggedIn() {
    return !!getUser();
  }

  // ── Update nav on every page ──────────────────────────────
  // Finds .login-btn in the nav and replaces it with a user chip
  // if the user is logged in. Also adds Members link if missing.
  function updateNav() {
    const user = getUser();
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // --- Ensure Members link exists ---
    const hasMembersLink = !!navLinks.querySelector('a[href="members.html"]');
    if (!hasMembersLink) {
      const loginLi = navLinks.querySelector('li:has(.login-btn)') ||
                      [...navLinks.querySelectorAll('li')].find(li => li.querySelector('.login-btn'));
      const membersLi = document.createElement('li');
      membersLi.innerHTML = '<a href="members.html">Members</a>';
      if (loginLi) navLinks.insertBefore(membersLi, loginLi);
      else navLinks.appendChild(membersLi);
    }

    // Mark active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === currentPage);
    });

    // --- Swap Login button with user chip ---
    const loginLi = navLinks.querySelector('li:has(.login-btn)') ||
                    [...navLinks.querySelectorAll('li')].find(li => li.querySelector('.login-btn'));
    if (!loginLi) return;

    if (user) {
      const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const color = user.role === 'investor' ? '#059669' : '#dc2626';
      loginLi.innerHTML = `
        <div class="user-nav-chip" style="
          display:flex; align-items:center; gap:0.6rem;
          background:#f8fafc; border:1px solid #e0e0e0; border-radius:25px;
          padding:0.35rem 1rem 0.35rem 0.4rem; cursor:pointer;
          font-size:0.88rem; font-weight:600; color:#1a1a1a;
          transition:all 0.2s; position:relative;
        "
        onmouseenter="this.style.borderColor='#dc2626';this.style.background='#fff5f5'"
        onmouseleave="this.style.borderColor='#e0e0e0';this.style.background='#f8fafc'"
        onclick="document.getElementById('ys-user-menu').style.display = document.getElementById('ys-user-menu').style.display === 'block' ? 'none' : 'block'">
          <div style="
            width:28px; height:28px; border-radius:50%;
            background:${color}; color:white; display:flex;
            align-items:center; justify-content:center;
            font-size:0.72rem; font-weight:800; flex-shrink:0;
          ">${initials}</div>
          <span>${user.name.split(' ')[0]}</span>
          <span style="color:#aaa; font-size:0.75rem;">▾</span>
          <div id="ys-user-menu" style="
            display:none; position:absolute; top:calc(100% + 8px); right:0;
            background:white; border:1px solid #e0e0e0; border-radius:12px;
            box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:0.5rem;
            min-width:180px; z-index:9999;
          ">
            <div style="padding:0.6rem 0.75rem; border-bottom:1px solid #f0f0f0; margin-bottom:0.3rem;">
              <div style="font-weight:700; font-size:0.9rem;">${user.name}</div>
              <div style="font-size:0.78rem; color:#888; margin-top:0.1rem; text-transform:capitalize;">${user.role} · ${user.company}</div>
            </div>
            <a href="members.html" style="display:block; padding:0.5rem 0.75rem; text-decoration:none; color:#333; font-size:0.88rem; border-radius:8px; transition:background 0.15s;"
               onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">👥 Members</a>
            <a href="marketplace.html" style="display:block; padding:0.5rem 0.75rem; text-decoration:none; color:#333; font-size:0.88rem; border-radius:8px; transition:background 0.15s;"
               onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">🎁 Marketplace</a>
            <div style="border-top:1px solid #f0f0f0; margin-top:0.3rem; padding-top:0.3rem;">
              <button onclick="Auth.logout()" style="
                width:100%; text-align:left; padding:0.5rem 0.75rem;
                background:none; border:none; cursor:pointer; color:#dc2626;
                font-size:0.88rem; font-family:inherit; border-radius:8px;
                transition:background 0.15s;
              "
              onmouseenter="this.style.background='#fff5f5'" onmouseleave="this.style.background='transparent'">
                🚪 Log out
              </button>
            </div>
          </div>
        </div>`;
    }
    // If not logged in, leave Login button as-is
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('ys-user-menu');
    if (menu && !e.target.closest('.user-nav-chip')) {
      menu.style.display = 'none';
    }
  });

  // ── Gate pages that require login ─────────────────────────
  // Call this on members.html or any page that needs auth
  function requireLogin(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
      window.location.href = redirectTo;
    }
  }

  // ── Run on every page load ────────────────────────────────
  document.addEventListener('DOMContentLoaded', updateNav);

  return { getUser, setUser, logout, isLoggedIn, requireLogin, updateNav };

})();
