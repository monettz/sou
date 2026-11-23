// Demo data store for the portals.
// Everything people do in the portals (notes, messages, attendance, classes,
// approvals, reports, new accounts…) is saved in this browser's localStorage.
// /portal and /admin share it, so a student's note shows up for the teacher,
// a class assigned by a Light admin shows up in the student's calendar, etc.
// Phase 2A swaps this file for the real database; the screens stay the same.

const KEY = 'sou-demo-db-v1';

const fresh = () => ({
  notes: [],            // {id, text, lesson, time, course, written}
  hiddenSeed: [],       // texts of sample notes the student deleted
  noteEdits: {},        // sample-note text -> edited text
  messages: [],         // {from:'student'|'teacher', text, time}
  lessonDone: false,
  purchases: [],        // crash course names
  homework: [],         // {title, course, due}
  quizResult: null,     // {score, total}
  marks: {},            // question -> 'Correct'|'Partly'|'Incorrect'
  diaryComments: [],    // {note, text}
  pending: [],          // items teachers sent for approval {title, kind, by}
  reviewed: {},         // title -> 'approved'|'changes'
  library: [],          // items added to the library by admins {title, kind}
  classes: [],          // {student, teacher, subject, when, len}
  attendance: {},       // student name -> 'p'|'l'|'a'
  teacherStarted: false,
  reports: [],          // {kind, title, to, msg, sent}
  users: [],            // {name, email, role, status}
  userChanges: {},      // name -> {status?, deleted?, name?}
  notifications: [],    // {role:'all'|'student'|'teacher'|'support'|'super', title, sub}
  readNotes: [],        // notification titles marked read
  approvals: {},        // applicant -> 'declined'|'info'
});

let cache = null;

export const db = {
  get() {
    if (cache) return cache;
    try { cache = { ...fresh(), ...(JSON.parse(localStorage.getItem(KEY) || 'null') || {}) }; }
    catch (e) { cache = fresh(); }
    return cache;
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) { /* private mode: keep in memory */ } },
  update(fn) { fn(db.get()); db.save(); },
  reset() { cache = fresh(); try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } },
  notify(role, title, sub) { db.update(d => d.notifications.unshift({ role, title, sub, at: Date.now() })); },
};

// keep other open tabs in step
window.addEventListener('storage', (e) => { if (e.key === KEY) cache = null; });

/* ---------- small UI helpers ---------- */
let toastTimer;
export function toast(msg, kind = 'ok') {
  let el = document.getElementById('sou-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sou-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.dataset.kind = kind;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

export const nowLabel = () => new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
