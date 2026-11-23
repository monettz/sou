// Student portal (/portal): opened from the website's Log in button. Students only.
import './base.css';
import { startPortal } from './runtime.js';

const ROUTES = {
  dashboard: 'Student-Dashboard',
  lesson: 'Student-Lesson',
  'lesson-check': 'Student-Lesson-Quiz',
  homework: 'Student-Quiz',
  diary: 'Student-Diary',
  chat: 'Student-Chat',
  calendar: 'Student-Calendar',
  library: 'Student-Library',
  reports: 'Student-Reports',
  notifications: 'Notifications',
};
const BY_VIEW = Object.fromEntries(Object.entries(ROUTES).map(([slug, view]) => [view, slug]));
const STAFF_HINT = /@studentsoftheummah\.com$/i;

startPortal({
  views: import.meta.glob(['./views/Student-*.dc.html', './views/Login-Student.dc.html', './views/Activate-Account.dc.html', './views/Notifications.dc.html'], { query: '?raw', import: 'default', eager: true }),
  sessionKey: 'sou-student-session',
  linkTo(view) {
    if (view === 'Login-Student') return '#/logout';
    if (view === 'Activate-Account') return '#/activate';
    return '#/' + (BY_VIEW[view] || 'dashboard');
  },
  resolve(path, who) {
    if (path === 'logout') return { logout: true, view: 'Login-Student' };
    if (path === 'activate') return { view: 'Activate-Account' };
    if (path === 'login' || path === '') return who ? { redirect: '#/dashboard' } : { view: 'Login-Student' };
    if (!who) return { redirect: '#/login' };
    if (ROUTES[path]) return { view: ROUTES[path] };
    return { redirect: '#/dashboard' };
  },
  after(view, root, { session, go }) {
    if (view === 'Login-Student') {
      const form = root.querySelector('#login-form');
      const err = root.querySelector('#login-error');
      form.addEventListener('submit', () => {
        const email = root.querySelector('#em').value.trim();
        const pw = root.querySelector('#pw').value;
        const fail = (msg) => { err.textContent = msg; err.hidden = false; };
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Enter the email address SOU sent your invite to.');
        if (!pw) return fail('Enter your password.');
        if (STAFF_HINT.test(email)) return fail('This login is for students. Teachers and staff use the staff portal.');
        session.set({ role: 'student', email });
        go('#/dashboard');
      });
    }
    if (view === 'Activate-Account') {
      root.querySelector('[data-activate]')?.addEventListener('click', () => session.set({ role: 'student', email: 'new.student@example.com' }));
    }
    if (view === 'Notifications') {
      root.querySelectorAll('[data-role]').forEach(el => { el.hidden = el.dataset.role !== 'student'; });
      const t = root.querySelector('#notif-title'); if (t) t.textContent = 'My notifications';
    }
  },
});
