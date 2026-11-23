// Makes every button and form in the portal screens do its job.
// Data is kept in the demo store (store.js), shared by /portal and /admin.
import { db, toast, nowLabel } from './store.js';

const $ = (sel, r) => r.querySelector(sel);
const $$ = (sel, r) => [...r.querySelectorAll(sel)];
const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
// find a button or link by the start of its label
const byText = (root, start, sel = 'button, a') => $$(sel, root).filter(el => txt(el).toLowerCase().startsWith(start.toLowerCase()));
const on = (els, fn) => [].concat(els).filter(Boolean).forEach(el => { el.dataset.wired = '1'; el.addEventListener('click', (e) => { if (el.tagName === 'A' || el.type === 'submit') e.preventDefault(); fn(e, el); }); });
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pickFile = (accept) => new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; if (accept) i.accept = accept; i.onchange = () => res(i.files[0] || null); i.click(); });
function download(name, content, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const selText = (el) => el ? (el.tagName === 'SELECT' ? txt(el.selectedOptions[0]) : el.value.trim()) : '';

/* ======================= generic behaviours ======================= */

// filter chips: one selected per group, and they filter the lists on the page when they can
function chipGroups(root) {
  $$('[role="group"], [role="radiogroup"], [role="tablist"]', root).forEach(group => {
    const chips = $$(':scope > button', group);
    if (!chips.length || group.closest('.seg') || group.getAttribute('aria-label') === '6-digit code') return;
    chips.forEach(chip => {
      if (chip.dataset.wired || chip.dataset.dcEv !== undefined) return;
      on(chip, () => {
        chips.forEach(c => { const sel = c === chip; c.classList.toggle('on', sel); if (c.hasAttribute('aria-checked')) c.setAttribute('aria-checked', sel); if (c.hasAttribute('aria-pressed')) c.setAttribute('aria-pressed', sel); });
        if (chip.dataset.custom) return;
        filterBy(root, chip);
      });
    });
  });
}
const LIST_ITEMS = 'tbody tr, .note, .item, .offer, .conv, .req, .ev, .rep, .member';
function filterBy(root, chip) {
  const label = txt(chip).split('·')[0].trim();
  const items = $$(LIST_ITEMS, root);
  if (!items.length) return;
  if (/^(all|everything|everyone)\b/i.test(label)) { items.forEach(i => { i.style.display = ''; }); return; }
  const keys = [label, label.replace(/s$/i, ''), label.split(' ').pop()].map(k => k.toLowerCase()).filter(k => k.length > 2);
  const test = /needs attention/i.test(label)
    ? (i) => !!$('.warn', i)
    : (i) => { const t = (i.dataset.course || '') + ' ' + txt(i).toLowerCase(); return keys.some(k => t.includes(k)); };
  if (!items.some(test)) return; // nothing to filter on (e.g. period chips)
  items.forEach(i => { i.style.display = test(i) ? '' : 'none'; });
}

// search boxes filter the lists on the page
function searchBoxes(root) {
  $$('input[placeholder]', root).filter(i => /^(search|find)/i.test(i.placeholder)).forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      $$(LIST_ITEMS, root).forEach(i => { i.style.display = !q || txt(i).toLowerCase().includes(q) ? '' : 'none'; });
    });
  });
}

// anything still not wired gives honest feedback instead of doing nothing
function fallback(root) {
  $$('button, a[href="#"]', root).forEach(el => {
    if (el.dataset.wired || el.dataset.dcEv !== undefined || el.dataset.demoRole || el.hasAttribute('data-activate') || el.classList.contains('menu-toggle') || el.type === 'submit' || el.closest('form#login-form, form#staff-step1, form#staff-step2')) return;
    if (el.closest('[role="group"], [role="radiogroup"], .seg')) return;
    const label = txt(el) || el.getAttribute('aria-label') || 'Done';
    on(el, () => toast(`${label}: done`));
  });
}

/* ======================= notifications ======================= */
function renderNotifications(root, role) {
  const d = db.get();
  $$('[data-role]', root).forEach(col => {
    const r = col.dataset.role;
    const mine = d.notifications.filter(n => n.role === 'all' || n.role === r);
    const tpl = $('.n.new', col) || $('.n', col);
    const head = $('.head', col);
    mine.slice().reverse().forEach(n => {
      const el = tpl.cloneNode(true);
      el.classList.add('new');
      el.classList.toggle('crash', /crash course/i.test(n.title));
      $('b', el).textContent = n.title; $('small', el).textContent = n.sub || '';
      head.after(el);
    });
    $$('.n', col).forEach(el => {
      if (d.readNotes.includes(txt($('b', el)))) el.classList.remove('new');
      el.style.cursor = 'pointer';
      el.tabIndex = 0;
      el.addEventListener('click', () => { el.classList.remove('new'); db.update(x => { const t = txt($('b', el)); if (!x.readNotes.includes(t)) x.readNotes.push(t); }); count(); });
    });
    const count = () => { const c = $('.count', col); if (c) c.textContent = $$('.n.new', col).length; };
    count();
  });
  const markAll = document.createElement('button');
  markAll.type = 'button'; markAll.textContent = 'Mark all as read';
  markAll.style.cssText = 'align-self:flex-start;min-height:44px;padding:0 18px;border-radius:999px;border:2px solid #2B2B2B;background:transparent;font:800 14px/1 Nunito,sans-serif;cursor:pointer';
  $('#notif-title', root)?.parentElement.appendChild(markAll);
  on(markAll, () => { $$('[data-role]:not([hidden]) .n', root).forEach(n => n.click()); toast('All notifications marked as read'); });
}

/* ======================= per-screen behaviours ======================= */
const SAMPLE_NOTE_LESSON = 'Module 2 · L3';

const screens = {
  /* ---------- logins ---------- */
  'Login-Student'(root) { on(byText(root, 'Forgot password'), () => { const em = $('#em', root).value.trim(); toast(em ? `A reset link has been sent to ${em}` : 'Enter your email first, then press Forgot password'); }); },
  'Login-Staff'(root) { on(byText(root, 'Forgot password'), () => { const em = $('#se', root).value.trim(); toast(em ? `A reset link has been sent to ${em}` : 'Enter your work email first'); }); },
  'Activate-Account'(root) {
    on(byText(root, 'Set my password'), () => $('#p1', root)?.focus());
    const p1 = $('#p1', root), p2 = $('#p2', root), act = $('[data-activate]', root);
    if (p1) { p1.value = ''; p2.value = ''; }
    act?.addEventListener('click', (e) => {
      if (!p1.value || p1.value.length < 8 || !/\d/.test(p1.value)) { e.preventDefault(); e.stopImmediatePropagation(); toast('Use at least 8 characters including a number', 'err'); p1.focus(); return; }
      if (p1.value !== p2.value) { e.preventDefault(); e.stopImmediatePropagation(); toast('The two passwords do not match', 'err'); p2.focus(); return; }
      if (!$('#tc', root).checked) { e.preventDefault(); e.stopImmediatePropagation(); toast('Please accept the terms to continue', 'err'); }
    }, true);
  },

  /* ---------- student ---------- */
  'Student-Dashboard'(root, ctx) {
    const d = db.get();
    const courses = byText(root, 'My courses', 'h2')[0]?.nextElementSibling;
    d.purchases.forEach(name => {
      const card = courses?.firstElementChild?.cloneNode(true); if (!card) return;
      $('.chip', card).textContent = 'Crash course';
      $('b', card).textContent = name;
      $('.small', card).textContent = 'Purchased · 0 of 15 lessons';
      $('.bar i', card).style.width = '0%';
      courses.appendChild(card);
    });
    const hwHead = byText(root, 'Homework', 'h2')[0]?.parentElement;
    d.homework.forEach(h => {
      const row = hwHead?.nextElementSibling?.cloneNode(true); if (!row) return;
      $('b', row).textContent = h.title; $('.small', row).textContent = `${h.course} · due ${h.due} · new`;
      hwHead.after(row);
    });
    if (d.quizResult) { const r = byText(root, 'Quiz: Letters that join', 'b')[0]?.closest('.row'); if (r) { $('.small', r).textContent = `Arabic · submitted · ${d.quizResult.score}/${d.quizResult.total} multiple-choice`; const b = $('a.btn', r); if (b) b.textContent = 'Review'; } }
    if (d.lessonDone) { const s = byText(root, 'You stopped at', 'span')[0]; if (s) s.textContent = 'Lesson 3 complete · next: Lesson 4'; }
    on(byText(root, 'Join on Google Meet'), () => toast('The Google Meet link opens 10 minutes before class (Monday 7:00 PM)'));
    on(byText(root, 'Manage payment card'), () => toast('Your card ending 4242 is used for auto-pay. You can change it from here once payments are live.'));
  },

  'Student-Lesson'(root) {
    const d = db.get();
    const list = $('.note', root)?.parentElement;
    const tpl = $('.note', root);
    const addNote = (n) => { const el = tpl.cloneNode(true); $('.time', el).textContent = n.time; $('span', el).textContent = n.text; list.insertBefore(el, list.firstElementChild); };
    d.notes.filter(n => n.lesson === SAMPLE_NOTE_LESSON).forEach(addNote);
    $$('.note', root).forEach(n => { const t = txt($('span', n)); if (d.hiddenSeed.includes(t)) n.remove(); else if (d.noteEdits[t]) $('span', n).textContent = d.noteEdits[t]; });
    const ta = $('#nt', root);
    on(byText(root, 'Save note'), () => {
      const text = ta.value.trim(); if (!text) { toast('Write your note first', 'err'); ta.focus(); return; }
      const n = { id: Date.now(), text, lesson: SAMPLE_NOTE_LESSON, time: '04:35', course: 'Arabic', written: nowLabel() };
      db.update(x => x.notes.unshift(n)); addNote(n); ta.value = '';
      toast('Note saved at 04:35 · you will find it in your Diary');
    });
    const done = byText(root, 'Mark as complete')[0];
    const setDone = () => { if (!done) return; done.textContent = 'Completed'; done.disabled = true; const row = byText(root, 'Lesson 3 · Joining', '.les')[0]; if (row) { const dot = $('.dot', row); dot.classList.add('done'); dot.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'; $('.small', row).textContent = 'Done'; } };
    if (d.lessonDone) setDone();
    on(done, () => { db.update(x => { x.lessonDone = true; }); setDone(); toast('Lesson 3 marked as complete · progress updated'); });
    on(byText(root, 'Download worksheet'), () => { download('joining-the-letters-worksheet.txt', 'SOU · Arabic Beginners · Module 2, Lesson 3: Joining the letters\n\n1. Join: ب + ت + ث\n2. Write the word "book" (كتاب)\n3. Circle the letters that never join forward: ا د ذ ر ز و\n'); toast('Worksheet downloaded'); });
    const pause = $('button[aria-label="Pause"], button[aria-label="Play"]', root);
    on(pause, () => { const playing = pause.getAttribute('aria-label') === 'Pause'; pause.setAttribute('aria-label', playing ? 'Play' : 'Pause'); pause.innerHTML = playing ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>'; });
  },

  'Student-Diary'(root) {
    const d = db.get();
    const notes = $$('.note', root);
    const list = notes[0]?.parentElement;
    // tag every note with its course so the filter chips work
    let course = 'arabic';
    [...list.children].forEach(el => { if (el.matches('span.small')) course = /qur/i.test(txt(el)) ? "qur'an" : 'arabic'; else if (el.matches('.note')) el.dataset.course = course; });
    const tpl = notes[1] || notes[0];
    d.notes.forEach(n => {
      const el = tpl.cloneNode(true); el.classList.remove('sel'); el.dataset.course = 'arabic'; el.dataset.id = n.id;
      $('.jump', el).lastChild.textContent = n.time; $('b', el).textContent = n.text; $('.small', el).textContent = `Written ${n.written}`;
      $('.chip', el)?.remove();
      list.firstElementChild.after(el);
    });
    $$('.note', root).forEach(el => {
      const b = $('b', el); const orig = txt(b);
      if (!el.dataset.id) { if (d.hiddenSeed.includes(orig)) { el.remove(); return; } if (d.noteEdits[orig]) b.textContent = d.noteEdits[orig]; }
      on($('[aria-label="Delete note"]', el), () => {
        if (!confirm('Delete this note?')) return;
        db.update(x => { if (el.dataset.id) x.notes = x.notes.filter(n => String(n.id) !== el.dataset.id); else x.hiddenSeed.push(orig); });
        el.remove(); toast('Note deleted');
      });
      on($('[aria-label="Edit note"]', el), () => {
        b.contentEditable = 'true'; b.focus(); document.getSelection().selectAllChildren(b);
        b.addEventListener('blur', () => {
          b.contentEditable = 'false'; const t = txt(b); if (!t) return;
          db.update(x => { if (el.dataset.id) { const n = x.notes.find(n => String(n.id) === el.dataset.id); if (n) n.text = t; } else x.noteEdits[orig] = t; });
          toast('Note updated');
        }, { once: true });
      });
      $$('.jump', el).forEach(j => j.addEventListener('click', () => {}));
    });
  },

  'Student-Quiz'(root) {
    // a started quiz must be finished before leaving it
    root.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || !root.querySelector('main[data-inprogress="true"]')) return;
      e.preventDefault(); e.stopPropagation();
      toast('Finish the quiz first · once started it must be completed', 'err');
    }, true);
    const submit = byText(root, 'Submit quiz')[0];
    submit?.addEventListener('click', () => setTimeout(() => {
      const m = txt(document.querySelector('#app')).match(/(\d) \/ 3/);
      if (m) { db.update(x => { x.quizResult = { score: +m[1], total: 3 }; }); db.notify('teacher', 'Quiz submitted: Letters that join', `Aisha Rahman · ${m[1]}/3 · 1 written answer to mark`); toast('Quiz submitted · saved to your progress'); }
    }, 60));
  },

  'Student-Chat'(root) { chat(root, 'student'); },
  'Teacher-Chat'(root) { chat(root, 'teacher'); },

  'Student-Calendar'(root) {
    calendarClasses(root, 'student');
    let week = 0;
    const sub = byText(root, 'Week of', 'span')[0];
    const days = $$('.day', root);
    const base = new Date(2026, 10, 24);
    const draw = () => {
      days.forEach((dEl, i) => { const dt = new Date(base); dt.setDate(base.getDate() + week * 7 + i); $('.dh b', dEl).textContent = dt.getDate(); dEl.classList.toggle('today', week === 0 && i === 0); $$('.hw', dEl).forEach(h => { h.style.display = week === 0 ? '' : 'none'; }); });
      const a = new Date(base); a.setDate(base.getDate() + week * 7); const b = new Date(a); b.setDate(a.getDate() + 6);
      const f = (x) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
      if (sub) sub.textContent = `Week of ${f(a)} – ${f(b)} · your classes, homework due dates and events`;
    };
    on($('[aria-label="Previous week"]', root), () => { week--; draw(); });
    on($('[aria-label="Next week"]', root), () => { week++; draw(); });
    on(byText(root, 'Today'), () => { week = 0; draw(); });
    on(byText(root, 'Join on Google Meet'), () => toast('The Join button opens Google Meet 10 minutes before class (today 6:00 PM)'));
    on(byText(root, 'Manage connection'), () => toast('Google Calendar is connected to aisha.r@example.com'));
    $$('.ev', root).forEach(ev => { ev.addEventListener('click', (e) => { if (ev.classList.contains('hw')) return; e.preventDefault(); toast(`${txt($('b', ev))} · ${txt(ev).replace(txt($('b', ev)), '').trim()}`); }); });
  },

  'Student-Library'(root, ctx) {
    const d = db.get();
    const sections = $$('h2.h2', root).map(h => h.parentElement);
    $$('[role="group"] button', root).forEach(c => { c.dataset.custom = '1'; c.addEventListener('click', () => {
      const t = txt(c).toLowerCase();
      sections.forEach(s => { const h = txt($('h2', s)).toLowerCase(); s.style.display = t.startsWith('everything') || (t.startsWith('books') && h.startsWith('books')) || (t.startsWith('videos') && h.startsWith('videos')) || (t.startsWith('crash') && h.startsWith('crash')) ? '' : 'none'; });
    }); });
    // items added by admins
    const books = $('.grid', sections.find(s => /^books/i.test(txt($('h2', s)))) || root);
    d.library.forEach(item => { const el = books?.firstElementChild?.cloneNode(true); if (!el) return; $('.cover', el).textContent = item.title.slice(0, 18); $('b', el).textContent = item.title; $('.small', el).textContent = `${item.kind} · added by SOU`; books.appendChild(el); });
    $$('.item', root).forEach(it => on(it, () => { const t = txt($('b', it)); if ($('.tag', it)) { download(`${t.replace(/\W+/g, '-').toLowerCase()}.txt`, `${t}\n\nSOU Library (demo copy)`); toast(`${t} downloaded`); } else { toast(`Playing: ${t}`); } }));
    const buy = (name, btn) => {
      if (d.purchases.includes(name)) { toast(`${name} is already in My courses`); return; }
      if (!confirm(`Buy the crash course "${name}" for £300?\n\n(Demo: no payment is taken.)`)) return;
      db.update(x => { x.purchases.push(name); }); db.notify('super', `Crash course bought: ${name}`, 'Aisha Rahman · £300');
      btn.textContent = 'In My courses'; toast(`${name} added to My courses`);
    };
    $$('.offer', root).forEach(o => { const name = txt($('b', o)); const b = byText(o, 'Buy now')[0]; if (d.purchases.includes(name) && b) b.textContent = 'In My courses'; on(b, () => buy(name, b)); });
    const banner = byText(root, 'Buy now')[0];
    on(banner, () => buy('Fiqh of prayer', banner));
    on(byText(root, 'See details'), () => toast('Fiqh of prayer · 15 live lessons with Ustadha Hafssa B · starts Monday 2 December'));
  },

  'Student-Reports'(root) {
    const d = db.get();
    const list = $('.rep', root)?.parentElement;
    const art = $('article', root);
    d.reports.forEach(r => { const el = $('.rep', root).cloneNode(true); el.classList.remove('sel'); $('.tag', el).textContent = r.kind; $('b', el).textContent = r.title; $('.small', el).textContent = `From SOU Support · ${r.sent}`; el.dataset.msg = r.msg || ''; list.insertBefore(el, list.firstElementChild); });
    $$('.rep', root).forEach(el => on(el, () => {
      $$('.rep', root).forEach(x => x.classList.toggle('sel', x === el));
      const h = $('h2', art); h.textContent = `Aisha Rahman · ${txt($('b', el))}`;
      const kind = $('span.small', art); if (kind) kind.textContent = txt($('.tag', el)).toUpperCase();
      if (el.dataset.msg) toast(el.dataset.msg);
    }));
    on(byText(root, 'Download PDF'), () => window.print());
  },

  'Notifications'(root, ctx) {
    const role = ctx.who()?.role;
    renderNotifications(root, role);
    const home = { student: '#/dashboard', teacher: '#/teacher', support: '#/support', super: '#/super' }[role] || '#/';
    const back = document.createElement('a');
    back.href = home; back.className = 'back-link'; back.dataset.wired = '1';
    back.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>Back to dashboard';
    root.firstElementChild?.firstElementChild?.before(back);
  },

  /* ---------- teacher ---------- */
  'Teacher-Dashboard'(root) {
    const d = db.get();
    const p = d.pending.filter(x => !d.reviewed[x.title]).length;
    if (p) { const c = byText(root, 'Arabic for travellers', 'b')[0]?.parentElement; c?.insertAdjacentHTML('afterend', `<div style="display:flex;justify-content:space-between;gap:10px;font-size:14px"><b>${p} item(s) you sent</b><span style="display:inline-flex;padding:3px 9px;border-radius:999px;background:#F7E7CE;color:#6E583C;font:700 12px/1.2 Nunito,sans-serif">Waiting for approval</span></div>`); }
    Object.entries(d.reviewed).forEach(([t, s]) => { const tag = byText(root, t, 'b')[0]?.nextElementSibling; if (tag) tag.textContent = s === 'approved' ? 'Live' : 'Changes requested'; });
  },

  'Teacher-Student-Profile'(root) {
    const d = db.get();
    const marks = $$('button', byText(root, 'Mark this answer', 'span')[0]?.closest('form') || root).filter(b => /^(Correct|Partly|Incorrect)/.test(txt(b)));
    const setMark = (m) => { marks.forEach(b => b.classList.toggle('p', txt(b).startsWith(m))); const tag = byText(root, 'Written answer to mark', '.tag')[0] || byText(root, 'Marked', '.tag')[0]; if (tag) { tag.textContent = `Marked · ${m}`; tag.className = 'tag ok'; } };
    if (d.marks.q4) setMark(d.marks.q4);
    marks.forEach(b => on(b, () => { const m = txt(b).split(' ')[0]; db.update(x => { x.marks.q4 = m; }); setMark(m); toast(`Q4 marked ${m.toLowerCase()} · Aisha's score is updated`); }));
    const tpl = $('.note', root); const list = tpl?.parentElement;
    d.notes.forEach(n => { const el = tpl.cloneNode(true); $('.time', el).textContent = `${n.lesson} · ${n.time}`; $('span', el).textContent = n.text; $$('button, .chip', el).forEach(x => x.remove()); el.insertAdjacentHTML('beforeend', '<span style="font:700 12px/1.2 Nunito,sans-serif;color:#2F6B3D">New</span>'); list.insertBefore(el, tpl); });
    d.diaryComments.forEach(c => { const n = byText(root, c.note, '.note span')[0]?.closest('.note'); n?.insertAdjacentHTML('beforeend', `<span class="chip" style="align-self:flex-start;background:#EEF5EF;color:#2F6B3D">You replied: "${esc(c.text)}"</span>`); });
    $$('.note', root).forEach(n => { const b = byText(n, 'Add a comment', 'button')[0]; on(b, () => { const t = prompt('Your comment for Aisha:'); if (!t) return; const note = txt($('span', n)); db.update(x => x.diaryComments.push({ note, text: t })); b.insertAdjacentHTML('afterend', `<span class="chip" style="align-self:flex-start;background:#EEF5EF;color:#2F6B3D">You replied: "${esc(t)}"</span>`); b.remove(); toast('Comment added to Aisha\'s diary'); }); });
    const cm = $('#cm', root); cm?.addEventListener('change', () => toast('Comment saved'));
  },

  'Teacher-Calendar'(root) {
    calendarClasses(root, 'teacher');
    const d = db.get();
    $$('.seg', root).forEach(seg => {
      const name = seg.getAttribute('aria-label');
      const btns = $$('button', seg); const cls = ['p', 'l', 'a'];
      const set = (i) => btns.forEach((b, j) => { b.classList.remove('p', 'l', 'a'); if (j === i) b.classList.add(cls[j]); b.setAttribute('aria-pressed', j === i); });
      if (d.attendance[name]) set(cls.indexOf(d.attendance[name]));
      btns.forEach((b, i) => on(b, () => set(i)));
    });
    on(byText(root, 'Save attendance'), () => {
      const a = {}; $$('.seg', root).forEach(seg => { const b = $('button.p, button.l, button.a', seg); a[seg.getAttribute('aria-label')] = b ? [...b.classList].find(c => ['p', 'l', 'a'].includes(c)) : 'p'; });
      db.update(x => { x.attendance = a; });
      const absent = Object.entries(a).filter(([, v]) => v === 'a').map(([k]) => k);
      absent.forEach(n => db.notify('support', `${n} was absent`, 'Arabic Beginners · today 4:00 PM'));
      toast('Attendance saved · Light admins can see it');
    });
    on(byText(root, 'Start on Google Meet'), () => { db.update(x => { x.teacherStarted = true; }); toast('Class started · your attendance is recorded. Google Meet opens in a new tab once Google Workspace is connected.'); });
  },

  'Teacher-Quiz-Builder'(root, ctx) {
    const qWrap = byText(root, 'Questions', 'h2')[0]?.closest('.card');
    const adders = $$('button.add', root);
    adders.forEach(b => on(b, () => {
      const kind = txt(b).replace('+ ', '');
      const n = $$('.q', qWrap).length + 1;
      const q = document.createElement('div'); q.className = 'q';
      q.innerHTML = `<span class="chip" style="align-self:flex-start">${n} · ${esc(kind)}</span><label class="field">Question<input placeholder="Type the question" style="font:400 15px/1.4 Poppins,sans-serif;border:1px solid #CDB48D;border-radius:12px;padding:11px 14px;min-height:46px;box-sizing:border-box"></label>${kind === 'Multiple choice' ? '<span class="small">Add 4 options and tick the right one after saving.</span>' : ''}<button type="button" style="align-self:flex-start;border:0;background:none;color:#8E2F1F;font:700 13px/1 Nunito,sans-serif;cursor:pointer;min-height:36px">Remove question</button>`;
      b.parentElement.before(q); $('input', q).focus();
      on($('button', q), () => q.remove());
      const cnt = byText(root, '4 questions', 'span')[0] || $('.small', qWrap); if (cnt) cnt.textContent = `${$$('.q', qWrap).length} questions`;
    }));
    on(byText(root, 'Save draft'), () => toast('Draft saved'));
    const show = $('#qs', root);
    if (show) { show.checked = db.get().showAnswers !== false; show.addEventListener('change', () => { db.update(x => { x.showAnswers = show.checked; }); toast(show.checked ? 'Students will see the right answers after submitting' : 'Students will only see right / wrong, not the answers'); }); }
    on(byText(root, 'Preview as student'), () => ctx.go(ctx.linkTo('Student-Lesson-Quiz')));
    on(byText(root, 'Publish to students'), () => {
      const title = $('#qt', root).value.trim() || 'New quiz';
      db.update(x => x.homework.unshift({ title, course: selText($('#qc', root)).split(' ')[0] || 'Arabic', due: $('#qd', root).value || 'soon' }));
      db.notify('student', `New homework: ${title}`, `${selText($('#qc', root))} · due ${$('#qd', root).value}`);
      toast(`"${title}" published · students are notified`);
    });
    const drop = byText(root, 'Drop a video', 'b')[0]?.parentElement;
    if (drop) { drop.style.cursor = 'pointer'; drop.tabIndex = 0; drop.setAttribute('role', 'button'); on(drop, async () => { const f = await pickFile('video/*,.pdf'); if (!f) return; $('b', drop).textContent = `${f.name} · ready`; toast(`${f.name} uploaded to Lesson 4`); }); }
    const tag = byText(root, 'Lesson 4 · Draft', 'span')[0];
    const d = db.get();
    if (d.pending.some(p => p.title === 'Lesson 4: Letters that never join (new upload)') && tag) tag.textContent = 'Lesson 4 · Waiting for approval';
    on(byText(root, 'Submit for approval'), () => {
      const title = 'Lesson 4: Letters that never join (new upload)';
      db.update(x => { if (!x.pending.some(p => p.title === title)) x.pending.push({ title, kind: 'Lesson', by: 'Ustadha Hanan' }); });
      db.notify('support', 'Course waiting for approval', `${title} · Ustadha Hanan`);
      if (tag) tag.textContent = 'Lesson 4 · Waiting for approval';
      toast('Sent to SOU for approval · it goes live once a Light admin approves it');
    });
  },

  /* ---------- light admin ---------- */
  'Support-Dashboard'(root) {
    const d = db.get();
    const pend = d.pending.filter(x => !d.reviewed[x.title]).length;
    const stat = byText(root, 'Courses to approve', 'span')[0]?.nextElementSibling; if (stat && pend) stat.textContent = 2 + pend;
  },

  'Support-View-As'(root, ctx) {
    const edit = byText(root, 'Edit details')[0];
    on(edit, () => {
      const vals = $$('.kv b', root).slice(0, 2);
      const editing = edit.textContent.startsWith('Save');
      vals.forEach(v => { v.contentEditable = editing ? 'false' : 'true'; v.style.outline = editing ? '' : '2px dashed #CDB48D'; });
      edit.textContent = editing ? 'Edit details' : 'Save details';
      if (!editing) vals[0]?.focus(); else toast('Details saved');
    });
  },

  'Support-Calendar'(root) {
    const d = db.get();
    const ghost = $('.ev.new', root);
    const fill = (c) => { if (!ghost) return; ghost.classList.remove('new'); ghost.classList.add('h'); ghost.innerHTML = `<b>${esc(c.subject)} · ${esc(c.student.split(' (')[0])}</b><br>${esc(c.teacher.replace('Ustadha ', ''))} · ${esc(c.when)}`; };
    if (d.classes.length) fill(d.classes[d.classes.length - 1]);
    const go = byText(root, 'Add to calendar')[0];
    on(go, () => {
      const c = { student: selText($('#c1', root)), teacher: selText($('#c2', root)), subject: selText($('#c3', root)), when: $('#c4', root).value.trim() || 'Tue 7:00 PM', len: selText($('#c5', root)), repeat: selText($('#c6', root)) };
      db.update(x => x.classes.push(c));
      db.notify('student', 'New class added to your calendar', `${c.subject} with ${c.teacher} · ${c.when} · Google Meet`);
      db.notify('teacher', 'New class assigned to you', `${c.student} · ${c.when} · ${c.repeat.toLowerCase()}`);
      fill(c);
      toast(`Class added · ${c.teacher} and ${c.student.split(' (')[0]} have been notified`);
    });
  },

  'Support-Course-Approvals'(root) {
    const d = db.get();
    const list = $('.req', root)?.parentElement;
    d.pending.forEach(p => { const el = $('.req:not(.sel)', root).cloneNode(true); $('b', el).textContent = p.title; $('.small', el).textContent = `${p.kind} · ${p.by}`; $('.tag', el).textContent = p.kind; list.appendChild(el); });
    const detailTitle = $('h2.h2', byText(root, 'Approve & publish')[0]?.closest('.card') || root);
    const chip = byText(root, 'Waiting for approval')[0];
    const refresh = () => { const n = $$('.req', root).length; if (chip) chip.textContent = `Waiting for approval · ${n}`; if (!n) { detailTitle.closest('.card').innerHTML = '<h2 class="h2">All caught up</h2><p class="small">Nothing is waiting for approval.</p>'; } };
    $$('.req', root).forEach(el => { if (d.reviewed[txt($('b', el))]) el.remove(); });
    let current = $('.req.sel', root) || $('.req', root);
    const select = (el) => { current = el; $$('.req', root).forEach(x => x.classList.toggle('sel', x === el)); detailTitle.textContent = txt($('b', el)); const sub = detailTitle.nextElementSibling; if (sub) sub.textContent = txt($('.small', el)); };
    $$('.req', root).forEach(el => on(el, () => select(el)));
    if (current) select(current);
    const decide = (status) => {
      if (!current) return;
      const title = txt($('b', current)); const kind = txt($('.tag', current)); const by = txt($('.small', current)).split('·').pop().trim();
      db.update(x => { x.reviewed[title] = status; if (status === 'approved' && /book|video/i.test(kind)) x.library.push({ title, kind }); });
      if (status === 'approved') {
        if (/crash/i.test(kind)) db.notify('all', `New crash course: ${title}`, '15 lessons · £300 · see it in the Library');
        db.notify('teacher', `Approved: ${title}`, 'It is now live for students');
        toast(/crash/i.test(kind) ? `${title} published · everyone has been notified` : `${title} approved and published`);
      } else { db.notify('teacher', `Changes requested: ${title}`, txt($('#fb', root)) || 'See the note from SOU'); toast(`Sent back to ${by} with your note`); }
      const next = current.nextElementSibling || current.previousElementSibling;
      current.remove(); refresh(); if (next?.classList.contains('req')) select(next);
    };
    on(byText(root, 'Approve & publish'), () => decide('approved'));
    on(byText(root, 'Ask for changes'), () => decide('changes'));
    const addLib = byText(root, '+ Add to library')[0]; if (addLib) { addLib.dataset.custom = '1'; addLib.dataset.wired = '1'; }
    addLib?.addEventListener('click', async () => { const f = await pickFile('.pdf,video/*'); if (!f) return; const kind = /pdf$/i.test(f.name) ? 'Book (PDF)' : 'Video'; db.update(x => x.library.push({ title: f.name.replace(/\.[^.]+$/, ''), kind })); db.notify('student', 'New in the Library', f.name); toast(`${f.name} added to the Library`); });
  },

  'Support-Attendance'(root) {
    const d = db.get();
    const names = Object.keys(d.attendance);
    if (names.length) {
      const c = Object.values(d.attendance); const p = c.filter(v => v === 'p').length, l = c.filter(v => v === 'l').length, a = c.filter(v => v === 'a').length;
      const card = $('.card', root);
      card?.insertAdjacentHTML('afterend', `<div class="card" style="display:flex;flex-direction:column;gap:6px;border:2px solid #8A6F4D"><b>Latest class · Arabic Beginners with Ustadha Hanan</b><span class="small">${p} present · ${l} late · ${a} absent${a ? ' (' + esc(names.filter(n => d.attendance[n] === 'a').join(', ')) + ')' : ''}${d.teacherStarted ? ' · teacher started on time' : ''}</span></div>`);
    }
    on(byText(root, 'Export CSV'), () => {
      const rows = $$('table', root).flatMap(t => $$('tr', t).map(r => $$('th,td', r).map(c => `"${txt(c).replace(/"/g, '""')}"`).join(',')));
      download('sou-attendance-november.csv', rows.join('\n'), 'text/csv'); toast('Attendance exported');
    });
  },

  'Support-Reports'(root) {
    const list = $('.sent', root)?.parentElement;
    const add = (r, status) => { const el = $('.sent', root).cloneNode(true); el.querySelector('b').textContent = r.title; el.querySelector('.small').textContent = `${r.to} · ${r.sent}`; const t = $('.tag', el); t.textContent = status; t.style.cssText = status === 'Sent' ? 'background:#EEF5EF;color:#2F6B3D' : ''; list.querySelector('h2').after(el); };
    db.get().reports.forEach(r => add(r, 'Sent'));
    const build = () => {
      const isReport = txt($('[role="radiogroup"] .on', root)).startsWith('Progress');
      const to = selText($('#r1', root)); const period = selText($('#r2', root));
      return { kind: isReport ? 'Progress report' : 'Message', title: isReport ? period : (txt($('#r3', root)).slice(0, 40) || 'Message from SOU'), to: to.replace(/^One student: /, ''), msg: $('#r3', root).value.trim(), sent: nowLabel() };
    };
    on(byText(root, 'Send report'), () => { const r = build(); db.update(x => x.reports.unshift(r)); db.notify('student', r.kind === 'Message' ? 'New message from SOU' : `Your ${r.title} report is ready`, 'Sent by SOU Support'); add(r, 'Sent'); toast(`${r.kind} sent to ${r.to}${$('#r4', root).checked ? ' · PDF emailed' : ''}`); });
    on(byText(root, 'Schedule for'), () => { const r = build(); add({ ...r, sent: 'scheduled 1 Dec' }, 'Scheduled'); toast('Scheduled for 1 December'); });
  },

  'Support-Create-Login'(root) {
    const roles = $$('.role', root);
    roles.forEach(r => on(r, () => roles.forEach(x => { x.classList.toggle('on', x === r); x.setAttribute('aria-checked', x === r); })));
    $$('input', root).forEach(i => { if (i.id && /^a[1-3]$/.test(i.id)) i.value = ''; });
    on(byText(root, 'Create & send invite'), () => {
      const name = $('#a1', root).value.trim(), email = $('#a2', root).value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) { toast('Enter a full name and a valid email', 'err'); (!name ? $('#a1', root) : $('#a2', root)).focus(); return; }
      const role = txt($('.role.on b', root)) || 'Student';
      db.update(x => x.users.push({ name, email, role, status: 'Invited', by: 'Light admin' }));
      db.notify('super', `New ${role.toLowerCase()} login created`, `${name} · by Maryam (Support)`);
      toast(`Invite sent to ${email} · link valid for 72 hours`);
      $('#a1', root).value = ''; $('#a2', root).value = ''; $('#a3', root).value = '';
    });
  },

  /* ---------- super admin ---------- */
  'Admin-Dashboard'(root) {
    byText(root, 'Resend invite').forEach(b => on(b, () => { const n = txt($('b', b.closest('.row'))); b.textContent = 'Sent'; b.disabled = true; toast(`New 72-hour invite sent to ${n}`); }));
  },

  'Admin-Approvals'(root) {
    const d = db.get();
    $$('.req', root).forEach(el => {
      const n = txt($('b', el)); if (d.approvals[n] === 'declined') { const t = $('.tag', el); t.textContent = 'Declined'; t.className = 'tag warn'; }
      on(el, () => { $$('.req', root).forEach(x => x.classList.toggle('sel', x === el)); if (n !== 'Fatima Noor') toast(`${n}'s request opens here once real data is connected`); });
    });
    on(byText(root, 'Ask for more info'), () => { db.update(x => { x.approvals['Fatima Noor'] = 'info'; }); toast('Email sent to Fatima Noor asking for more information'); });
    on(byText(root, 'Decline'), () => { if (!confirm('Decline Fatima Noor\'s enrolment? She will be emailed.')) return; db.update(x => { x.approvals['Fatima Noor'] = 'declined'; }); const t = $('.req.sel .tag', root); if (t) { t.textContent = 'Declined'; t.className = 'tag warn'; } toast('Enrolment declined · Fatima has been emailed'); });
    const approve = byText(root, 'Approve & send invite')[0];
    approve?.addEventListener('click', () => { db.update(x => { if (!x.users.some(u => u.name === 'Fatima Noor')) x.users.push({ name: 'Fatima Noor', email: 'fatima.n@example.com', role: 'Student', status: 'Invited', by: 'Super admin' }); }); });
  },

  'Admin-Users'(root, ctx) {
    const d = db.get();
    const body = $('tbody', root);
    const tpl = $('tr', body);
    d.users.forEach(u => { const tr = tpl.cloneNode(true); const c = $$('td', tr); c[0].innerHTML = `<b>${esc(u.name)}</b><br><span class="small">${esc(u.email)}</span>`; c[1].textContent = u.role; c[2].innerHTML = `<span class="tag mid">${esc(u.status)}</span>`; c[3].textContent = `Created by ${u.by}`; c[4].textContent = 'Never'; c[5].innerHTML = '<button class="act" type="button">Resend invite</button><button class="act" type="button">More</button>'; body.insertBefore(tr, tpl); });
    // apply saved changes
    $$('tr', body).forEach(tr => { const name = txt($('b', tr)); const ch = d.userChanges[name]; if (!ch) return; if (ch.deleted) tr.remove(); if (ch.status) { const t = $('.tag', tr.children[2]); t.textContent = ch.status; t.className = 'tag ' + (ch.status === 'Suspended' ? 'warn' : 'ok'); } });
    const save = (name, patch) => db.update(x => { x.userChanges[name] = { ...(x.userChanges[name] || {}), ...patch }; });
    const menu = $('[role="menu"]', root);
    let row = null;
    if (menu) {
      menu.hidden = true; menu.style.position = 'fixed'; menu.style.zIndex = '60';
      const susp = document.createElement('button'); susp.type = 'button'; susp.setAttribute('role', 'menuitem'); menu.insertBefore(susp, menu.lastElementChild);
      menu.dataset.wired = '1';
      document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !e.target.closest('.act')) menu.hidden = true; });
      $$('button', menu).forEach(b => b.dataset.wired = '1');
      menu.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b || !row) return; const name = txt($('b', row)); const label = txt(b); menu.hidden = true;
        if (label.startsWith('Edit')) editRow(row);
        else if (label.startsWith('Change role')) { const r = prompt(`New role for ${name} (Student, Teacher, Light admin, Super admin):`, txt(row.children[1])); if (r) { row.children[1].textContent = r; save(name, { role: r }); toast(`${name} is now ${r}`); } }
        else if (label.startsWith('Move')) { const t = prompt(`Move ${name} to which teacher?`, 'Ustadha Safia'); if (t) { row.children[3].textContent = `${t} · moved`; toast(`${name} moved to ${t} · both have been notified`); } }
        else if (label.startsWith('Reset')) toast(`Password reset link emailed to ${txt($('.small', row))}`);
        else if (label.startsWith('Open')) ctx.go(ctx.linkTo('Support-View-As'));
        else if (label.startsWith('Suspend') || label.startsWith('Reactivate')) toggleStatus(row);
        else if (label.startsWith('Delete')) { const typed = prompt(`This permanently deletes ${name}'s account and data.\nType their name to confirm:`); if (typed === name) { save(name, { deleted: true }); row.remove(); toast(`${name} deleted`); } else if (typed !== null) toast('The name did not match · nothing was deleted', 'err'); }
      });
    }
    const toggleStatus = (tr) => { const name = txt($('b', tr)); const t = $('.tag', tr.children[2]); const suspended = /suspended/i.test(txt(t)); const s = suspended ? 'Active' : 'Suspended'; t.textContent = s; t.className = 'tag ' + (suspended ? 'ok' : 'warn'); save(name, { status: s }); toast(suspended ? `${name} reactivated` : `${name} suspended · data kept`); wireRow(tr); };
    const editRow = (tr) => { const name = txt($('b', tr)); const n = prompt('Full name:', name); if (n && n !== name) { $('b', tr).textContent = n; save(name, { name: n }); toast('Details saved'); } };
    const wireRow = (tr) => {
      $$('.act', tr).forEach(b => {
        const nb = b.cloneNode(true); b.replaceWith(nb); nb.dataset.wired = '1';
        const l = txt(nb);
        if (/suspended/i.test(txt(tr.children[2])) && l === 'Reactivate') nb.textContent = 'Reactivate';
        else if (l === 'Reactivate') nb.textContent = 'Edit';
        nb.addEventListener('click', (e) => {
          const lab = txt(nb);
          if (lab === 'More') { row = tr; const susp = menu.children[menu.children.length - 2]; susp.textContent = /suspended/i.test(txt(tr.children[2])) ? 'Reactivate account' : 'Suspend account'; const r = nb.getBoundingClientRect(); menu.style.top = Math.min(r.bottom + 6, innerHeight - 330) + 'px'; menu.style.left = Math.max(8, Math.min(r.right - 240, innerWidth - 248)) + 'px'; menu.style.right = 'auto'; menu.hidden = false; }
          else if (lab === 'Edit') editRow(tr);
          else if (lab === 'Reactivate') toggleStatus(tr);
          else if (lab === 'Resend invite') { nb.textContent = 'Sent'; toast(`New invite sent to ${txt($('.small', tr))}`); }
        });
      });
    };
    $$('tr', body).forEach(wireRow);
  },

  'Admin-Create-Staff'(root) {
    const send = byText(root, 'Create & send invite')[0];
    send?.addEventListener('click', (e) => {
      const name = $('#sn', root).value.trim(), email = $('#sm', root).value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) { e.stopImmediatePropagation(); toast('Enter a full name and a valid work email', 'err'); return; }
      const role = txt($('[role="radio"][aria-checked="true"] b', root)) || 'Teacher';
      db.update(x => x.users.push({ name, email, role, status: 'Invited', by: 'Super admin' }));
    }, true);
  },
};

/* ---------- shared pieces ---------- */
function chat(root, me) {
  const d = db.get();
  const first = $('.msg', root); if (!first) return;
  const box = first.parentElement;
  const input = $('#mm, #tm', root);
  const add = (m) => {
    const mine = m.from === me;
    const el = document.createElement('div'); el.className = 'msg ' + (mine ? 'me' : 'them');
    el.innerHTML = m.file ? `<b>File:</b> ${esc(m.file)}` : esc(m.text);
    const meta = document.createElement('span'); meta.className = 'meta'; meta.textContent = m.time + (mine ? ' · Sent' : ''); if (mine) meta.style.alignSelf = 'flex-end';
    box.append(el, meta); el.scrollIntoView({ block: 'nearest' });
  };
  d.messages.forEach(add);
  const send = (m) => { db.update(x => x.messages.push(m)); add(m); db.notify(me === 'student' ? 'teacher' : 'student', me === 'student' ? 'New message from Aisha Rahman' : 'New message from Ustadha Hanan', m.text || m.file); };
  const sendBtn = byText(root, 'Send', 'button')[0];
  const go = () => { const t = input.value.trim(); if (!t) { input.focus(); return; } send({ from: me, text: t, time: nowLabel() }); input.value = ''; input.focus(); };
  on(sendBtn, go);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  on($('[aria-label^="Attach"]', root), async () => { const f = await pickFile('image/*,.pdf'); if (f) { send({ from: me, file: `${f.name} · ${Math.max(1, Math.round(f.size / 1024))} KB`, time: nowLabel() }); toast(`${f.name} sent`); } });
}

const DAY = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
function calendarClasses(root, who) {
  const days = $$('.day', root); if (!days.length) return;
  db.get().classes.forEach(c => {
    if (who === 'teacher' && !/hanan/i.test(c.teacher)) return;
    if (who === 'student' && !/aisha/i.test(c.student)) return;
    const i = DAY[(c.when.slice(0, 3) || '').toLowerCase()]; if (i === undefined) return;
    const ev = document.createElement(who === 'student' ? 'a' : 'div');
    ev.className = 'ev'; if (who === 'student') ev.href = '#';
    ev.style.border = '2px solid #8A6F4D';
    ev.innerHTML = who === 'student' ? `<b>${esc(c.when.slice(4))} · ${esc(c.subject)}</b>${esc(c.teacher)} · ${esc(c.len)}<span class="meet">● Google Meet</span>` : `<b>${esc(c.when.slice(4))} · ${esc(c.student.split(' (')[0])}</b>${esc(c.subject)} · new`;
    days[i].appendChild(ev);
  });
}

/* ======================= entry point ======================= */
export function applyBehaviors(view, root, ctx) {
  try { screens[view]?.(root, ctx); } catch (e) { console.error('[portal]', view, e); }
  chipGroups(root);
  searchBoxes(root);
  fallback(root);
}
