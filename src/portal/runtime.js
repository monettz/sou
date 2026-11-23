// SOU portal runtime: renders the portal screens (src/portal/views/*.dc.html),
// handles hash routing, a demo sign-in, and keeps each role inside its own pages.
//
// The screens are written in a small template format:
//   <helmet><style>…</style></helmet>  → page styles
//   <x-dc> … </x-dc>                    → markup with {{ holes }}, <sc-for>, <sc-if>
//   <script type="text/x-dc">class Component extends DCLogic {…}</script>
//
// NOTE: this is the Stage 2 front end running on sample data. Real accounts,
// passwords and permissions come from the database in Phase 2A.

// Each app passes in only the screens it is allowed to show (see student.js / staff.js),
// so the student bundle never contains the staff screens.
import { applyBehaviors } from './behaviors.js';
import { db } from './store.js';

const viewName = (file) => file.split('/').pop().replace('.dc.html', '');

/* ---------- tiny template engine ---------- */
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; this._rerender = () => {}; }
  setState(s) { Object.assign(this.state, typeof s === 'function' ? s(this.state) : s); this._rerender(); }
  forceUpdate() { this._rerender(); }
}

function parseView(src) {
  const styles = [...((src.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1].matchAll(/<style>([\s\S]*?)<\/style>/g))].map(m => m[1]).join('\n');
  const markup = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const script = (src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/) || [, 'class Component extends DCLogic { renderVals() { return {}; } }'])[1];
  const title = (src.match(/<title>(.*?)<\/title>/) || [, ''])[1];
  // eslint-disable-next-line no-new-func
  const Component = new Function('DCLogic', `${script}\nreturn Component;`)(DCLogic);
  return { styles, markup, Component, title };
}

const get = (scope, p) => {
  p = p.trim();
  if (p === 'true') return true;
  if (p === 'false') return false;
  return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
};
const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
const interp = (str, scope) => str.replace(HOLE, (m, p) => { const v = get(scope, p); return v == null ? '' : String(v); });
const wholeHole = (str) => { const m = str.trim().match(/^\{\{\s*([^}]+?)\s*\}\}$/); return m ? m[1] : null; };

function proc(node, scope, handlers) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 3) { if (child.nodeValue.includes('{{')) child.nodeValue = interp(child.nodeValue, scope); continue; }
    if (child.nodeType !== 1) continue;
    const tag = child.tagName.toLowerCase();
    if (tag === 'sc-for') {
      const list = get(scope, wholeHole(child.getAttribute('list'))) || [];
      const as = child.getAttribute('as');
      const frag = document.createDocumentFragment();
      list.forEach((item, i) => {
        const c = child.cloneNode(true);
        proc(c, { ...scope, [as]: item, $index: i }, handlers);
        while (c.firstChild) frag.appendChild(c.firstChild);
      });
      child.replaceWith(frag);
      continue;
    }
    if (tag === 'sc-if') {
      if (get(scope, wholeHole(child.getAttribute('value')))) { proc(child, scope, handlers); child.replaceWith(...child.childNodes); } else child.remove();
      continue;
    }
    for (const a of [...child.attributes]) {
      if (a.name.startsWith('hint-')) { child.removeAttribute(a.name); continue; }
      if (!a.value.includes('{{')) continue;
      const whole = wholeHole(a.value);
      if (/^on/i.test(a.name) && whole) {
        const fn = get(scope, whole);
        child.removeAttribute(a.name);
        if (typeof fn === 'function') { const id = handlers.push({ type: a.name.slice(2).toLowerCase(), fn }) - 1; child.setAttribute('data-dc-ev', id); }
        continue;
      }
      if (whole) {
        const v = get(scope, whole);
        if (typeof v === 'boolean') { if (v) child.setAttribute(a.name, ''); else child.removeAttribute(a.name); continue; }
      }
      child.setAttribute(a.name, interp(a.value, scope));
    }
    proc(child, scope, handlers);
  }
}

/* ---------- app ---------- */
export function startPortal(app) {
  const root = document.getElementById('app');
  const styleEl = document.getElementById('view-style');
  const VIEWS = Object.fromEntries(Object.entries(app.views).map(([file, src]) => [viewName(file), src]));
  const cache = {};
  let current = null;

  const session = {
    get() { try { return JSON.parse(sessionStorage.getItem(app.sessionKey) || 'null'); } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem(app.sessionKey, JSON.stringify(v)); } catch (e) { /* private mode: stay in memory */ } session.mem = v; },
    clear() { try { sessionStorage.removeItem(app.sessionKey); } catch (e) { /* ignore */ } session.mem = null; },
    mem: null,
  };
  const who = () => session.get() || session.mem;

  // map a link to a screen file (e.g. "Student-Diary.dc.html") to this app's route
  function linkFor(href) {
    const m = href.match(/^\/?([A-Za-z-]+)\.dc\.html$/);
    if (!m) return null;
    return app.linkTo(m[1]);
  }

  function render(name) {
    const view = cache[name] || (cache[name] = parseView(VIEWS[name]));
    if (!current || current.name !== name) {
      const inst = new view.Component({});
      current = { name, inst, view };
      inst._rerender = () => draw();
    }
    styleEl.textContent = view.styles;
    // play the enter animation once per page (not on every redraw)
    root.classList.remove('entering'); void root.offsetWidth; root.classList.add('entering');
    clearTimeout(render.t); render.t = setTimeout(() => root.classList.remove('entering'), 1300);
    document.title = `${view.title} · SOU`;
    draw();
    window.scrollTo(0, 0);
  }

  function draw() {
    const { inst, view, name } = current;
    const tpl = document.createElement('template');
    tpl.innerHTML = view.markup;
    const handlers = [];
    proc(tpl.content, inst.renderVals(), handlers);
    root.replaceChildren(tpl.content);
    root.querySelectorAll('[data-dc-ev]').forEach(el => { const h = handlers[+el.dataset.dcEv]; el.addEventListener(h.type, (e) => { if (el.tagName === 'A') e.preventDefault(); h.fn(e); }); });
    root.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      const route = linkFor(href);
      if (route) a.setAttribute('href', route);
      else if (href === '#') a.addEventListener('click', e => e.preventDefault());
    });
    root.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => e.preventDefault()));
    // phones: the side menu folds behind a hamburger button
    const side = root.querySelector('.side');
    if (side) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'menu-toggle';
      btn.setAttribute('aria-label', 'Open menu'); btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path class="m-open" d="M4 7h16M4 12h16M4 17h16"/><path class="m-close" d="M6 6l12 12M18 6L6 18"/></svg>';
      btn.dataset.wired = '1';
      btn.addEventListener('click', () => {
        const open = side.classList.toggle('open');
        btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      side.appendChild(btn);
    }
    // the demo notice sits at the end of the content column, so the side menu reaches the bottom
    const demo = document.querySelector('.demo-bar');
    if (demo) (root.querySelector('.main') || document.body).appendChild(demo);
    if (app.after) app.after(name, root, { who, session, go });
    addBell(root);
    applyBehaviors(name, root, { who, go, linkTo: app.linkTo });
  }

  /* notifications live behind a bell at the top of every page, not in the side menu */
  const BELL_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>';
  let seedNotes = null;
  function unread() {
    const role = who()?.role || 'student';
    if (!seedNotes) {
      seedNotes = {};
      const src = VIEWS.Notifications;
      if (src) {
        const t = document.createElement('template');
        t.innerHTML = (src.match(/<x-dc>([\s\S]*?)<\/x-dc>/) || [, ''])[1];
        t.content.querySelectorAll('[data-role]').forEach(col => {
          seedNotes[col.dataset.role] = [...col.querySelectorAll('.n.new b')].map(b => b.textContent.trim());
        });
      }
    }
    const d = db.get();
    const titles = new Set([...(seedNotes[role] || []), ...d.notifications.filter(n => n.role === 'all' || n.role === role).map(n => n.title)]);
    return [...titles].filter(t => !d.readNotes.includes(t)).length;
  }
  function addBell(root) {
    const side = root.querySelector('.side');
    const main = root.querySelector('.main');
    if (!side || !main) return;
    const href = app.linkTo('Notifications');
    side.querySelectorAll('a').forEach(a => { if (a.getAttribute('href') === href) a.remove(); });
    const n = unread();
    const make = (cls) => {
      const a = document.createElement('a');
      a.className = 'sou-bell ' + cls; a.href = href; a.dataset.wired = '1';
      a.setAttribute('aria-label', n ? `Notifications, ${n} new` : 'Notifications');
      a.innerHTML = BELL_SVG + (n ? `<span class="sou-bell-n">${n > 9 ? '9+' : n}</span>` : '');
      return a;
    };
    // desktop & tablet: a slim bar at the top of the content
    const bar = document.createElement('div');
    bar.className = 'sou-topbar';
    bar.appendChild(make('top'));
    main.prepend(bar);
    // phones: next to the menu button in the sticky top bar
    const toggle = side.querySelector('.menu-toggle');
    if (toggle) toggle.before(make('phone'));
  }

  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  // page change: a dark curtain with the SOU logo covers the screen, the new page is
  // drawn behind it, then the curtain lifts (same transition as the website)
  const curtain = document.createElement('div');
  curtain.className = 'sou-curtain'; curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<img src="/assets/logo-light.png" alt="" width="549" height="167">';
  document.body.appendChild(curtain);
  // animations are always on for every visitor, same as the website
  const calm = () => false;
  let turn = 0;
  function lift() {
    curtain.classList.add('leave'); curtain.classList.remove('cover');
    setTimeout(() => curtain.classList.remove('leave'), 650);
  }
  function withCurtain(fn, first) {
    if (calm()) { fn(); return; }
    const me = ++turn;
    if (first) { curtain.classList.add('cover', 'instant'); fn(); requestAnimationFrame(() => { curtain.classList.remove('instant'); setTimeout(lift, 350); }); return; }
    curtain.classList.remove('leave'); void curtain.offsetWidth; curtain.classList.add('cover');
    setTimeout(() => { if (me !== turn) return; fn(); setTimeout(() => { if (me === turn) lift(); }, 120); }, 480);
  }

  function route(first) {
    const path = (location.hash.replace(/^#\/?/, '') || '');
    const target = app.resolve(path, who());
    if (target.redirect) { go(target.redirect); return; }
    if (target.logout) session.clear();
    if (current && current.name === target.view) { render(target.view); return; }
    withCurtain(() => render(target.view), first === true);
  }

  // phone layout: the sidebar becomes a scrollable bar on top
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => { if (confirm('Clear everything saved in this demo (notes, messages, classes, approvals…)?')) { db.reset(); location.reload(); } });
  // live updates: when another tab (e.g. the teacher) saves something, redraw this screen,
  // unless the person is typing here
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith('sou-demo-db')) return;
    const a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.value) return;
    if (current) draw();
  });
  window.addEventListener('hashchange', route);
  route(true);
}
