/* SOU single-site app: hash router, data-rendered sections, Totopia-style motion */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // Animations are always on for every visitor
  const reduce = false;
  const SOU_EMAIL = 'studentsoftheummah@gmail.com';
  const icon = (id, s = 18, cls = '') => `<svg width="${s}" height="${s}" class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  if (!reduce && 'IntersectionObserver' in window) document.documentElement.classList.add('motion');
  else document.documentElement.classList.add('no-motion');

  /* ---------- DATA ---------- */
  const posts = [
    { cat: 'flyer', tag: 'Flyer', date: '10 Nov 2026', title: 'Winter term timetable is now live', img: 'post-flyer.jpg', alt: 'Ornate study hall with bookshelves' },
    { cat: 'class', tag: 'New class', date: '08 Nov 2026', title: 'Tajweed for Beginners: new evening cohort', img: 'post-class.jpg', alt: 'Open Qur’an with prayer beads' },
    { cat: 'blog', tag: 'Blog', date: '02 Nov 2026', title: '5 habits that help adult learners stay consistent', img: 'post-blog.jpg', alt: 'Laptop, notebook and pens' },
    { cat: 'blog', tag: 'Blog', date: '28 Oct 2026', title: 'Making the most of online Qur’an lessons', img: 'about-online.jpg', alt: 'Laptop ready for an online lesson' },
    { cat: 'class', tag: 'New class', date: '20 Oct 2026', title: 'Weekend Hifz circle for students', img: 'hero2.jpg', alt: 'Qur’an on a stand over a prayer rug' },
    { cat: 'flyer', tag: 'Offer', date: '14 Oct 2026', title: 'Bundle offer: 2 bonus lessons this term', img: 2 },
  ];
  const tones = [['#8A6F4D', '#FFF7EF'], ['#D6B98C', '#2B2B2B'], ['#2B2B2B', '#FFF7EF'], ['#6E583C', '#FFF7EF']];
  const reviews = [
    ['islamic', 'A', 'Anonymous student', 'Islamic Studies · 18+', 'My teacher is so kind, patient and always ensuring I understand before moving on.', 5],
    ['islamic', 'A', 'Anonymous student', 'Islamic Studies · 18+', 'The PowerPoints are also provided before each lesson, which is really helpful as it allows you to know what to expect and prepare beforehand.', 5],
    ['islamic', 'A', 'Anonymous student', 'Islamic Studies · 18+', 'The pace of the lessons is really good. There’s enough time to take detailed notes and reflect without ever feeling rushed.', 5],
    ['islamic', 'A', 'Anonymous student', 'Islamic Studies · 18+', 'We learn key terms, what is mandatory and what is Sunnah, as well as practical ways to get closer to Allah SWT and improve our relationship with Him.', 5],
    ['islamic', 'A', 'Anonymous student', 'Islamic Studies · 18+', 'I’ve really been enjoying my Islamic Studies lessons. The lessons go into such beautiful detail about our deen, starting right from the very beginning. They are perfect for anyone who wants to build a strong foundation or strengthen their existing knowledge.', 5],
  ];
  const steps = [
    ['Sample a class', 'Book a free taster lesson and meet a teacher with no commitment.', ['Choose a subject and a preferred time', 'Reservation confirmed by email', 'Our team is notified to assign a teacher']],
    ['Select a plan', 'Pick a single lesson, a bundle or ask us for a custom pack.', ['Clear pricing, no hidden fees', 'Secure online checkout', 'Custom packs arranged by our team']],
    ['Set schedule & times', 'Choose the days and times that work around your week.', ['Weekday, evening and weekend slots', 'Live online classes', 'Change your schedule with notice']],
    ['Receive orientation pack', 'Get your welcome guide, materials and class links by email.', ['Welcome guide and timetable', 'Class links and portal login', 'Workbook for your level']],
    ['Begin study', 'Start learning with steady support and progress check-ins.', ['Progress tracker and teacher feedback', 'Homework quick quizzes', 'Diary notes linked to lesson videos']],
  ];
  const courses = [
    { href: '#taster', taster: true, subject: 'Arabic Language', cta: 'Book a free taster', t: 'Discover the beauty of the Arabic language', d: 'Build your Arabic skills through structured lessons designed to develop your understanding, confidence and fluency.', img: 'banner-teacher.jpg', tags: ['Arabic'] },
    { href: '#taster', taster: true, subject: 'Islamic Studies', cta: 'Book a free taster', t: 'Grow in knowledge, strengthen your Deen', d: 'Embark on a journey of learning that deepens your understanding of Islam, strengthens your faith and inspires you to become a better Muslim.', img: 'lesson-islamic.jpg', tags: ['Islamic Studies'] },
    { href: '#taster', taster: true, subject: 'Qur’an Reading & Tajweed', cta: 'Book a free taster', t: 'Build a lasting connection with the Qur’an', d: 'Strengthen your recitation, discover the beauty of its teachings and make the words of Allah a guiding light in your everyday life.', img: 'lesson-quran.jpg', tags: ['Qur’an'] },
  ];
  const featured = [
    { href: '#post', cta: 'Read more', t: 'The winter timetable is here', d: 'New evening and weekend slots for every subject.', img: 'post-flyer.jpg', tags: ['Flyer'] },
    { href: '#post', cta: 'Read more', t: 'Tajweed for Beginners — evening cohort', d: 'A 10-week course for adults, starting 18 November.', img: 'post-class.jpg', tags: ['New class'] },
    { href: '#post', cta: 'Read more', t: 'Two bonus lessons on every bundle', d: 'Book any bundle before 30 November.', img: 'hero1.jpg', tags: ['Offer'] },
    { href: '#post', cta: 'Read more', t: 'Online open day & Q&A', d: 'Meet our teachers live on 6 November, 7 PM.', img: 'about-online.jpg', tags: ['Event'] },
    { href: '#post', cta: 'Read more', t: 'Weekend Hifz circle for students', d: 'Small groups, Saturdays and Sundays.', img: 'hero2.jpg', tags: ['New class'] },
  ];
  const teachers = [['Y', 'Yasmine', 'Founder', 'Founder of Students of the Ummah.'], ['HB', 'Ustadha Hafssa B', 'Head of Islamic Studies', 'Leads our Islamic Studies programme.'], ['H', 'Ustadha Hanan', 'Head of Arabic', 'Leads our Arabic language programme.'], ['H', 'Ustadha Hadjer', 'Head of Qur’an', 'Leads our Qur’an and recitation programme.'], ['S', 'Ustadha Safia', 'Head of Qaidah', 'Leads our Qaidah (reading foundations) programme.']];
  const faqs = [['Is the taster class really free?', 'Yes. Your first taster class is completely free and there is no obligation to buy a package afterwards.'], ['Who are the teachers?', 'Qualified, vetted teachers with recognised training — many with ijazah — trained in the SOU curriculum and safeguarding checked.'], ['Who are the classes for?', 'Our classes are for learners aged 16 and over — college and university students as well as working adults.'], ['What if I need to change my schedule?', 'Request a change in your student portal or contact us. We ask for 24 hours’ notice for lesson changes.'], ['Do you offer group lessons?', 'Yes. Group lessons are £45/month with up to 5 students a class, or £40/month when you join with a friend or sibling. For anything else, choose a Custom pack and we will send you a tailored quote.'], ['How do I know which level I am?', 'Take our short online assessment for your chosen subject. Your teacher will then double-check your level of knowledge, recitation and speaking in a second assessment.']];
  const events = [{ d: 6, k: 'events', tag: 'Event', t: 'Online open day & Q&A', m: '7:00 PM · Live online' }, { d: 14, k: 'offers', tag: 'Offer', t: 'Bundle bonus lessons begin', m: 'Until 30 Nov' }, { d: 18, k: 'events', tag: 'Event', t: 'Tajweed evening cohort starts', m: '6:30 PM · Live online' }, { d: 18, k: 'news', tag: 'News', t: 'Teacher spotlight: Ustadha Hanan', m: 'Blog post' }, { d: 22, k: 'news', tag: 'News', t: 'Winter timetable published', m: 'Announcement' }, { d: 27, k: 'events', tag: 'Event', t: 'Arabic grammar weekend intensive', m: '10:00 AM – 1:00 PM · Live online' }];
  const evColor = { events: '#8A6F4D', offers: '#D6B98C', news: '#2B2B2B' };
  const planDefs = () => [
    { id: 'single', name: 'Single lesson', desc: 'Private one-to-one lessons in one subject.', price: '£60', unit: '/ month', feats: ['Arabic, Islamic Studies or Qur’an', 'Live private 45-minute lessons', '40-minute lesson + 5-minute Q&A (flexible)', '4 lessons a month (1 per week)', 'Lesson materials provided', 'Flexible times available'], cta: 'Pay now' },
    { id: 'group', name: 'Group lessons', desc: 'Learn together in a small live class.', price: '£45', unit: '/ month', save: '£40/month when you join with a friend or sibling', feats: ['Arabic, Islamic Studies or Qur’an', 'Live lessons, 5 students a class', '1-hour lessons', '50-minute lesson + 10-minute Q&A (fixed)', '4 lessons a month (1 fixed time per week)', 'Lesson materials provided'], cta: 'Pay now' },
    { id: 'bundle', name: 'Monthly bundle', desc: 'All three subjects taught weekly.', price: '£90', unit: '/ month', feats: ['Arabic, Islamic Studies and Qur’an', 'Live private 45-minute lessons', '35-minute lesson + 10-minute Q&A (fixed)', '4 lessons a month (1 fixed time per week)', 'Lesson materials provided'], cta: 'Pay now', feat: true, badge: 'All 3 subjects' },
    { id: 'crash', name: 'Crash course', desc: 'Fastest way to gain knowledge in a short time.', price: '£300', unit: '/ 15 lessons', feats: ['Choose one short course', 'Arabic reading & writing, Seerah, Fiqh of prayer and more'], cta: 'Pay now', hide: true },
    { id: 'custom', name: 'Custom pack', desc: 'Choose how you learn — e.g. Qaida only, memorisation, Seerah, Fiqh or Aqeedah.', price: 'Custom', unit: 'quoted for you', feats: ['Pick the subjects you want', 'Your preferred schedule', 'Personal learning plan', 'Contact us to describe your pack'], cta: 'Describe your pack', custom: true },
  ];
  const crash = ['Arabic reading and writing', 'Seerah of the Prophet ﷺ', 'Introduction to Islam (basics)', 'Fiqh of prayer (salah) and how to pray', 'Understanding halal and haram', 'Juz ‘Amma course'];
  const levels = [['01', 'Beginners', 'Start from the foundations, step by step, with a patient teacher.'], ['02', 'Intermediate', 'Build on the basics towards confidence and fluency.'], ['03', 'Advanced', 'Deepen your knowledge, accuracy and understanding.'], ['04', 'Refresher courses', 'Revisit and strengthen what you have learned before.']];

  /* ---------- RENDERERS ---------- */
  const postCard = (p) => `<a class="post rv-up" href="#post"><span class="img"><img src="assets/${p.img}" alt="${p.alt}" width="800" height="534" loading="lazy" decoding="async"></span><span class="body"><span class="meta"><span class="chip">${p.tag}</span>${p.date}</span><h3>${p.title}</h3><span class="link">Read more ${icon('i-arrow', 18, 'arr')}</span></span></a>`;
  const reviewCard = (r, i) => `<figure class="rv rv-up" style="background:var(--white)"><span class="row" style="justify-content:space-between"><span class="stars" role="img" aria-label="${r[5]} out of 5">${[1, 2, 3, 4, 5].map(n => `<span class="${n <= r[5] ? '' : 'off'}">${icon('i-star', 18)}</span>`).join('')}</span></span><blockquote>“${r[4]}”</blockquote><figcaption><span class="av" style="background:${tones[i % 4][0]};color:${tones[i % 4][1]}">${r[1]}</span><span><b style="display:block;font-family:var(--ui)">${r[2]}</b><span style="font-size:13px;color:var(--muted)">${r[3]}</span></span><span class="verified">Verified</span></figcaption></figure>`;
  const planCard = (p) => `<div class="plan rv-up ${p.feat ? 'feat' : ''}"><span class="row" style="justify-content:space-between"><h3>${p.name}</h3>${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</span><span class="desc">${p.desc}</span><span class="price"><b>${p.price}</b><span>${p.unit}</span></span>${p.save ? `<span class="save">${p.save}</span>` : ''}<ul>${p.feats.map(f => `<li>${f}</li>`).join('')}</ul><a class="btn ${p.feat ? 'btn-primary' : 'btn-outline'}" href="${p.custom ? '#packages' : '#enrol'}" data-plan="${p.id}" ${p.custom ? 'data-scroll="custom"' : ''} ${!p.custom && p.cta === 'Pay now' ? `data-pay="${p.id}"` : ''}>${p.cta}</a></div>`;

  function renderPosts() {
    $$('[data-posts]').forEach(el => { if (el.id === 'postGrid') return; el.innerHTML = posts.slice(0, 3).map(postCard).join(''); });
    renderPostGrid('all');
  }
  function renderPostGrid(cat) { $('#postGrid').innerHTML = posts.filter(p => cat === 'all' || p.cat === cat).map(postCard).join(''); }
  function renderReviews(f = 'all') {
    $$('[data-reviews="3"]').forEach(el => el.innerHTML = reviews.slice(0, 3).map(reviewCard).join(''));
    $('#rvGrid').innerHTML = reviews.map(reviewCard).join('');
  }
  function renderPlans() {
    const ps = planDefs().filter(p => !p.hide);
    $$('[data-plans]').forEach(el => el.innerHTML = ps.map(planCard).join(''));
  }
  function tabs(el, items, onPick) {
    el.innerHTML = items.map(([id, l], i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-id="${id}">${l}</button>`).join('');
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); onPick(b.dataset.id); observeReveals(); });
  }

  function renderStatic() {
    $$('[data-steps]').forEach(el => el.innerHTML = steps.map((s, i) => `<li class="step ${i === 0 ? 'first' : ''}"><span class="n">0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join(''));
    $('[data-steps-detail]').innerHTML = steps.map((s, i) => `<div class="split rv-up" style="align-items:flex-start;gap:40px;padding-block:44px;border-top:${i ? '1px solid var(--line)' : '0'}"><div class="row" style="flex:1;gap:24px;flex-wrap:nowrap;align-items:flex-start"><span class="step-n" style="flex:none;width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:600 32px/1 var(--display);${i === 0 ? 'background:var(--bronze);color:var(--white)' : 'background:var(--sand);border:1px solid var(--tan);color:var(--bronze-dk)'}">0${i + 1}</span><div class="stack" style="gap:12px"><span class="eyebrow">Step 0${i + 1}</span><h2 class="h3" style="font-size:34px">${s[0]}</h2><p class="lead">${s[1]}</p></div></div><div class="card" style="flex:1"><span class="eyebrow" style="font-size:12px">What happens</span>${s[2].map(p => `<span class="row" style="flex-wrap:nowrap;gap:10px;align-items:flex-start">${icon('i-check', 20)}<span>${p}</span></span>`).join('')}</div></div>`).join('') + `<div class="row rv-up" style="padding-top:32px;border-top:1px solid var(--line)"><button class="btn btn-primary" data-taster>Start step 1 — Book a Taster Class</button><a class="btn btn-outline" href="#packages">Compare packages</a></div>`;
    $('[data-teachers]').innerHTML = teachers.map((t, i) => `<div class="card lift rv-up member"><span class="av" style="background:${tones[i % 4][0]};color:${tones[i % 4][1]}">${t[0]}</span><span class="who"><h3>${t[1]}</h3><b>${t[2]}</b><p>${t[3]}</p></span></div>`).join('');
    $('[data-faq]').innerHTML = faqs.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
    $('[data-process]').innerHTML = [['Apply online', 'Send your details, CV and certificates.'], ['Interview', 'A short video call with our academic lead.'], ['Demo lesson', 'Teach a 20-minute sample lesson.'], ['Onboarding', 'Safeguarding checks, portal training and your first students.']].map((p, i, a) => `<li class="row" style="flex-wrap:nowrap;align-items:stretch;gap:16px"><span style="display:flex;flex-direction:column;align-items:center"><span style="width:44px;height:44px;border-radius:50%;background:var(--bronze);display:flex;align-items:center;justify-content:center;font:600 18px/1 var(--display)">${i + 1}</span>${i < a.length - 1 ? '<span style="flex:1;width:2px;background:var(--bronze);min-height:20px"></span>' : ''}</span><span style="padding:8px 0 24px"><b style="display:block;font:600 22px/1.1 var(--display)">${p[0]}</b><span style="color:var(--tan);font-size:15px">${p[1]}</span></span></li>`).join('');
    $('#bars').innerHTML = [[5, 88], [4, 9], [3, 2], [2, 1], [1, 0]].map(([n, p]) => `<span class="row" style="gap:10px;flex-wrap:nowrap;font:700 13px/1 var(--ui)"><span style="width:14px">${n}</span><span style="flex:1;height:8px;border-radius:999px;background:var(--sand)"><span class="bar" data-w="${p}" style="display:block;height:8px;border-radius:999px;background:var(--bronze);width:100%;transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease)"></span></span><span style="width:34px;text-align:right;color:var(--muted)">${p}%</span></span>`).join('');
    $('#cmp').innerHTML = [['Price', '£60 / month', '£45 / month', '£90 / month', '£300 / 15 lessons'], ['Subjects', '1 of Arabic, Islamic Studies or Qur’an', '1 of Arabic, Islamic Studies or Qur’an', 'All three, weekly', '1 short course'], ['Lesson type', 'Live, private', 'Live, up to 5 students', 'Live, private', 'Live'], ['Lesson length', '45 min (40 + 5 Q&A)', '1 hour (50 + 10 Q&A)', '45 min (35 + 10 Q&A)', '—'], ['Lessons', '4 a month (1 per week)', '4 a month (1 per week)', '4 a month (1 per week)', '15 lessons'], ['Schedule', 'Flexible times', 'Fixed weekly time', 'Fixed weekly time', 'Agreed with you'], ['Lesson materials', 'CHK', 'CHK', 'CHK', 'CHK']].map(r => `<tr><td>${r[0]}</td>${r.slice(1).map((v, k) => `<td class="c"${k === 2 ? ' style="background:#FFFBF5"' : ''}>${v === 'CHK' ? `<span class="tick-c" aria-label="Included">${icon('i-check', 20)}</span>` : v}</td>`).join('')}</tr>`).join('');
    $$('[data-courses]').forEach(el => el.innerHTML = courses.map(c => `<a class="post course rv-up" href="#taster" data-taster data-subject="${c.subject}"><span class="img"><img src="assets/${c.img}" alt="" width="800" height="534" loading="lazy" decoding="async"></span><span class="body"><span class="meta"><span class="chip">${c.tags[0]}</span></span><h3>${c.t}</h3><p>${c.d}</p><span class="link">${c.cta} ${icon('i-arrow', 18, 'arr')}</span></span></a>`).join(''));
    $$('[data-levels]').forEach(el => el.innerHTML = levels.map(l => `<div class="lvl rv-up"><span class="n">${l[0]}</span><h3>${l[1]}</h3><p>${l[2]}</p></div>`).join(''));
    $$('[data-crash]').forEach(el => el.innerHTML = crash.map(c => `<li>${icon('i-check', 20)}<span>${c}</span></li>`).join(''));
    $$('[data-captcha]').forEach(el => el.outerHTML = `<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="captcha"><label><input type="checkbox" required> I’m not a robot</label><small class="row" style="gap:6px">${icon('i-shield', 16)}CAPTCHA spam protection</small></div>`);
    // stars
    const st = $('#stars'); let rating = 5;
    const drawStars = () => st.innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${n === rating}" aria-label="${n} star${n > 1 ? 's' : ''}" data-n="${n}" style="width:44px;height:44px;border:0;background:none;cursor:pointer;color:${n <= rating ? '#8A6F4D' : '#E4CFAE'}">${icon('i-star', 30)}</button>`).join('');
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
    { side: 'left', t: 'Everything You Need to Learn, <span class="hl">All in One Place.</span>', b: 'From interactive student dashboards and video lessons to direct access to teachers, quizzes and exams — experience Islamic learning in one structured environment.' },
    { side: 'left', t: 'Learn With Confidence, <span class="hl">Every Step of the Way.</span>', b: 'With experienced and supportive teachers by your side, feel empowered to progress in your Islamic studies at your own pace.' },
    { side: 'left-light', t: 'Study Islam From the Comfort of <span class="hl">Your Home.</span>', b: 'Flexible online learning designed to fit around your life, at a pace that works for you.' },
  ];
  let sl = 0, slTimer;
  function showSlide(i) {
    sl = (i + slides.length) % slides.length; const s = slides[sl];
    $$('.banner-imgs img').forEach((im, j) => {
      if (j === sl) { im.classList.remove('out'); im.classList.add('on'); }
      else if (im.classList.contains('on')) { im.classList.remove('on'); im.classList.add('out'); }
      else if (im.classList.contains('out')) { im.style.transition = 'none'; im.classList.remove('out'); void im.offsetWidth; im.style.transition = ''; }
    });
    const cap = $('.banner-cap'), ban = $('.banner');
    cap.classList.add('swap');
    setTimeout(() => {
      ban.dataset.side = s.side; $('#slTitle').innerHTML = s.t; $('#slBody').textContent = s.b;
      cap.classList.add('enter'); cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.remove('enter');
    }, reduce ? 0 : 500);
  }
  let slPaused = false;
  const slRestart = () => { clearInterval(slTimer); if (!reduce && !slPaused) slTimer = setInterval(() => showSlide(sl + 1), 6000); };

  /* ---------- RAILS: same-size cards that slide right to left, like the hero ---------- */
  function initRail(rail) {
    const track = rail.querySelector('.rail-track'); if (!track || track.dataset.ready) return;
    const items = [...track.children], n = items.length; if (n < 2) return;
    track.dataset.ready = '1';
    // a copy of every card follows the originals, so the loop never shows a gap
    items.forEach(it => { const c = it.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.removeAttribute('id'); track.append(c); });
    let idx = 0, timer;
    const step = () => { const k = track.children; return k[1].getBoundingClientRect().left - k[0].getBoundingClientRect().left; };
    const place = (anim) => { track.style.transition = anim ? '' : 'none'; track.style.transform = `translateX(${-idx * step()}px)`; if (!anim) { void track.offsetWidth; track.style.transition = ''; } };
    track.addEventListener('transitionend', e => { if (e.target === track && idx >= n) { idx = 0; place(false); } });
    const next = () => { if (rail.offsetParent === null || document.hidden) return; idx++; place(true); };
    const start = () => { clearInterval(timer); timer = setInterval(next, 3500); };
    rail.addEventListener('pointerenter', () => clearInterval(timer)); rail.addEventListener('pointerleave', start);
    window.addEventListener('resize', () => place(false));
    start();
  }
  // (rails start in INIT below, once the teacher cards have been rendered)

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
      const hlText = $$('.hl-word', p).map(h => h.textContent).join(' ');
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
  // scroll effects (the header always stays in place)
  let lastY = 0;
  function onScroll(y) {
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
  // page-change curtain
  const curtain = document.createElement('div'); curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="mark"><img src="assets/logo.png" alt="" width="549" height="167"></span>';
  document.body.append(curtain);
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
    loadForms(page);
    if (id === 'checkout') renderCheckout();
    if (id === 'enrol') { fillEnrolPlans(); const P = planDefs().find(p => p.id === co.plan), n = $('#enrolPlan'); if (P && co.picked) { n.hidden = false; n.innerHTML = `You chose <b>&nbsp;${P.name} — ${P.price} ${P.unit}</b>. Please mention this in the form.`; } else n.hidden = true; }
    if (id === 'assessment') renderAssess();
  }
  let current = null;
  window.addEventListener('hashchange', route);
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-scroll]');
    if (s) {
      const target = document.getElementById(s.dataset.scroll);
      if (target) { e.preventDefault(); const page = s.getAttribute('href'); if (page && page !== '#' + current && page.startsWith('#') && pages.includes(page.slice(1))) { location.hash = page; setTimeout(() => scrollToY(target.getBoundingClientRect().top + scrollY - 100), 80); } else scrollToY(target.getBoundingClientRect().top + scrollY - 100); }
    }
    const pl = e.target.closest('[data-plan]'); if (pl && pl.dataset.plan !== 'custom') { co.plan = pl.dataset.plan; co.step = 0; co.picked = true; }
    if (e.target.closest('[data-taster]')) { e.preventDefault(); openTaster(); }
  });

  $('[data-skip]')?.addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
  /* ---------- DRAWER & MODAL ---------- */
  const drawer = $('#drawer'), burger = $('#burger');
  const openDrawer = () => { drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); };
  function closeDrawer() { drawer.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.onclick = openDrawer; $('#drawerClose').onclick = closeDrawer;
  const modal = $('#taster'); let lastFocus;
  // Google Forms load only when their page or the taster modal is opened
  const loadForms = (root) => root && $$('iframe[data-src]:not([src])', root).forEach(f => { f.src = f.dataset.src; });
  function openTaster() { loadForms(modal); closeDrawer(); lastFocus = document.activeElement; modal.classList.add('open'); lenis && lenis.stop(); setTimeout(() => $('#tClose')?.focus(), 300); }
  function closeTaster() { modal.classList.remove('open'); lenis && lenis.start(); if (location.hash === '#taster') history.replaceState(null, '', '#' + (current || 'home')); lastFocus && lastFocus.focus && lastFocus.focus(); }
  $('#tClose').onclick = closeTaster;
  modal.addEventListener('click', e => { if (e.target === modal) closeTaster(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (modal.classList.contains('open')) closeTaster(); closeDrawer(); } });

  /* ---------- FORMS ---------- */
  const live = document.createElement('div'); live.className = 'sr'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);
  const announce = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 50); };
  /* ---------- FORMS → SOU EMAIL ---------- */
  const formLabel = { taster: 'free trial booking', enrol: 'enrolment', contact: 'contact', review: 'review', custom: 'custom package', teach: 'teacher application' };
  // readable field name = the label's own text (without the * and error messages)
  const fieldName = (c) => { const l = c.closest('label'); if (!l) return c.name || c.id; return [...l.childNodes].filter(n => n.nodeType === 3 || (n.nodeName === 'SPAN' && !n.classList.contains('err'))).map(n => n.textContent).join('').replace(/\*/g, '').trim() || c.name; };
  async function sendToSOU(f) {
    const kind = f.dataset.form, fd = new FormData(), get = (n) => (f.querySelector(`[name=${n}]`)?.value || '').trim();
    $$('input, select, textarea', f).forEach(c => {
      if (c.type === 'checkbox' || c.type === 'radio' || c.classList.contains('hp') || c.closest('[hidden]')) return;
      if (c.type === 'file') { if (c.files[0]) fd.append('attachment', c.files[0]); return; }
      const v = c.tagName === 'SELECT' ? (c.selectedOptions[0]?.textContent || '') : c.value.trim();
      fd.append(fieldName(c), v || '—');
    });
    if (kind === 'review') fd.append('Rating', ($$('#stars [aria-checked="true"]')[0]?.dataset.n || '5') + ' / 5');
    const extra = kind === 'enrol' ? ` — ${$('#enPlan').selectedOptions[0]?.textContent || ''}` : kind === 'contact' ? ` (${$('#ctPurpose').selectedOptions[0]?.textContent || ''})` : '';
    fd.append('_subject', `SOU website: ${formLabel[kind] || kind}${extra} — ${get('name') || 'new submission'}`);
    fd.append('_template', 'table'); fd.append('_captcha', 'false');
    if (get('email')) fd.append('_replyto', get('email'));
    const res = await fetch('https://formsubmit.co/ajax/' + SOU_EMAIL, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || res.status);
  }
  function fillEnrolPlans() {
    const sel = $('#enPlan'); if (!sel) return;
    sel.innerHTML = '<option value="">Choose a package</option>' + planDefs().filter(p => !p.custom).map(p => `<option value="${p.id}">${p.name} (${p.price} ${p.unit})</option>`).join('');
    if (co.picked) sel.value = co.plan;
  }
  const successHTML = {
    taster: ['Your free trial request is sent', 'Thank you! Our team will email you shortly to confirm your teacher, day and time.', '<a class="btn btn-primary" href="#packages">See our packages</a>'],
    enrol: ['Enrolment received', 'Thank you! Our team will email you to confirm your package, teacher and schedule, with a secure payment link.', ''],
    contact: ['Message sent', 'Thank you! The right team member will reply within one working day.', ''],
    review: ['Thank you for your review', 'We appreciate your feedback. It will appear once our team has reviewed it.', ''],
    custom: ['Request received', 'Thank you! Our team will send you a tailored quote within one working day.', ''],
    teach: ['Application received', 'Our academic lead will review your application and contact you within 5 working days.', ''],
  };
  document.addEventListener('submit', async e => {
    const f = e.target.closest('form[data-form]'); if (!f) return;
    e.preventDefault();
    const bad = $$('[required]', f).filter(i => i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)));
    $$('.err', f).forEach(x => x.remove());
    if (bad.length) { bad.forEach(i => { i.setAttribute('aria-invalid', 'true'); const lbl = i.closest('label, .captcha'); lbl && lbl.insertAdjacentHTML('beforeend', `<span class="err" style="color:#B3412F;font:700 13px/1.2 var(--ui)">${i.type === 'checkbox' ? 'Tick this box to continue' : i.type === 'email' && i.value ? 'Enter a valid email, like name@example.com' : 'Fill in this field to continue'}</span>`); }); bad[0].focus(); announce(bad.length === 1 ? '1 field needs attention' : bad.length + ' fields need attention'); return; }
    // send everything to the SOU inbox (skipped silently for bots that fill the hidden field)
    const btn = f.querySelector('[type=submit]'), btnHTML = btn.innerHTML; $$('.form-fail', f).forEach(x => x.remove());
    if (!f.querySelector('input.hp')?.value) {
      btn.disabled = true; btn.textContent = 'Sending…';
      try { await sendToSOU(f); }
      catch (err) {
        const who = (f.querySelector('[name=name]')?.value || '').trim();
        const wa = encodeURIComponent(`Hello SOU, my name is ${who}. I tried to send the ${formLabel[f.dataset.form] || 'website'} form.`);
        btn.insertAdjacentHTML('beforebegin', `<p class="pay-err form-fail" role="alert">Sorry, we couldn’t send this just now. Please try again, or <a href="https://wa.me/447907411836?text=${wa}" target="_blank" rel="noopener">message us on WhatsApp</a> or email <a href="mailto:${SOU_EMAIL}">${SOU_EMAIL}</a>.</p>`);
        btn.disabled = false; btn.innerHTML = btnHTML; return;
      }
    }
    const [h, p, extra] = successHTML[f.dataset.form];
    const holder = f.parentElement; const original = holder.innerHTML;
    holder.innerHTML = `<div class="success" role="status"><span class="tick">${icon('i-check', 36)}</span><h3 class="h3">${h}</h3><p style="color:var(--muted);max-width:440px">${p}</p><div class="row" style="justify-content:center">${extra}<button class="btn btn-outline" type="button" data-reset>Done</button></div></div>`;
    holder.querySelector('.tick').style.color = 'var(--ok)';
    holder.querySelector('[data-reset]').onclick = () => { holder.innerHTML = original; if (f.dataset.form === 'enrol') fillEnrolPlans(); if (f.dataset.form === 'taster') closeTaster(); };
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
    else { lbl.textContent = 'I am a…'; sel.innerHTML = '<option>Prospective student</option><option>Current student</option><option>Organisation</option>'; }
  });
  $('#copyLink').onclick = async () => { try { await navigator.clipboard.writeText(location.href); $('#copied').textContent = 'Link copied'; } catch { $('#copied').textContent = 'Copy the address from your browser'; } };
  $('#addCal').onclick = e => { e.target.textContent = 'Added to calendar'; };

  /* ---------- CHECKOUT ---------- */
  const co = { step: 0, plan: 'bundle', days: ['Tue', 'Sat'], time: 'Evening' };
  function renderCheckout() {
    const ps = planDefs().filter(p => !p.custom), P = ps.find(p => p.id === co.plan) || ps[1];
    $('#coSteps').innerHTML = ['Package', 'Details', 'Schedule', 'Payment'].map((l, i) => `<li class="${i <= co.step ? 'on' : ''}"><i>${i < co.step ? icon('i-check', 14) : i + 1}</i>${l}</li>`).join('');
    $('#coPlan').textContent = P.name; $('#coDesc').textContent = P.desc; $('#coPrice').textContent = P.price; $('#coSched').textContent = (co.days.join(', ') || '—') + ' · ' + co.time;
    const nav = co.step < 4 ? `<div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:22px;margin-top:auto"><button class="btn btn-outline" data-co="-1" ${co.step === 0 ? 'disabled style="opacity:.4"' : ''}>Back</button><button class="btn btn-primary" data-co="1">${co.step === 3 ? 'Pay ' + P.price + ' securely' : 'Continue'} ${icon('i-arrow', 18, 'arr')}</button></div>` : '';
    const chip = (arr, v, multi) => `<div class="chips" data-co-chips="${multi ? 'days' : 'time'}">${arr.map(x => `<button type="button" class="${(multi ? co.days.includes(x) : co.time === x) ? 'on' : ''}">${x}</button>`).join('')}</div>`;
    const views = [
      `<h2 class="h3">Select your package</h2><div class="planpick">${ps.map(p => `<button type="button" class="${p.id === co.plan ? 'on' : ''}" data-pick="${p.id}"><b>${p.name}</b><span style="font-size:14px;color:var(--muted)">${p.desc}</span><strong>${p.price}</strong></button>`).join('')}</div><a class="link" href="#packages" data-scroll="custom">Need a custom pack? Describe it here ${icon('i-arrow', 18, 'arr')}</a>`,
      `<h2 class="h3">Your details</h2><div class="fgrid"><label class="field" for="coN">Learner’s full name<input id="coN" placeholder="e.g. Aisha Rahman"></label><label class="field" for="coT">Learner type<select id="coT"><option>College student (16+)</option><option>University student</option><option>Working adult</option></select></label><label class="field" for="coE">Email<input id="coE" type="email" placeholder="you@example.com"></label><label class="field" for="coP">Phone / WhatsApp<input id="coP" type="tel" placeholder="Phone number"></label><label class="field" for="coL">Current level<select id="coL"><option>Complete beginner</option><option>Some experience</option><option>Intermediate</option></select></label><label class="field" for="coS">Subject<select id="coS"><option>Qur’an Reading &amp; Tajweed</option><option>Arabic Language</option><option>Islamic Studies</option></select></label></div>`,
      `<h2 class="h3">Set your schedule &amp; times</h2><p class="lead" style="font-size:16px">Pick the days and time that suit you. We’ll match you with an available teacher.</p><div class="stack" style="gap:8px"><b style="font:700 14px/1 var(--ui)">Days</b>${chip(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], null, true)}</div><div class="stack" style="gap:8px"><b style="font:700 14px/1 var(--ui)">Time</b>${chip(['Early morning', 'Morning', 'Afternoon', 'Evening'], null, false)}</div><div class="fgrid"><label class="field" for="coD">Start date<input id="coD" type="date" value="2026-11-18"></label><label class="field" for="coF">Format<select id="coF"><option>Online</option></select></label></div>`,
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

  /* ---------- ASSESSMENT ---------- */

  /* ---------- PAY NOW (form is emailed to SOU) ---------- */
  const payModal = $('#pay'), payForm = $('#payForm'), payMainHTML = $('#payMain').innerHTML;
  let payLast;
  function payPlans() { return planDefs().filter(p => !p.custom && p.cta === 'Pay now'); }
  function drawPayPick() {
    const P = payPlans().find(p => p.id === $('#pyPlan').value);
    $('#payPick').innerHTML = P ? `<b>${P.name}</b><span>${P.price} <small>${P.unit}</small></span>` : '';
  }
  function openPay(id) {
    if (!$('#payForm')) $('#payMain').innerHTML = payMainHTML;
    const sel = $('#pyPlan');
    sel.innerHTML = '<option value="">Choose a package</option>' + payPlans().map(p => `<option value="${p.id}">${p.name} (${p.price})</option>`).join('');
    sel.value = id || ''; drawPayPick();
    closeDrawer(); payLast = document.activeElement; payModal.classList.add('open'); lenis && lenis.stop();
    setTimeout(() => $('#payClose')?.focus(), 300);
  }
  function closePay() { payModal.classList.remove('open'); lenis && lenis.start(); payLast && payLast.focus && payLast.focus(); }
  payModal.addEventListener('click', e => { if (e.target === payModal || e.target.closest('#payClose') || e.target.closest('[data-pay-close]')) closePay(); });
  payModal.addEventListener('change', e => { if (e.target.id === 'pyPlan') drawPayPick(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && payModal.classList.contains('open')) closePay(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-pay]'); if (b) { e.preventDefault(); openPay(b.dataset.pay); } });
  payModal.addEventListener('submit', async e => {
    const f = e.target.closest('#payForm'); if (!f) return;
    e.preventDefault();
    $$('.err', f).forEach(x => x.remove()); $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid'));
    const bad = $$('[required]', f).filter(i => i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)) || (i.id === 'pyAge' && +i.value < 16));
    if (bad.length) {
      bad.forEach(i => { i.setAttribute('aria-invalid', 'true'); const msg = i.type === 'checkbox' ? 'Please tick to continue' : i.id === 'pyAge' ? 'SOU lessons are for learners aged 16+' : i.type === 'email' && i.value ? 'Enter a valid email' : 'This field is required'; i.closest('label').insertAdjacentHTML('beforeend', `<span class="err" style="color:#B3412F;font:700 13px/1.2 var(--ui)">${msg}</span>`); });
      bad[0].focus(); return;
    }
    const P = payPlans().find(p => p.id === $('#pyPlan').value);
    const data = { _subject: `Pay now request: ${P ? P.name : 'Package'} — ${$('#pyName').value.trim()}`, _template: 'table', _captcha: 'false', _replyto: $('#pyEmail').value.trim() };
    $$('input[name], select[name], textarea[name]', f).forEach(i => { data[i.name] = i.id === 'pyPlan' ? (P ? `${P.name} — ${P.price} ${P.unit}` : '') : i.value.trim(); });
    const btn = $('#paySend'), err = $('#payErr');
    btn.disabled = true; btn.textContent = 'Sending…'; err.hidden = true;
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + SOU_EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || res.status);
      $('#payMain').innerHTML = `<button class="close" id="payClose" type="button" aria-label="Close">${icon('i-close', 18)}</button><div class="success" role="status"><span class="tick" style="color:var(--ok)">${icon('i-check', 36)}</span><h3 class="h3">Thank you, ${data['Full name'].split(' ')[0]}!</h3><p style="color:var(--muted);max-width:440px">Your details have been sent to the SOU team. We’ll email you a secure payment link and confirm your teacher and schedule within 1 working day.</p><button class="btn btn-primary" type="button" data-pay-close>Done</button></div>`;
    } catch (ex) {
      const msg = encodeURIComponent(`Hello SOU, I'd like to pay for: ${data.Package}. Name: ${data['Full name']}. Email: ${data.Email}. Phone: ${data.Phone}.`);
      err.innerHTML = `Sorry, we couldn’t send your details just now. Please try again, or <a href="https://wa.me/447907411836?text=${msg}" target="_blank" rel="noopener">message us on WhatsApp</a> or email <a href="mailto:${SOU_EMAIL}">${SOU_EMAIL}</a>.`;
      err.hidden = false; btn.disabled = false; btn.innerHTML = `Submit ${icon('i-arrow', 18)}`;
    }
  });
  const prevQ = ['Have you studied this subject before?', ['No, this is new to me', 'Yes, and I’m still studying it', 'Yes, but it’s been a while and I’d like to refresh']];
  const quiz = {
    quran: { name: 'Qur’an', qs: [
      ['How well do you know the Arabic letters?', ['I don’t know them yet', 'I know some letters', 'I know all the letters', 'I know them well, including their joined forms']],
      ['Can you read words with vowel marks (harakat)?', ['Not yet', 'Slowly, letter by letter', 'Yes, at a steady pace', 'Yes, fluently']],
      ['How do you read from the Mushaf?', ['I can’t read from it yet', 'With a lot of difficulty', 'Steadily, with some mistakes', 'Fluently, with few mistakes']],
      ['How familiar are you with tajweed rules (e.g. noon sakinah, madd)?', ['Not at all', 'I’ve heard of some', 'I know and apply the main rules', 'I apply most rules confidently']],
      ['How much of the Qur’an have you memorised?', ['Al-Fatihah or less', 'A few short surahs', 'Most of Juz ‘Amma', 'More than Juz ‘Amma']]] },
    arabic: { name: 'Arabic', qs: [
      ['How well can you read Arabic script?', ['Not yet', 'Slowly, letter by letter', 'Steadily', 'Fluently']],
      ['How much Arabic vocabulary do you know?', ['Almost none', 'A few common words', 'Everyday words and phrases', 'A wide vocabulary']],
      ['How familiar are you with Arabic grammar (nahw and sarf)?', ['Not at all', 'I know a few basics', 'I understand sentence structure and verb forms', 'I can analyse sentences (i‘rab)']],
      ['Can you understand a short Arabic text?', ['No', 'Only individual words', 'The general meaning', 'Most of it, in detail']],
      ['Can you speak Arabic?', ['Not at all', 'A few phrases', 'Simple conversations', 'Comfortably on most topics']]] },
    islamic: { name: 'Islamic Studies', qs: [
      ['How confidently can you explain the pillars of Islam and Iman?', ['Not yet', 'I know some of them', 'I can list and explain them', 'In detail, with evidence']],
      ['How well do you know the fiqh of purification and prayer?', ['Not at all', 'The basics of how to pray', 'The conditions, pillars and obligations', 'In detail, including what invalidates them']],
      ['How familiar are you with the Seerah of the Prophet ﷺ?', ['Not yet', 'A few well-known events', 'The main stages of his life', 'In detail']],
      ['Have you studied Aqeedah (Islamic belief)?', ['Not yet', 'A little', 'A structured introductory course', 'In depth']],
      ['Have you studied Islamic subjects in a structured class before?', ['Never', 'Occasionally (talks, short courses)', 'Yes, a regular class', 'Yes, for several years']]] },
  };
  const as = { step: 'pick', subj: null, result: null };
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function levelFor(scores, prev) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (prev === 2 && avg >= 0.8) return levels[3];
    return avg < 1.2 ? levels[0] : avg < 2.2 ? levels[1] : levels[2];
  }
  function renderAssess() {
    const box = $('#asBox'); if (!box) return;
    if (as.step === 'pick') {
      box.innerHTML = `<span class="eyebrow">Stage 1 · Online assessment</span><h2 class="h3">Which subject would you like to be assessed in?</h2><p style="color:var(--muted);margin:0">It takes about 2 minutes. At the end you can download your results.</p><div class="as-pick">${Object.entries(quiz).map(([k, q]) => `<button type="button" data-as-subj="${k}"><b>${q.name}</b><span>6 questions</span>${icon('i-arrow', 20)}</button>`).join('')}</div>`;
    } else if (as.step === 'q') {
      const q = quiz[as.subj], all = [...q.qs, prevQ];
      box.innerHTML = `<form class="as-form" novalidate><span class="eyebrow">Stage 1 · ${q.name} assessment</span><h2 class="h3">Answer honestly — there are no wrong answers</h2>${all.map((x, i) => `<fieldset class="as-q"><legend><span>${i + 1}</span>${x[0]}</legend>${x[1].map((o, j) => `<label><input type="radio" name="q${i}" value="${j}" required> ${o}</label>`).join('')}</fieldset>`).join('')}<div class="fgrid"><label class="field" for="asName">Full name *<input id="asName" autocomplete="name" required placeholder="e.g. Aisha Rahman…"></label><label class="field" for="asEmail">Email *<input id="asEmail" type="email" autocomplete="email" spellcheck="false" autocapitalize="off" required placeholder="you@example.com"></label></div><label class="consent" for="asConsent"><input id="asConsent" type="checkbox" required> I agree to SOU receiving my results so they can contact me about my level.</label><p class="err-sum" role="alert" hidden></p><div class="row" style="justify-content:space-between"><button type="button" class="btn btn-outline" data-as-back>Change subject</button><button class="btn btn-primary" type="submit">See my result ${icon('i-arrow', 18, 'arr')}</button></div></form>`;
    } else {
      const r = as.result;
      box.innerHTML = `<div class="as-result"><span class="eyebrow">Your result · ${r.subject}</span><span class="lvl-big"><small>Suggested level</small>${r.level[1]}</span><p class="lead" style="margin:0">${r.level[2]}</p><div class="note">Stage 2: your teacher will double-check your level of knowledge, recitation and speaking ability in a short live assessment during your first class.</div><p id="asSent" class="as-sent" role="status">Sending your results to SOU…</p><div class="row"><button type="button" class="btn btn-primary" data-as-dl>Download my results</button><button class="btn btn-outline" data-taster>Book a free taster</button><a class="btn btn-outline" href="#enrol">Enrol now</a></div><button type="button" class="link" data-as-restart style="background:none;border:0;padding:0;cursor:pointer">Take another assessment</button></div>`;
    }
  }
  async function notifySOU(r) {
    const el = () => $('#asSent');
    const lines = r.answers.map(([q, a]) => `${q} — ${a}`).join('\n');
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + SOU_EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: `New assessment completed: ${r.name} (${r.subject})`, _template: 'table', _captcha: 'false', Name: r.name, Email: r.email, Subject: r.subject, 'Suggested level': r.level[1], Date: r.date, Answers: lines }) });
      if (!res.ok) throw new Error(res.status);
      el() && (el().innerHTML = `${icon('i-check', 18)} SOU has been notified and will be in touch about your level.`);
    } catch (err) {
      const msg = encodeURIComponent(`Hello SOU, I completed the ${r.subject} assessment. Name: ${r.name}. Email: ${r.email}. Suggested level: ${r.level[1]}.`);
      el() && (el().innerHTML = `We couldn’t notify SOU automatically. <a href="https://wa.me/447907411836?text=${msg}" target="_blank" rel="noopener">Send your result on WhatsApp</a> instead.`);
    }
  }
  function downloadResult(r) {
    const W = 1200, pad = 80, c = document.createElement('canvas'); c.width = W; c.height = 1500; const x = c.getContext('2d');
    const wrap = (t, X, Y, max, lh) => { const w = t.split(' '); let line = ''; for (const word of w) { const test = line ? line + ' ' + word : word; if (x.measureText(test).width > max && line) { x.fillText(line, X, Y); Y += lh; line = word; } else line = test; } x.fillText(line, X, Y); return Y + lh; };
    const draw = (logo) => {
      x.fillStyle = '#FFF7EF'; x.fillRect(0, 0, W, c.height); x.fillStyle = '#8A6F4D'; x.fillRect(0, 0, W, 14);
      let y = 70; if (logo) { const lw = 300, lh = lw * logo.height / logo.width; x.drawImage(logo, pad, y, lw, lh); y += lh + 50; }
      x.fillStyle = '#6E583C'; x.font = '700 26px Nunito, sans-serif'; x.fillText('ASSESSMENT RESULTS · STAGE 1', pad, y); y += 60;
      x.fillStyle = '#2B2B2B'; x.font = '600 54px Poppins, sans-serif'; x.fillText(r.name, pad, y); y += 50;
      x.fillStyle = '#5C554D'; x.font = '400 26px Poppins, sans-serif'; x.fillText(`${r.subject} · ${r.date}`, pad, y); y += 70;
      x.fillStyle = '#F7E7CE'; x.fillRect(pad, y, W - pad * 2, 150); x.fillStyle = '#6E583C'; x.font = '700 24px Nunito, sans-serif'; x.fillText('SUGGESTED LEVEL', pad + 36, y + 52); x.fillStyle = '#2B2B2B'; x.font = '600 52px Poppins, sans-serif'; x.fillText(r.level[1], pad + 36, y + 115); y += 200;
      x.font = '400 24px Poppins, sans-serif'; x.fillStyle = '#2B2B2B';
      r.answers.forEach(([q, a], i) => { x.fillStyle = '#5C554D'; x.font = '600 23px Poppins, sans-serif'; y = wrap(`${i + 1}. ${q}`, pad, y, W - pad * 2, 32); x.fillStyle = '#2B2B2B'; x.font = '400 23px Poppins, sans-serif'; y = wrap(a, pad + 30, y, W - pad * 2 - 30, 32) + 14; });
      x.fillStyle = '#5C554D'; x.font = '400 22px Poppins, sans-serif'; y = wrap('Stage 2: your teacher will double-check your level of knowledge, recitation and speaking ability during your first class.', pad, y + 20, W - pad * 2, 30);
      x.fillStyle = '#8A6F4D'; x.font = '700 22px Nunito, sans-serif'; x.fillText(`${SOU_EMAIL} · WhatsApp 07907 411836`, pad, y + 30);
      const out = document.createElement('canvas'); out.width = W; out.height = Math.min(c.height, y + 90); out.getContext('2d').drawImage(c, 0, 0);
      out.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `SOU-${r.subject.replace(/\W+/g, '-')}-assessment.png`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
    };
    const img = new Image(); img.onload = () => draw(img); img.onerror = () => draw(null); img.src = 'assets/logo.png';
  }
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-as-subj]'); if (s) { as.subj = s.dataset.asSubj; as.step = 'q'; renderAssess(); scrollToY($('#asBox').getBoundingClientRect().top + scrollY - 110); return; }
    if (e.target.closest('[data-as-back]') || e.target.closest('[data-as-restart]')) { as.step = 'pick'; as.result = null; renderAssess(); return; }
    if (e.target.closest('[data-as-dl]') && as.result) downloadResult(as.result);
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('.as-form'); if (!f) return; e.preventDefault();
    const q = quiz[as.subj], all = [...q.qs, prevQ];
    const missing = all.map((_, i) => i).filter(i => !f.querySelector(`input[name="q${i}"]:checked`));
    const name = $('#asName').value.trim(), email = $('#asEmail').value.trim();
    const errs = [];
    if (missing.length) errs.push(`Answer question${missing.length > 1 ? 's' : ''} ${missing.map(i => i + 1).join(', ')}`);
    if (!name) errs.push('enter your name'); if (!/^\S+@\S+\.\S+$/.test(email)) errs.push('enter a valid email'); if (!$('#asConsent').checked) errs.push('tick the consent box');
    const sum = f.querySelector('.err-sum');
    if (errs.length) { sum.hidden = false; sum.textContent = 'To see your result, please ' + errs.join(', ').replace(/^Answer/, 'answer') + '.'; announce(sum.textContent); return; }
    const picks = all.map((_, i) => +f.querySelector(`input[name="q${i}"]:checked`).value);
    as.result = { name, email, subject: q.name, level: levelFor(picks.slice(0, -1), picks[picks.length - 1]), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), answers: all.map((x, i) => [x[0], x[1][picks[i]]]) };
    as.step = 'result'; renderAssess(); scrollToY($('#asBox').getBoundingClientRect().top + scrollY - 110);
    notifySOU(as.result);
  });

  /* ---------- INIT ---------- */
  renderStatic(); renderPosts(); renderReviews(); renderPlans(); splitWords(); renderCal();
  $$('[data-rail]').forEach(initRail);
  tabs($('#evTabs'), [['all', 'All'], ['events', 'Events'], ['offers', 'Offers'], ['news', 'News']], id => { evFilter = id; evDay = 0; renderCal(); });
  tabs($('#postTabs'), [['all', 'All'], ['flyer', 'Flyers & offers'], ['class', 'New classes'], ['blog', 'Blog']], id => renderPostGrid(id));
  addStars(); initSplits(); bindTilt();
  showSlide(0); slRestart();
  route();
  if (motionOn()) { curtain.classList.add('cover'); curtain.style.transition = 'none'; requestAnimationFrame(() => { curtain.style.transition = ''; withIntro(); }); }
  function withIntro() { curtain.classList.add('leave'); curtain.classList.remove('cover'); setTimeout(() => { curtain.classList.remove('leave'); curtain.style.transition = 'none'; curtain.style.transform = 'translateY(100%)'; void curtain.offsetWidth; curtain.style.transition = ''; curtain.style.transform = ''; }, 750); }
  cfRender = [coverflow($('#cf2'), featured, $('#cf2Prev'), $('#cf2Next'))];
  observeReveals();
})();
