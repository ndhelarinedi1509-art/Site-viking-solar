/**
 * Viking Solar Admin Dashboard
 * SPA Routing & Mock Logic
 */

const app = {
  // Elements
  loginWrapper: document.getElementById('loginWrapper'),
  loginForm: document.getElementById('loginForm'),
  appContainer: document.getElementById('appContainer'),
  navItems: document.querySelectorAll('.nav-item'),
  views: document.querySelectorAll('.view'),
  btnLogout: document.getElementById('btnLogout'),
  topbarTitle: document.getElementById('topbarTitle'),
  toast: document.getElementById('toast'),

  init() {
    this.checkAuth();
    this.bindEvents();
  },

  bindEvents() {
    // Login
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = this.loginForm.querySelector('.btn-login');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Vérification...';
        btn.style.opacity = '0.8';

        // Simulate network request
        setTimeout(() => {
          localStorage.setItem('viking_admin_auth', 'true');
          btn.innerHTML = originalText;
          btn.style.opacity = '1';
          this.checkAuth();
        }, 800);
      });
    }

    // Logout
    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', () => {
        localStorage.removeItem('viking_admin_auth');
        this.checkAuth();
      });
    }

    // Navigation (SPA Routing)
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        
        // Update active nav
        this.navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Update topbar title
        this.topbarTitle.textContent = item.textContent.trim();

        // Show target view
        this.views.forEach(view => {
          if (view.id === targetId) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
      });
    });
  },

  checkAuth() {
    const isAuth = localStorage.getItem('viking_admin_auth');
    if (isAuth === 'true') {
      this.loginWrapper.style.opacity = '0';
      this.loginWrapper.style.visibility = 'hidden';
      this.appContainer.classList.add('active');
    } else {
      this.appContainer.classList.remove('active');
      this.loginWrapper.style.visibility = 'visible';
      this.loginWrapper.style.opacity = '1';
    }
  },

  showToast(message, duration = 3000) {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    
    this.toast.textContent = message;
    this.toast.classList.add('show');
    
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, duration);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
