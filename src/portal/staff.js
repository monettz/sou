// Staff portal (/admin): teachers, Light admins and the Super admin.
// Not linked from the public website.
import './base.css';
import { startPortal } from './runtime.js';

const ROUTES = {
  teacher: 'Teacher-Dashboard',
  'teacher/students': 'Teacher-Students',
  'teacher/student': 'Teacher-Student-Profile',
  'teacher/homework': 'Teacher-Quiz-Builder',
  'teacher/courses': 'Teacher-Courses',
  'teacher/chat': 'Teacher-Chat',
  'teacher/calendar': 'Teacher-Calendar',
  support: 'Support-Dashboard',
  'support/view': 'Support-View-As',
  'support/students': 'Support-Students',
  'support/teachers': 'Support-Teachers',
  'support/chats': 'Support-Chats',
  'support/help': 'Support-Help',
  'support/calendar': 'Support-Calendar',
  'support/courses': 'Support-Course-Approvals',
  'support/attendance': 'Support-Attendance',
  'support/reports': 'Support-Reports',
  'support/create-login': 'Support-Create-Login',
  super: 'Admin-Dashboard',
  'super/approvals': 'Admin-Approvals',
  'super/users': 'Admin-Users',
  'super/create-staff': 'Admin-Create-Staff',
  'super/activity': 'Admin-Activity',
  'super/view': 'Admin-View-Portal',
  'super/payments': 'Admin-Payments',
  'super/settings': 'Admin-Settings',
  notifications: 'Notifications',
  // staff can preview what students see (read-only screens)
  'preview/dashboard': 'Student-Dashboard',
  'preview/courses': 'Student-Courses',
  'preview/lesson': 'Student-Lesson',
  'preview/lesson-check': 'Student-Lesson-Quiz',
  'preview/homework': 'Student-Quiz',
  'preview/diary': 'Student-Diary',
  'preview/chat': 'Student-Chat',
  'preview/calendar': 'Student-Calendar',
  'preview/library': 'Student-Library',
  'preview/reports': 'Student-Reports',
};
const BY_VIEW = Object.fromEntries(Object.entries(ROUTES).map(([slug, view]) => [view, slug]));
const HOME = { teacher: '#/teacher', support: '#/support', super: '#/super' };

// which route areas each role may open
const ALLOWED = {
  teacher: ['teacher', 'notifications', 'preview'],
  support: ['support', 'teacher', 'notifications', 'preview'],
  super: ['super', 'support', 'teacher', 'notifications', 'preview'],
};
const area = (path) => path.split('/')[0];

const SUPER_VIEWS = import.meta.glob(['./views/*.dc.html', '!./views/Login-Student.dc.html'], { query: '?raw', import: 'default', eager: true });

startPortal({
  views: SUPER_VIEWS,
  sessionKey: 'sou-staff-session',
  homeView: (who) => ({ teacher: 'Teacher-Dashboard', support: 'Support-Dashboard', super: 'Admin-Dashboard' })[who?.role],
  linkTo(view) {
    if (view === 'Login-Staff' || view === 'Login-Student') return '#/logout';
    if (view === 'Activate-Account') return '#/activate';
    return BY_VIEW[view] ? '#/' + BY_VIEW[view] : '#/';
  },
  resolve(path, who) {
    if (path === 'logout') return { logout: true, view: 'Login-Staff' };
    if (path === 'activate') return { view: 'Activate-Account' };
    if (path === 'login' || path === '') return who ? { redirect: HOME[who.role] } : { view: 'Login-Staff' };
    if (!who) return { redirect: '#/login' };
    if (!ROUTES[path] || !ALLOWED[who.role].includes(area(path))) return { redirect: HOME[who.role] };
    return { view: ROUTES[path] };
  },
  after(view, root, { session, go, who }) {
    // the Super admin opens the shared school pages (calendar, attendance, chats, courses, reports)
    // from their own menu and keeps that menu, unless they chose "View any portal" to see the Light admin's
    if (view.startsWith('Admin-')) { try { sessionStorage.removeItem('sou-viewing-as'); } catch (e) { /* ignore */ } }
    let viewingAs = null; try { viewingAs = sessionStorage.getItem('sou-viewing-as'); } catch (e) { /* ignore */ }
    if (view.startsWith('Support-') && who()?.role === 'super' && viewingAs) {
      const bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:14px;background:#2B2B2B;color:#FFF7EF;font:700 14px/1.3 Nunito,system-ui,sans-serif';
      bar.innerHTML = '<span>You are viewing the Light admin portal · read-only, logged</span><a href="#/super" data-wired="1" style="color:#D6B98C;font-weight:800">Back to Super admin</a>';
      root.querySelector('.main')?.prepend(bar);
    }
    if (view.startsWith('Support-') && who()?.role === 'super' && !viewingAs) {
      const src = SUPER_VIEWS['./views/Admin-Dashboard.dc.html'] || '';
      const m = src.match(/<aside class="side">([\s\S]*?)<\/aside>/);
      const side = root.querySelector('.side');
      if (m && side) {
        const toggle = side.querySelector('.menu-toggle');
        side.innerHTML = m[1];
        side.querySelectorAll('a[href]').forEach(a => {
          const v = (a.getAttribute('href').match(/^([A-Za-z-]+)\.dc\.html$/) || [])[1];
          if (v) a.setAttribute('href', v === 'Login-Staff' ? '#/logout' : '#/' + (BY_VIEW[v] || ''));
          a.classList.toggle('on', a.getAttribute('href') === location.hash);
        });
        if (toggle) side.appendChild(toggle);
      }
    }
    if (view === 'Login-Staff') {
      const step1 = root.querySelector('#staff-step1');
      const step2 = root.querySelector('#staff-step2');
      const err = root.querySelector('#staff-error');
      let pending = null;
      step2.addEventListener('submit', () => {
        if (!pending) { step1.querySelector('input')?.focus(); return; }
        const code = [...step2.querySelectorAll('.code')].map(i => i.value).join('');
        if (!/^\d{6}$/.test(code)) { step2.querySelector('.code')?.focus(); return; }
        session.set(pending);
        go(HOME[pending.role]);
      });
      step1.addEventListener('submit', () => {
        const email = root.querySelector('#se').value.trim();
        const pw = root.querySelector('#sp').value;
        const fail = (msg) => { err.textContent = msg; err.hidden = false; };
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Enter your SOU work email.');
        if (!pw) return fail('Enter your password.');
        err.hidden = true;
        // Demo only: the role comes from the database once accounts are connected.
        const role = /^(admin|founder|yasmine)@/i.test(email) ? 'super' : /^support@/i.test(email) ? 'support' : 'teacher';
        pending = { role, email };
        if (role === 'teacher') { session.set(pending); go(HOME.teacher); return; }
        step1.hidden = true; // one step at a time
        step2.hidden = false;
        step2.querySelector('.code')?.focus();
      });
      // move between the 6 code boxes as people type
      step2.querySelectorAll('.code').forEach((box, i, all) => box.addEventListener('input', () => { box.value = box.value.replace(/\D/g, '').slice(0, 1); if (box.value && all[i + 1]) all[i + 1].focus(); }));
      root.querySelectorAll('[data-demo-role]').forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        session.set({ role: a.dataset.demoRole, email: 'demo@studentsoftheummah.com' });
        go(HOME[a.dataset.demoRole]);
      }));
    }
    if (view === 'Notifications') {
      const role = who()?.role;
      root.querySelectorAll('[data-role]').forEach(el => { el.hidden = el.dataset.role !== role; });
      const t = root.querySelector('#notif-title'); if (t) t.textContent = 'Notifications';
    }
  },
});
