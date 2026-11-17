/* SOU single-site app: hash router, data-rendered sections, Totopia-style motion */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let pref = null; try { pref = localStorage.getItem('sou-motion'); } catch (e) {}
  // Animations are on by default for everyone; visitors can switch them off in the footer or menu
  const reduce = pref === 'off';
  const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // autoplaying loops start paused for these visitors
  if (osReduce) document.documentElement.classList.add('calm');
  const icon = (id, s = 18, cls = '') => `<svg width="${s}" height="${s}" class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  if (!reduce && 'IntersectionObserver' in window) document.documentElement.classList.add('motion');
  else document.documentElement.classList.add('no-motion');
  // Animations on/off switch (footer + menu); defaults to the device's reduce-motion setting
  const toggleHTML = `<button type="button" class="motion-toggle" aria-pressed="${!reduce}"><i aria-hidden="true"></i>Animations ${reduce ? 'off' : 'on'}</button>`;
  document.querySelector('.legal')?.insertAdjacentHTML('beforeend', toggleHTML);
  document.querySelector('.drawer .bottom')?.insertAdjacentHTML('afterbegin', toggleHTML);
  document.addEventListener('click', e => { if (!e.target.closest('.motion-toggle')) return; try { localStorage.setItem('sou-motion', reduce ? 'on' : 'off'); } catch (err) {} location.reload(); });

  /* ---------- DATA ---------- */
  const posts = [
    { cat: 'flyer', tag: 'Flyer', date: '10 Nov 2026', title: 'Winter term timetable is now live', img: 'post-flyer.jpg', alt: 'Ornate study hall with bookshelves' },
    { cat: 'class', tag: 'New class', date: '08 Nov 2026', title: 'Tajweed for Beginners: new evening cohort', img: 'post-class.jpg', alt: 'Open Qur’an with prayer beads' },
    { cat: 'blog', tag: 'Blog', date: '02 Nov 2026', title: '5 habits that help adult learners stay consistent', img: 'post-blog.jpg', alt: 'Laptop, notebook and pens' },
    { cat: 'blog', tag: 'Blog', date: '28 Oct 2026', title: 'Making the most of online Qur’an lessons', img: 'about-online.jpg', alt: 'Laptop ready for an online lesson' },
    { cat: 'class', tag: 'New class', date: '20 Oct 2026', title: 'Weekend Hifz circle for teens', img: 'hero2.jpg', alt: 'Qur’an on a stand over a prayer rug' },
    { cat: 'flyer', tag: 'Offer', date: '14 Oct 2026', title: 'Bundle offer: 2 bonus lessons this term', img: 2 },
  ];
  const tones = [['#8A6F4D', '#FFF7EF'], ['#D6B98C', '#2B2B2B'], ['#2B2B2B', '#FFF7EF'], ['#6E583C', '#FFF7EF']];
  const reviews = [
    ['quran', 'AR', 'Aisha R.', 'Qur’an Reading · Adult learner', 'The teachers are patient and the structure keeps me consistent. I finally feel confident reading on my own.', 5],
    ['parents', 'YM', 'Yusuf M.', 'Parent · Junior Arabic', 'Booking the taster class was easy and my son loved it. The schedule works perfectly around school.', 5],
    ['arabic', 'FK', 'Fatima K.', 'Arabic Foundations · Student', 'Clear lessons, helpful notes and a teacher who actually tracks my progress. Highly recommended.', 5],
    ['islamic', 'IB', 'Ibrahim B.', 'Islamic Studies · Adult learner', 'Practical and well explained. Every lesson connects back to daily life.', 5],
    ['parents', 'NS', 'Noor S.', 'Parent · Children’s Qur’an', 'My daughter looks forward to every class. The quick quizzes keep her motivated between lessons.', 5],
    ['quran', 'OH', 'Omar H.', 'Tajweed · Teen learner', 'Being able to rewatch the lesson video with my notes made a huge difference before my test.', 4],
    ['arabic', 'ZA', 'Zainab A.', 'Arabic Language · Intermediate', 'Grammar finally makes sense. Ustadha Maryam explains things in a way I can remember.', 5],
    ['islamic', 'KM', 'Khalid M.', 'Seerah course · Adult learner', 'Well organised, always on time, and WhatsApp support is quick when I need to reschedule.', 5],
    ['quran', 'HR', 'Hafsa R.', 'Qur’an Reading · Beginner', 'I started from the alphabet as an adult and never felt embarrassed. Truly supportive teachers.', 5],
  ];
  const steps = [
    ['Sample a class', 'Book a free taster lesson and meet a teacher with no commitment.', ['Choose a subject and a preferred time', 'Reservation confirmed by email', 'Our team is notified to assign a teacher']],
    ['Select a plan', 'Pick a single lesson, a bundle or ask us for a custom pack.', ['Clear pricing, no hidden fees', 'Secure online checkout', 'Custom packs arranged by our team']],
    ['Set schedule & times', 'Choose the days and times that work around your week.', ['Weekday, evening and weekend slots', 'Online or in person', 'Change your schedule with notice']],
    ['Receive orientation pack', 'Get your welcome guide, materials and class links by email.', ['Welcome guide and timetable', 'Class links and portal login', 'Workbook for your level']],
    ['Begin study', 'Start learning with steady support and progress check-ins.', ['Progress tracker and teacher feedback', 'Homework quick quizzes', 'Diary notes linked to lesson videos']],
  ];
  const courses = [
    { href: '#taster', taster: true, subject: 'Qur’an Reading & Tajweed', cta: 'Book a free taster', t: 'Qur’an Reading & Tajweed', d: 'From the Arabic alphabet to fluent recitation with correct rules.', img: 'post-class.jpg', tags: ['Children', 'Adults'] },
    { href: '#taster', taster: true, subject: 'Arabic Language', cta: 'Book a free taster', t: 'Arabic Language', d: 'Grammar, vocabulary and conversation to understand the Qur’an directly.', img: 'post-flyer.jpg', tags: ['Beginner', 'Intermediate'] },
    { href: '#taster', taster: true, subject: 'Islamic Studies', cta: 'Book a free taster', t: 'Islamic Studies', d: 'Aqeedah, fiqh of worship, seerah and character, taught practically.', img: 'hero1.jpg', tags: ['Children', 'Adults'] },
    { href: '#taster', taster: true, subject: 'Qur’an Reading & Tajweed', cta: 'Book a free taster', t: 'Hifz Programme', d: 'Structured memorisation with daily revision and teacher listening.', img: 'hero2.jpg', tags: ['Teens', 'Adults'] },
    { href: '#taster', taster: true, subject: 'Not sure yet', cta: 'Book a free taster', t: 'Children’s Classes', d: 'Gentle, engaging lessons for ages 5–12 with progress for parents.', img: 'about-teacher.jpg', tags: ['Ages 5–12'] },
  ];
  const featured = [
    { href: '#post', cta: 'Read more', t: 'The winter timetable is here', d: 'New evening and weekend slots for every subject.', img: 'post-flyer.jpg', tags: ['Flyer'] },
    { href: '#post', cta: 'Read more', t: 'Tajweed for Beginners — evening cohort', d: 'A 10-week course for adults, starting 18 November.', img: 'post-class.jpg', tags: ['New class'] },
    { href: '#post', cta: 'Read more', t: 'Two bonus lessons on every bundle', d: 'Book any bundle before 30 November.', img: 'hero1.jpg', tags: ['Offer'] },
    { href: '#post', cta: 'Read more', t: 'Online open day & Q&A', d: 'Meet our teachers live on 6 November, 7 PM.', img: 'about-online.jpg', tags: ['Event'] },
    { href: '#post', cta: 'Read more', t: 'Weekend Hifz circle for teens', d: 'Small groups, Saturdays and Sundays.', img: 'hero2.jpg', tags: ['New class'] },
  ];
  const teachers = [['AH', 'Ust. Ahmed Hassan', 'Qur’an & Tajweed', 'Ijazah in Hafs ‘an ‘Asim. 12 years teaching adults and teens.'], ['MA', 'Ustadha Maryam Ali', 'Arabic Language', 'MA in Arabic. Makes grammar simple and practical.'], ['BO', 'Ust. Bilal Okoye', 'Islamic Studies', 'Graduate in Shariah. Focus on fiqh of worship and seerah.'], ['SK', 'Ustadha Safiya Khan', 'Children’s Qur’an', 'Specialist in young learners aged 5–12.']];
  const faqs = [['Is the taster class really free?', 'Yes. Your first taster class is completely free and there is no obligation to buy a package afterwards.'], ['Who are the teachers?', 'Qualified, vetted teachers with recognised training — many with ijazah — trained in the SOU curriculum and safeguarding checked.'], ['Can children join?', 'Yes. We teach children from age 5 as well as teens and adults. A parent or guardian books and manages lessons for under-16s.'], ['What if I need to change my schedule?', 'Request a change in your student portal or contact us. We ask for 24 hours’ notice for lesson changes.'], ['Do you offer group or family discounts?', 'Yes — choose a Custom pack and describe what you need. We will send you a tailored quote.']];
  const events = [{ d: 6, k: 'events', tag: 'Event', t: 'Online open day & Q&A', m: '7:00 PM · Live online' }, { d: 14, k: 'offers', tag: 'Offer', t: 'Bundle bonus lessons begin', m: 'Until 30 Nov' }, { d: 18, k: 'events', tag: 'Event', t: 'Tajweed evening cohort starts', m: '6:30 PM · Online & in person' }, { d: 18, k: 'news', tag: 'News', t: 'Teacher spotlight: Ustadha Maryam', m: 'Blog post' }, { d: 22, k: 'news', tag: 'News', t: 'Winter timetable published', m: 'Announcement' }, { d: 27, k: 'events', tag: 'Event', t: 'Arabic grammar weekend intensive', m: '10:00 AM – 1:00 PM · In person' }];
  const evColor = { events: '#8A6F4D', offers: '#D6B98C', news: '#2B2B2B' };
  const planDefs = (g) => [
    { id: 'single', name: 'Single lesson', desc: 'Try a subject or top up your learning.', price: g ? '£12' : '£20', unit: '/ lesson', feats: ['1 × 45-min lesson', 'Any subject & level', 'Book any open slot', 'Lesson notes after class'], cta: 'Buy single lesson' },
    { id: 'b10', name: 'Bundle 10', desc: 'Steady weekly progress.', price: g ? '£110' : '£180', unit: '/ 10 lessons', save: 'Save 10%', feats: ['10 × 45-min lessons', 'Fixed weekly schedule', 'Orientation pack', 'Progress check every 5 lessons'], cta: 'Choose Bundle 10' },
    { id: 'b20', name: 'Bundle 20', desc: 'Best value for committed learners.', price: g ? '£200' : '£340', unit: '/ 20 lessons', save: 'Save 15%', feats: ['20 × 45-min lessons', 'Priority time slots', 'Orientation pack + workbook', 'Monthly progress report'], cta: 'Choose Bundle 20', feat: true, badge: 'Best value' },
    { id: 'custom', name: 'Custom pack', desc: 'Families, groups and special requirements.', price: 'Custom', unit: 'quoted for you', feats: ['Any number of lessons', 'Sibling & group discounts', 'Your preferred schedule', 'Personal learning plan'], cta: 'Describe your pack', custom: true },
  ];
  let mode = 'one';

  /* ---------- RENDERERS ---------- */
  const postCard = (p) => `<a class="post rv-up" href="#post"><span class="img"><img src="assets/${p.img}" alt="${p.alt}" width="800" height="534" loading="lazy" decoding="async"></span><span class="body"><span class="meta"><span class="chip">${p.tag}</span>${p.date}</span><h3>${p.title}</h3><span class="link">Read more ${icon('i-arrow', 18, 'arr')}</span></span></a>`;
  const reviewCard = (r, i) => `<figure class="rv rv-up" style="background:var(--white)"><span class="row" style="justify-content:space-between"><span class="stars" aria-label="${r[5]} out of 5">${'★'.repeat(r[5])}${'☆'.repeat(5 - r[5])}</span></span><blockquote>“${r[4]}”</blockquote><figcaption><span class="av" style="background:${tones[i % 4][0]};color:${tones[i % 4][1]}">${r[1]}</span><span><b style="display:block;font-family:var(--ui)">${r[2]}</b><span style="font-size:13px;color:var(--muted)">${r[3]}</span></span><span class="verified">Verified</span></figcaption></figure>`;
  const planCard = (p) => `<div class="plan rv-up ${p.feat ? 'feat' : ''}"><span class="row" style="justify-content:space-between"><h3>${p.name}</h3>${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</span><span class="desc">${p.desc}</span><span class="price"><b>${p.price}</b><span>${p.unit}</span></span>${p.save ? `<span class="save">${p.save}</span>` : ''}<ul>${p.feats.map(f => `<li>${f}</li>`).join('')}</ul><a class="btn ${p.feat ? 'btn-primary' : 'btn-outline'}" href="${p.custom ? '#packages' : '#checkout'}" data-plan="${p.id}" ${p.custom ? 'data-scroll="custom"' : ''}>${p.cta}</a></div>`;

  function renderPosts() {
    $$('[data-posts]').forEach(el => { if (el.id === 'postGrid') return; el.innerHTML = posts.slice(0, 3).map(postCard).join(''); });
    renderPostGrid('all');
  }
  function renderPostGrid(cat) { $('#postGrid').innerHTML = posts.filter(p => cat === 'all' || p.cat === cat).map(postCard).join(''); }
  function renderReviews(f = 'all') {
    $$('[data-reviews="3"]').forEach(el => el.innerHTML = reviews.slice(0, 3).map(reviewCard).join(''));
    $('#rvGrid').innerHTML = reviews.map((r, i) => [r, i]).filter(([r]) => f === 'all' || r[0] === f).map(([r, i]) => reviewCard(r, i)).join('');
  }
  function renderPlans() {
    const ps = planDefs(mode === 'group');
    $$('[data-plans]').forEach(el => el.innerHTML = ps.map(planCard).join(''));
  }
  function tabs(el, items, onPick) {
    el.innerHTML = items.map(([id, l], i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-id="${id}">${l}</button>`).join('');
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); onPick(b.dataset.id); observeReveals(); });
  }

  function renderStatic() {
    $$('[data-steps]').forEach(el => el.innerHTML = steps.map((s, i) => `<li class="step ${i === 0 ? 'first' : ''}"><span class="n">0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join(''));
    $('[data-steps-detail]').innerHTML = steps.map((s, i) => `<div class="split rv-up" style="align-items:flex-start;gap:40px;padding-block:44px;border-top:${i ? '1px solid var(--line)' : '0'}"><div class="row" style="flex:1;gap:24px;flex-wrap:nowrap;align-items:flex-start"><span class="step-n" style="flex:none;width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:600 32px/1 var(--display);${i === 0 ? 'background:var(--bronze);color:var(--white)' : 'background:var(--sand);border:1px solid var(--tan);color:var(--bronze-dk)'}">0${i + 1}</span><div class="stack" style="gap:12px"><span class="eyebrow">Step 0${i + 1}</span><h2 class="h3" style="font-size:34px">${s[0]}</h2><p class="lead">${s[1]}</p></div></div><div class="card" style="flex:1"><span class="eyebrow" style="font-size:12px">What happens</span>${s[2].map(p => `<span class="row" style="flex-wrap:nowrap;gap:10px;align-items:flex-start">${icon('i-check', 20)}<span>${p}</span></span>`).join('')}</div></div>`).join('') + `<div class="row rv-up" style="padding-top:32px;border-top:1px solid var(--line)"><button class="btn btn-primary" data-taster>Start step 1 — Book a Taster Class</button><a class="btn btn-outline" href="#packages">Compare packages</a></div>`;
    $('[data-teachers]').innerHTML = teachers.map((t, i) => `<div class="card lift rv-up" style="align-items:center;text-align:center"><span class="av" style="width:96px;height:96px;font:600 30px/1 var(--display);background:${tones[i][0]};color:${tones[i][1]}">${t[0]}</span><h3>${t[1]}</h3><b style="font:800 14px/1 var(--ui);color:var(--bronze-dk)">${t[2]}</b><p>${t[3]}</p></div>`).join('');
    $('[data-faq]').innerHTML = faqs.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
    $('[data-process]').innerHTML = [['Apply online', 'Send your details, CV and certificates.'], ['Interview', 'A short video call with our academic lead.'], ['Demo lesson', 'Teach a 20-minute sample lesson.'], ['Onboarding', 'Safeguarding checks, portal training and your first students.']].map((p, i, a) => `<li class="row" style="flex-wrap:nowrap;align-items:stretch;gap:16px"><span style="display:flex;flex-direction:column;align-items:center"><span style="width:44px;height:44px;border-radius:50%;background:var(--bronze);display:flex;align-items:center;justify-content:center;font:600 18px/1 var(--display)">${i + 1}</span>${i < a.length - 1 ? '<span style="flex:1;width:2px;background:var(--bronze);min-height:20px"></span>' : ''}</span><span style="padding:8px 0 24px"><b style="display:block;font:600 22px/1.1 var(--display)">${p[0]}</b><span style="color:var(--tan);font-size:15px">${p[1]}</span></span></li>`).join('');
    $('#bars').innerHTML = [[5, 88], [4, 9], [3, 2], [2, 1], [1, 0]].map(([n, p]) => `<span class="row" style="gap:10px;flex-wrap:nowrap;font:700 13px/1 var(--ui)"><span style="width:14px">${n}</span><span style="flex:1;height:8px;border-radius:999px;background:var(--sand)"><span class="bar" data-w="${p}" style="display:block;height:8px;border-radius:999px;background:var(--bronze);width:100%;transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease)"></span></span><span style="width:34px;text-align:right;color:var(--muted)">${p}%</span></span>`).join('');
    $('#cmp').innerHTML = [['Lesson length', '45 min', '45 min', '45 min', 'Flexible'], ['Same teacher every week', '—', '✓', '✓', '✓'], ['Orientation pack', '—', '✓', '✓ + workbook', '✓'], ['Progress tracker & quizzes', '✓', '✓', '✓', '✓'], ['Diary notes linked to videos', '✓', '✓', '✓', '✓'], ['Progress reports', '—', 'Every 5 lessons', 'Monthly', 'Agreed with you'], ['Reschedule with 24h notice', '✓', '✓', '✓', '✓']].map(r => `<tr><td>${r[0]}</td><td class="c">${r[1]}</td><td class="c">${r[2]}</td><td class="c" style="background:#FFFBF5">${r[3]}</td><td class="c">${r[4]}</td></tr>`).join('');
    $$('[data-captcha]').forEach(el => el.outerHTML = `<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="captcha"><label><input type="checkbox" required> I’m not a robot</label><small class="row" style="gap:6px">${icon('i-shield', 16)}CAPTCHA spam protection</small></div>`);
    // stars
    const st = $('#stars'); let rating = 5;
    const drawStars = () => st.innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${n === rating}" aria-label="${n} star${n > 1 ? 's' : ''}" data-n="${n}" style="width:44px;height:44px;border:0;background:none;cursor:pointer;font-size:30px;color:${n <= rating ? '#8A6F4D' : '#E4CFAE'}">★</button>`).join('');
    drawStars(); st.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { rating = +b.dataset.n; drawStars(); } });
  }

  /* ---------- CALENDAR ---------- */
  let evFilter = 'all', evDay = 0;
  function renderCal() {
    const vis = events.filter(e => evFilter === 'all' || e.k === evFilter);
    let html = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<span class="wd">${d}</span>`).join('');
    for (let i = 0; i < 42; i++) {
      const d = i - 5, ok = d >= 1 && d <= 30, list = ok ? vis.filter(e => e.d === d) : [];
      html += ok ? `<button class="${d === evDay ? 'sel' : ''} ${d === 12 ? 'today' : ''}" data-d="${d}" aria-pressed="${d === evDay}" aria-label="${d} November${list.length ? ', ' + list.length + ' items' : ''}">${d}<span class="mk">${list.map(e => `<i style="background:${d === evDay ? '#fff' : evColor[e.k]}"></i>`).join('')}</span></button>` : '<span class="empty" aria-hidden="true"></span>';
    }
    $('#calGrid').innerHTML = html;
    const list = evDay ? vis.filter(e => e.d === evDay) : vis;
    $('#evTitle').textContent = evDay ? evDay + ' November' : 'Upcoming this month';
    $('#evList').innerHTML = list.length ? list.map(e => `<a class="ev" href="#post"><span class="date"><b>${String(e.d).padStart(2, '0')}</b><small>NOV</small></span><span class="stack" style="gap:5px;min-width:0"><span class="chip" style="align-self:flex-start">${e.tag}</span><h3>${e.t}</h3><span class="m">${e.m}</span></span></a>`).join('') : `<div class="note" style="justify-content:space-between;align-items:center">Nothing scheduled on this day.<button class="btn btn-sm btn-outline" id="showAll">Show all</button></div>`;
  }
  $('#calGrid').addEventListener('click', e => { const b = e.target.closest('button[data-d]'); if (!b) return; evDay = evDay === +b.dataset.d ? 0 : +b.dataset.d; renderCal(); });
  $('#evList').addEventListener('click', e => { if (e.target.id === 'showAll') { evDay = 0; renderCal(); } });

  /* ---------- COVERFLOW (Totopia slider) ---------- */
  function coverflow(root, items, prev, next) {
    root.innerHTML = items.map((c, i) => `<a class="cf-card" href="${c.href}" data-i="${i}" ${c.taster ? `data-taster data-subject="${c.subject || ''}"` : ''}><img src="assets/${c.img}" alt="" width="800" height="534" loading="lazy" decoding="async"><div class="body"><span class="row" style="gap:6px">${c.tags.map(t => `<span class="chip">${t}</span>`).join('')}</span><h3>${c.t}</h3><p>${c.d}</p><span class="link" style="color:var(--bronze-dk);margin-top:4px">${c.cta} ${icon('i-arrow', 18, 'arr')}</span></div></a>`).join('');
    const cards = $$('.cf-card', root); let active = 0, timer;
    // a side card first slides to the centre; the centre card opens its link
    root.addEventListener('click', e => {
      const c = e.target.closest('.cf-card'); if (!c) return;
      const i = +c.dataset.i;
      if (i !== active) { e.preventDefault(); e.stopPropagation(); active = i; render(); restart(); }
      else if (c.dataset.subject) { const sel = $('#tSubj'); if (sel) sel.value = c.dataset.subject; }
    }, true);
    root.addEventListener('focusin', e => { const c = e.target.closest('.cf-card'); if (c && +c.dataset.i !== active) { active = +c.dataset.i; render(); } });
    const render = () => {
      const w = cards[0].offsetWidth, n = cards.length;
      cards.forEach((c, i) => {
        let o = i - active; if (o < -n / 2) o += n; if (o > n / 2) o -= n;
        const map = { 0: [0, 1, 50, 1], 1: [.42, .82, 40, 1], '-1': [-.42, .82, 40, 1], 2: [.72, .64, 30, .9], '-2': [-.72, .64, 30, .9] };
        const [x, s, z, op] = map[o] || [o > 0 ? .9 : -.9, .5, 10, 0];
        c.style.transform = `translateX(${x * w}px) scale(${s})`; c.style.zIndex = z; c.style.opacity = op;
        c.style.filter = o === 0 ? 'none' : 'saturate(.85)'; c.style.cursor = 'pointer';
        c.setAttribute('aria-label', (o === 0 ? '' : 'Show ') + c.querySelector('h3').textContent);
      });
    };
    const go = d => { active = (active + d + cards.length) % cards.length; render(); };
    let paused = false;
    const pbtn = document.createElement('button'); pbtn.className = 'iconbtn pausebtn'; pbtn.type = 'button';
    const drawP = () => { pbtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); pbtn.innerHTML = paused ? '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>'; };
    pbtn.onclick = () => { paused = !paused; drawP(); restart(); }; drawP(); prev.after(pbtn);
    const restart = () => { clearInterval(timer); if (!reduce && !paused) timer = setInterval(() => go(1), 4000); };
    prev.onclick = () => { go(-1); restart(); }; next.onclick = () => { go(1); restart(); };
    root.addEventListener('mouseenter', () => clearInterval(timer)); root.addEventListener('mouseleave', restart);
    window.addEventListener('resize', render); render(); restart();
    return render;
  }

  /* ---------- HERO BANNER SLIDES ---------- */
  const slides = [
    { k: 'Online & in-person classes for all ages', t: 'Rooted learning for the <span class="hl">students of the Ummah</span>', b: 'Structured Qur’an, Arabic and Islamic studies with qualified teachers — at a pace and schedule that fits your life.', img: 0 },
    { k: 'Winter term · Enrolment open', t: 'New evening cohorts <span class="hl">start this month</span>', b: 'Reserve your place now and begin with a free taster class. Places are limited.', img: 1 },
    { k: 'Limited offer', t: 'Two bonus lessons with <span class="hl">every bundle</span>', b: 'Book any bundle before 30 November and enjoy extra sessions with your teacher.', img: 2 },
  ];
  let sl = 0, slTimer;
  function showSlide(i) {
    sl = (i + slides.length) % slides.length; const s = slides[sl];
    const parts = [$('#slKicker'), $('#slTitle'), $('#slBody')];
    $$('.hero-bg img').forEach((im, j) => im.classList.toggle('on', j === s.img));
    parts.forEach(p => { p.style.transition = 'opacity .35s'; p.style.opacity = 0; });
    setTimeout(() => {
      $('#slKicker').textContent = s.k; const T = $('#slTitle'); T.innerHTML = s.t; $('#slBody').textContent = s.b;
      if (motionOn() && sio) { splitEl(T); T.classList.add('in'); requestAnimationFrame(() => requestAnimationFrame(() => T.classList.add('split-in'))); }
      parts.forEach(p => p.style.opacity = 1);
    }, reduce ? 0 : 350);
    $('#slDots').innerHTML = slides.map((_, j) => `<button class="${j === sl ? 'on' : ''}" aria-label="Show banner ${j + 1}" data-j="${j}"></button>`).join('');
    $('#slCount').textContent = `0${sl + 1} / 03`;
  }
  let slPaused = false;
  const slRestart = () => { clearInterval(slTimer); if (!reduce && !slPaused) slTimer = setInterval(() => showSlide(sl + 1), 6000); };
  { const b = document.createElement('button'); b.className = 'iconbtn pausebtn'; b.type = 'button';
    const d = () => { b.setAttribute('aria-label', slPaused ? 'Play banners' : 'Pause banners'); b.innerHTML = slPaused ? '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>'; };
    b.onclick = () => { slPaused = !slPaused; d(); slRestart(); }; d(); document.querySelector('#slPrev').before(b); }
  $('#slDots').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { showSlide(+b.dataset.j); slRestart(); } });
  $('#slPrev').onclick = () => { showSlide(sl - 1); slRestart(); }; $('#slNext').onclick = () => { showSlide(sl + 1); slRestart(); };

  /* ---------- MOTION ---------- */
  let io;
  function observeReveals() {
    if (!document.documentElement.classList.contains('motion')) { $$('.rv-up,.rv-img').forEach(e => e.classList.add('in')); return; }
    if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    const page = $('[data-page].active');
    $$('.grid, .plans, .stats, .steps, .row').forEach(g => { let k = 0; [...g.children].forEach(ch => { if (ch.classList.contains('rv-up')) ch.style.setProperty('--d', (k++ * 90) + 'ms'); }); });
    $$('.rv-up:not(.in),.rv-img:not(.in)', page).concat($$('.rv-up:not(.in)', $('footer'))).forEach(e => io.observe(e));
  }
  function pageLoadAnim(page) {
    const els = $$('.ld', page);
    els.forEach(e => e.classList.remove('in'));
    if (!document.documentElement.classList.contains('motion')) { els.forEach(e => e.classList.add('in')); return; }
    requestAnimationFrame(() => els.forEach((e, i) => setTimeout(() => e.classList.add('in'), 80 + i * 110)));
  }
  // counters
  const counted = new WeakSet();
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting || counted.has(e.target)) return; counted.add(e.target); countUp(e.target); }), { threshold: .4 }) : null;
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = target.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 2000;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), v = target * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function observeCounters() { $$('[data-count]', $('[data-page].active')).forEach(el => cio && cio.observe(el)); $$('.bar', $('[data-page].active')).forEach(b => setTimeout(() => { b.style.transform = 'scaleX(' + b.dataset.w / 100 + ')'; }, 300)); }
  // word-by-word colour reveal on scroll (Totopia SplitText effect)
  function splitWords() {
    $$('[data-words]').forEach(p => {
      const hl = p.querySelector('.hl-word'); const hlText = hl ? hl.textContent : '';
      const text = p.textContent.replace(/\s+/g, ' ').trim();
      p.innerHTML = text.split(' ').map(w => `<span class="w${hlText && hlText.split(' ').includes(w.replace(/[^\w’]/g, '')) ? ' hl' : ''}">${w}</span>`).join(' ');
      if (!document.documentElement.classList.contains('motion')) $$('.w', p).forEach(w => w.classList.add('lit'));
    });
  }
  function scrubWords() {
    if (!document.documentElement.classList.contains('motion')) return;
    $$('[data-page].active [data-words]').forEach(p => {
      const r = p.getBoundingClientRect(), vh = innerHeight;
      const prog = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const ws = $$('.w', p), n = Math.round(prog * ws.length);
      ws.forEach((w, i) => w.classList.toggle('lit', i < n));
    });
  }
  // header hide on scroll down
  let lastY = 0;
  function onScroll(y) {
    const hdr = $('#hdr'); if (y > 200 && y > lastY + 4) hdr.classList.add('hide'); else if (y < lastY - 4 || y < 200) hdr.classList.remove('hide');
    lastY = y; scrubWords(); parallax();
  }
  // Native scrolling: smooth-scroll libraries hijack the mouse wheel and can leave the page unscrollable
  // (e.g. when the tab throttles animation frames), so the page always scrolls with the browser's own wheel handling.
  const lenis = null;
  window.addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  const scrollToY = (y, immediate) => {
    if (immediate) { window.scrollTo(0, y); if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); return; }
    if (lenis) lenis.scrollTo(y, { force: true }); else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- EXTRA MOTION: split headings, curtain, parallax, tilt, stars ---------- */
  const motionOn = () => document.documentElement.classList.contains('motion');
  function splitEl(el) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const o = document.createElement('span'); o.className = 'sw';
            const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
            o.appendChild(inner); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('sw')) walk(n);
      });
    };
    walk(el); el.classList.add('wsplit'); el.classList.remove('split-in', 'ld', 'rv-up');
  }
  let sio;
  function initSplits() {
    if (!motionOn()) return;
    sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('split-in'); sio.unobserve(e.target); } }), { threshold: .2 });
    $$('main h1.h1, main h2.h2').forEach(h => { if (!h.closest('form')) splitEl(h); });
  }
  function playSplits(page, onLoad) {
    if (!motionOn()) return;
    $$('.wsplit', page).forEach(h => {
      h.classList.remove('split-in');
      const r = h.getBoundingClientRect();
      if (onLoad && r.top < innerHeight) setTimeout(() => h.classList.add('split-in'), 120); else sio.observe(h);
    });
  }
  // decorative stars (8-point khatam, from Islamic geometry)
  const starSVG = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><rect x="18" y="18" width="64" height="64"/><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="14"/></g></svg>`;
  function addStars() {
    const put = (host, css, size, rev) => { const d = document.createElement('div'); d.className = 'star8' + (rev ? ' rev' : ''); d.style.cssText = css; d.dataset.parallax = rev ? '-0.12' : '0.18'; d.innerHTML = starSVG(size); host.prepend(d); };
    $$('.hero').forEach(h => { put(h, 'left:-80px;top:120px', 260, false); put(h, 'right:30%;bottom:-60px;opacity:.35', 180, true); });
    $$('.page-hero').forEach(h => put(h, 'right:-70px;top:30px;opacity:.4', 280, true));
    $$('section.dark').forEach(h => { put(h, 'right:-90px;top:-60px;color:#8A6F4D', 320, false); put(h, 'left:-60px;bottom:-80px;color:#8A6F4D;opacity:.35', 220, true); });
  }
  // curtain + progress bar
  const curtain = document.createElement('div'); curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="mark"><img src="assets/logo.png" alt="" width="549" height="167"></span>';
  const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.append(curtain, bar);
  function withCurtain(swap) {
    if (!motionOn()) { swap(); return; }
    curtain.classList.remove('leave'); void curtain.offsetWidth; curtain.classList.add('cover');
    setTimeout(() => { swap(); curtain.classList.add('leave'); curtain.classList.remove('cover');
      setTimeout(() => { curtain.classList.remove('leave'); curtain.style.transition = 'none'; curtain.style.transform = 'translateY(100%)'; void curtain.offsetWidth; curtain.style.transition = ''; curtain.style.transform = ''; }, 750); }, 600);
  }
  function parallax() {
    if (!motionOn()) return;
    const vh = innerHeight;
    $$('[data-page].active [data-parallax], [data-page].active .arch').forEach(el => {
      const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
      const f = el.dataset.parallax ? +el.dataset.parallax : -0.08;
      el.style.translate = `0 ${((r.top + r.height / 2) - vh / 2) * f}px`;
    });
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, (lenis ? lenis.scroll : scrollY) / max) : 0})`;
  }
  function bindTilt() {
    if (!motionOn() || !matchMedia('(hover:hover)').matches) return;
    document.addEventListener('pointermove', e => {
      const c = e.target.closest('.plan, .post, .rv'); if (!c) return;
      c.classList.add('tilt'); const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
    });
    document.addEventListener('pointerout', e => { const c = e.target.closest('.plan, .post, .rv'); if (c && !c.contains(e.relatedTarget)) c.style.transform = ''; });
  }

  /* ---------- ROUTER ---------- */
  const pages = $$('[data-page]').map(p => p.dataset.page);
  let cfRender = [];
  let first = true;
  function route() {
    let id = (location.hash || '#home').slice(1);
    if (id === 'taster') { openTaster(); id = current || 'home'; }
    if (!pages.includes(id)) id = 'home';
    if (id === current) return;
    if (first) { first = false; show(id, true); return; }
    closeDrawer();
    withCurtain(() => show(id, false));
  }
  function show(id, initial) {
    current = id;
    $$('[data-page]').forEach(p => p.classList.toggle('active', p.dataset.page === id));
    $$('.nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
    closeDrawer();
    scrollToY(0, true);
    document.title = (id === 'home' ? 'SOU – Tullab al-Ummah' : 'SOU – ' + ($('[data-page="' + id + '"] h1')?.textContent.split(/[,.:]/)[0] || id));
    const page = $(`[data-page="${id}"]`);
    pageLoadAnim(page); observeReveals(); observeCounters(); scrubWords(); playSplits(page, true); parallax();
    cfRender.forEach(f => f());
    if (id === 'checkout') renderCheckout();
  }
  let current = null;
  window.addEventListener('hashchange', route);
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-scroll]');
    if (s) {
      const target = document.getElementById(s.dataset.scroll);
      if (target) { e.preventDefault(); const page = s.getAttribute('href'); if (page && page !== '#' + current && page.startsWith('#') && pages.includes(page.slice(1))) { location.hash = page; setTimeout(() => scrollToY(target.getBoundingClientRect().top + scrollY - 100), 80); } else scrollToY(target.getBoundingClientRect().top + scrollY - 100); }
    }
    const pl = e.target.closest('[data-plan]'); if (pl && pl.dataset.plan !== 'custom') { co.plan = pl.dataset.plan; co.step = 0; }
    if (e.target.closest('[data-taster]')) { e.preventDefault(); openTaster(); }
  });

  $('[data-skip]')?.addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
  /* ---------- DRAWER & MODAL ---------- */
  const drawer = $('#drawer'), burger = $('#burger');
  const openDrawer = () => { drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); };
  function closeDrawer() { drawer.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.onclick = openDrawer; $('#drawerClose').onclick = closeDrawer;
  const modal = $('#taster'); let lastFocus;
  function openTaster() { closeDrawer(); lastFocus = document.activeElement; modal.classList.add('open'); lenis && lenis.stop(); setTimeout(() => $('#tName')?.focus(), 300); }
  function closeTaster() { modal.classList.remove('open'); lenis && lenis.start(); if (location.hash === '#taster') history.replaceState(null, '', '#' + (current || 'home')); lastFocus && lastFocus.focus && lastFocus.focus(); }
  $('#tClose').onclick = closeTaster;
  modal.addEventListener('click', e => { if (e.target === modal) closeTaster(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (modal.classList.contains('open')) closeTaster(); closeDrawer(); } });

  /* ---------- FORMS ---------- */
  const live = document.createElement('div'); live.className = 'sr'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);
  const announce = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 50); };
  const successHTML = {
    taster: ['Your taster class is reserved', 'We’ve emailed your confirmation. Our team has also been notified and will confirm your teacher and class link shortly.', '<a class="btn btn-primary" href="#packages">Next: select a plan</a>'],
    contact: ['Message sent', 'A copy is on its way to your email and the right team member will reply within one working day.', ''],
    review: ['Jazakum Allahu khayran', 'Thank you for your feedback. It will appear once our team has reviewed it.', ''],
    custom: ['Request received', 'We’ve emailed you a copy. Our team will send a tailored quote within one working day.', ''],
    teach: ['Application received', 'Our academic lead will review your application and contact you within 5 working days.', ''],
  };
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]'); if (!f) return;
    e.preventDefault();
    const bad = $$('[required]', f).filter(i => i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)));
    $$('.err', f).forEach(x => x.remove());
    if (bad.length) { bad.forEach(i => { i.setAttribute('aria-invalid', 'true'); const lbl = i.closest('label, .captcha'); lbl && lbl.insertAdjacentHTML('beforeend', `<span class="err" style="color:#B3412F;font:700 13px/1.2 var(--ui)">${i.type === 'checkbox' ? 'Tick this box to continue' : i.type === 'email' && i.value ? 'Enter a valid email, like name@example.com' : 'Fill in this field to continue'}</span>`); }); bad[0].focus(); announce(bad.length === 1 ? '1 field needs attention' : bad.length + ' fields need attention'); return; }
    const [h, p, extra] = successHTML[f.dataset.form];
    const holder = f.parentElement; const original = holder.innerHTML;
    holder.innerHTML = `<div class="success" role="status"><span class="tick">${icon('i-check', 36)}</span><h3 class="h3">${h}</h3><p style="color:var(--muted);max-width:440px">${p}</p><div class="row" style="justify-content:center">${extra}<button class="btn btn-outline" type="button" data-reset>Done</button></div></div>`;
    holder.querySelector('.tick').style.color = 'var(--ok)';
    holder.querySelector('[data-reset]').onclick = () => { holder.innerHTML = original; if (f.dataset.form === 'taster') closeTaster(); };
    holder.querySelector('.btn-primary')?.addEventListener('click', closeTaster);
  });
  document.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid')) { e.target.removeAttribute('aria-invalid'); e.target.closest('label')?.querySelector('.err')?.remove(); } });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-chips] button'); if (!b) return;
    const g = b.parentElement; if (g.dataset.chips === 'single') $$('button', g).forEach(x => x.classList.toggle('on', x === b)); else b.classList.toggle('on');
  });
  // contact purpose
  const notes = { general: 'Goes to our admissions team.', taster: 'Goes to admissions. Tip: you can book a free taster class from any page.', packages: 'Goes to admissions — we’ll help you choose the right plan.', custom: 'Goes to admissions. Tell us ages, levels and preferred days and we’ll send a quote.', teach: 'Goes to our academic lead. Please attach your CV and certificates.', partner: 'Goes to our management team.', feedback: 'Goes directly to the Master Admin and is handled confidentially.' };
  document.addEventListener('change', e => {
    if (e.target.id !== 'ctPurpose') return; const v = e.target.value;
    $('#ctNote').textContent = notes[v]; $('#ctCvWrap').hidden = v !== 'teach';
    const sel = $('#ctExtra'), lbl = $('#ctExtraLbl');
    if (v === 'teach') { lbl.textContent = 'Subjects you teach'; sel.innerHTML = '<option>Qur’an &amp; Tajweed</option><option>Arabic Language</option><option>Islamic Studies</option>'; }
    else if (v === 'custom') { lbl.textContent = 'Number of learners'; sel.innerHTML = '<option>1</option><option>2</option><option>3–5</option><option>6+</option>'; }
    else { lbl.textContent = 'I am a…'; sel.innerHTML = '<option>Prospective student</option><option>Parent / guardian</option><option>Current student</option><option>Organisation</option>'; }
  });
  $('#modeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; mode = b.dataset.mode; $$('#modeSeg button').forEach(x => x.classList.toggle('on', x === b)); renderPlans(); observeReveals(); });
  $('#copyLink').onclick = async () => { try { await navigator.clipboard.writeText(location.href); $('#copied').textContent = 'Link copied'; } catch { $('#copied').textContent = 'Copy the address from your browser'; } };
  $('#addCal').onclick = e => { e.target.textContent = 'Added to calendar ✓'; };

  /* ---------- CHECKOUT ---------- */
  const co = { step: 0, plan: 'b10', days: ['Tue', 'Sat'], time: 'Evening' };
  function renderCheckout() {
    const ps = planDefs(false).filter(p => !p.custom), P = ps.find(p => p.id === co.plan) || ps[1];
    $('#coSteps').innerHTML = ['Package', 'Details', 'Schedule', 'Payment'].map((l, i) => `<li class="${i <= co.step ? 'on' : ''}"><i>${i < co.step ? '✓' : i + 1}</i>${l}</li>`).join('');
    $('#coPlan').textContent = P.name; $('#coDesc').textContent = P.desc; $('#coPrice').textContent = P.price; $('#coSched').textContent = (co.days.join(', ') || '—') + ' · ' + co.time;
    const nav = co.step < 4 ? `<div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:22px;margin-top:auto"><button class="btn btn-outline" data-co="-1" ${co.step === 0 ? 'disabled style="opacity:.4"' : ''}>Back</button><button class="btn btn-primary" data-co="1">${co.step === 3 ? 'Pay ' + P.price + ' securely' : 'Continue'} ${icon('i-arrow', 18, 'arr')}</button></div>` : '';
    const chip = (arr, v, multi) => `<div class="chips" data-co-chips="${multi ? 'days' : 'time'}">${arr.map(x => `<button type="button" class="${(multi ? co.days.includes(x) : co.time === x) ? 'on' : ''}">${x}</button>`).join('')}</div>`;
    const views = [
      `<h2 class="h3">Select your package</h2><div class="planpick">${ps.map(p => `<button type="button" class="${p.id === co.plan ? 'on' : ''}" data-pick="${p.id}"><b>${p.name}</b><span style="font-size:14px;color:var(--muted)">${p.desc}</span><strong>${p.price}</strong></button>`).join('')}</div><a class="link" href="#packages" data-scroll="custom">Need a custom pack? Describe it here ${icon('i-arrow', 18, 'arr')}</a>`,
      `<h2 class="h3">Your details</h2><div class="fgrid"><label class="field" for="coN">Learner’s full name<input id="coN" placeholder="e.g. Aisha Rahman"></label><label class="field" for="coT">Learner type<select id="coT"><option>Adult</option><option>Child (under 16)</option></select></label><label class="field" for="coE">Email<input id="coE" type="email" placeholder="you@example.com"></label><label class="field" for="coP">Phone / WhatsApp<input id="coP" type="tel" placeholder="Phone number"></label><label class="field" for="coL">Current level<select id="coL"><option>Complete beginner</option><option>Some experience</option><option>Intermediate</option></select></label><label class="field" for="coS">Subject<select id="coS"><option>Qur’an Reading &amp; Tajweed</option><option>Arabic Language</option><option>Islamic Studies</option></select></label></div>`,
      `<h2 class="h3">Set your schedule &amp; times</h2><p class="lead" style="font-size:16px">Pick the days and time that suit you. We’ll match you with an available teacher.</p><div class="stack" style="gap:8px"><b style="font:700 14px/1 var(--ui)">Days</b>${chip(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], null, true)}</div><div class="stack" style="gap:8px"><b style="font:700 14px/1 var(--ui)">Time</b>${chip(['Early morning', 'Morning', 'Afternoon', 'Evening'], null, false)}</div><div class="fgrid"><label class="field" for="coD">Start date<input id="coD" type="date" value="2026-11-18"></label><label class="field" for="coF">Format<select id="coF"><option>Online</option><option>In person</option></select></label></div>`,
      `<h2 class="h3">Payment</h2><div class="chips" data-chips="single"><button type="button" class="on">Card</button><button type="button">Apple Pay</button><button type="button">Google Pay</button></div><div class="fgrid"><label class="field" for="coCN" style="grid-column:1/-1">Card number<input id="coCN" inputmode="numeric" placeholder="4242 4242 4242 4242"></label><label class="field" for="coX">Expiry<input id="coX" placeholder="MM / YY"></label><label class="field" for="coC">CVC<input id="coC" placeholder="123"></label></div><p class="note">Demo only. Card details are handled by Stripe and never stored by SOU.</p>`,
      `<div class="success" role="status"><span class="tick" style="color:var(--ok)">${icon('i-check', 36)}</span><h2 class="h2">Welcome to SOU</h2><p class="lead" style="max-width:520px">Payment received. Your <b>orientation pack</b> — welcome guide, materials and class links — is on its way to your email.</p><a class="btn btn-primary" href="#home">Back to home</a></div>`,
    ];
    $('#coMain').innerHTML = views[co.step] + nav;
  }
  $('#coMain').addEventListener('click', e => {
    const d = e.target.closest('[data-co]'); if (d && !d.disabled) { co.step = Math.max(0, Math.min(4, co.step + +d.dataset.co)); renderCheckout(); scrollToY(0); return; }
    const p = e.target.closest('[data-pick]'); if (p) { co.plan = p.dataset.pick; renderCheckout(); return; }
    const c = e.target.closest('[data-co-chips] button'); if (c) { const g = c.parentElement.dataset.coChips; if (g === 'days') { const v = c.textContent; co.days = co.days.includes(v) ? co.days.filter(x => x !== v) : [...co.days, v]; } else co.time = c.textContent; renderCheckout(); }
  });

  /* ---------- INIT ---------- */
  renderStatic(); renderPosts(); renderReviews(); renderPlans(); splitWords(); renderCal();
  tabs($('#evTabs'), [['all', 'All'], ['events', 'Events'], ['offers', 'Offers'], ['news', 'News']], id => { evFilter = id; evDay = 0; renderCal(); });
  tabs($('#postTabs'), [['all', 'All'], ['flyer', 'Flyers & offers'], ['class', 'New classes'], ['blog', 'Blog']], id => renderPostGrid(id));
  tabs($('#rvTabs'), [['all', 'All'], ['quran', 'Qur’an & Tajweed'], ['arabic', 'Arabic'], ['islamic', 'Islamic Studies'], ['parents', 'Parents']], id => renderReviews(id));
  addStars(); initSplits(); bindTilt();
  showSlide(0); slRestart();
  route();
  if (motionOn()) { curtain.classList.add('cover'); curtain.style.transition = 'none'; requestAnimationFrame(() => { curtain.style.transition = ''; withIntro(); }); }
  function withIntro() { curtain.classList.add('leave'); curtain.classList.remove('cover'); setTimeout(() => { curtain.classList.remove('leave'); curtain.style.transition = 'none'; curtain.style.transform = 'translateY(100%)'; void curtain.offsetWidth; curtain.style.transition = ''; curtain.style.transform = ''; }, 750); }
  cfRender = [coverflow($('#cf'), courses, $('#cfPrev'), $('#cfNext')), coverflow($('#cf2'), featured, $('#cf2Prev'), $('#cf2Next'))];
  observeReveals();
})();
