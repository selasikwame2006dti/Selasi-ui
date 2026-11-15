/* Selasi AI concept build: the sample prototypes that render inside the
   device frame. Every size is in em so one layout scales with the frame. */
(function () {
  'use strict';

  const IDEAS = {
    susu: {
      key: 'susu',
      name: 'SusuCircle',
      prompt: 'A savings circle app where friends pool money every week and take turns receiving the pot.',
      tagline: 'Save together. Reach it sooner.',
      accent: '#1f8a5b',
      mark: 'S',
      listTitle: 'Your circles',
      summaryLabel: 'Saved this year',
      summaryValue: 'GH₵ 6,150',
      items: [
        { t: 'Makola Traders', s: '8 members · weekly', v: 'GH₵ 2,400' },
        { t: 'Hall 7 Roommates', s: '5 members · monthly', v: 'GH₵ 1,250' },
        { t: 'Family Fund', s: '6 members · monthly', v: 'GH₵ 2,500' }
      ],
      detail: {
        statLabel: 'Pot this round',
        rows: [['Next payout', 'Ama · Friday'], ['Your turn', 'Round 5 of 8'], ['Paid in so far', '6 of 8 members']],
        cta: 'Contribute GH₵ 50'
      },
      done: { title: 'Contribution sent', sub: 'GH₵ 50 added to Makola Traders. Ama receives the pot on Friday.' },
      screens: [
        ['Welcome', 'Intro and get started'],
        ['Circles', 'All circles and total saved'],
        ['Circle detail', 'Pot, turn order, contribute'],
        ['Confirmation', 'Contribution receipt']
      ]
    },
    food: {
      key: 'food',
      name: 'QuickChop',
      prompt: 'A campus food pre-order app so students can order ahead and skip the lunch queue.',
      tagline: 'Order ahead. Skip the queue.',
      accent: '#e2622f',
      mark: 'Q',
      listTitle: 'Ready near you',
      summaryLabel: 'Pickup window',
      summaryValue: '12:30 to 1:00',
      items: [
        { t: 'Jollof and grilled chicken', s: 'Night Market · 12 min', v: 'GH₵ 45' },
        { t: 'Waakye special', s: 'Bush Canteen · 8 min', v: 'GH₵ 35' },
        { t: 'Banku and tilapia', s: 'Central Cafeteria · 20 min', v: 'GH₵ 60' }
      ],
      detail: {
        statLabel: 'Price',
        rows: [['Kitchen', 'Night Market'], ['Ready in', 'About 12 minutes'], ['Pickup', 'Counter 3']],
        cta: 'Place order'
      },
      done: { title: 'Order placed', sub: 'Your jollof will be ready at Counter 3 in about 12 minutes.' },
      screens: [
        ['Welcome', 'Intro and get started'],
        ['Menu', 'Meals ready near you'],
        ['Meal detail', 'Kitchen, timing, order'],
        ['Confirmation', 'Order receipt']
      ]
    },
    study: {
      key: 'study',
      name: 'StudyLoop',
      prompt: 'A study group planner that matches students revising the same course.',
      tagline: 'Find your people. Revise together.',
      accent: '#5b63d6',
      mark: 'L',
      listTitle: 'Sessions this week',
      summaryLabel: 'Hours revised',
      summaryValue: '14 h',
      items: [
        { t: 'Calculus II past questions', s: 'Tue 4 pm · Library L2', v: '5 going' },
        { t: 'Data Structures revision', s: 'Wed 6 pm · Lab 4', v: '8 going' },
        { t: 'Thermodynamics problem set', s: 'Fri 2 pm · Room B12', v: '3 going' }
      ],
      detail: {
        statLabel: 'Seats left',
        rows: [['When', 'Tuesday, 4:00 pm'], ['Where', 'Library, Level 2'], ['Host', 'Kojo A.']],
        cta: 'Join session'
      },
      done: { title: "You're in", sub: 'Calculus II past questions, Tuesday at 4:00 pm. We will remind you an hour before.' },
      screens: [
        ['Welcome', 'Intro and get started'],
        ['Sessions', 'Groups meeting this week'],
        ['Session detail', 'Time, place, join'],
        ['Confirmation', 'Seat confirmed']
      ]
    },
    generic: {
      key: 'generic',
      name: 'Your concept',
      prompt: '',
      tagline: 'Your idea, on a real screen.',
      accent: '#ff7a59',
      mark: 'C',
      listTitle: 'Main list',
      summaryLabel: 'Key number',
      summaryValue: '128',
      items: [
        { t: 'First item', s: 'Supporting detail', v: 'Value' },
        { t: 'Second item', s: 'Supporting detail', v: 'Value' },
        { t: 'Third item', s: 'Supporting detail', v: 'Value' }
      ],
      detail: {
        statLabel: 'Headline figure',
        rows: [['Detail one', 'Value'], ['Detail two', 'Value'], ['Detail three', 'Value']],
        cta: 'Main action'
      },
      done: { title: 'Done', sub: 'This is where the success state for your main action goes.' },
      screens: [
        ['Welcome', 'Intro and get started'],
        ['Home', 'Main list'],
        ['Detail', 'One item and its action'],
        ['Confirmation', 'Success state']
      ]
    }
  };

  const ACCENTS = ['#1f8a5b', '#e2622f', '#5b63d6', '#c2255c', '#0c8599'];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function statusRow() {
    const d = new Date();
    const h = d.getHours() % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, '0');
    return `<div class="p-status"><span>${h}:${m}</span><span class="p-status-r"><i class="sig"></i><i class="bat"></i></span></div>`;
  }

  function screenHtml(idea, index) {
    const first = idea.items[0];
    if (index === 0) {
      return `<div class="p-welcome">
        <div class="p-logo"><b>${esc(idea.mark)}</b></div>
        <h1>${esc(idea.name)}</h1>
        <p>${esc(idea.tagline)}</p>
        <button class="p-btn" data-go="1">Get started</button>
        <button class="p-link" data-go="1">I already have an account</button>
      </div>`;
    }
    if (index === 1) {
      return `<div class="p-pad">
        <div class="p-top"><div><small>Good to see you</small><h2>${esc(idea.listTitle)}</h2></div><div class="p-avatar">K</div></div>
        <div class="p-summary"><small>${esc(idea.summaryLabel)}</small><b>${esc(idea.summaryValue)}</b></div>
        <div class="p-list">
          ${idea.items.map((it) => `<button class="p-item" data-go="2">
            <span class="p-dot"></span>
            <span class="p-item-text"><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span>
            <span class="p-item-val">${esc(it.v)}</span>
          </button>`).join('')}
        </div>
      </div>
      <div class="p-tabs"><span class="on"></span><span></span><span></span><span></span></div>`;
    }
    if (index === 2) {
      return `<div class="p-pad">
        <button class="p-back" data-go="1">‹ Back</button>
        <div class="p-hero"><small>${esc(idea.detail.statLabel)}</small><b>${esc(first.v)}</b><span>${esc(first.t)}</span></div>
        <div class="p-rows">
          ${idea.detail.rows.map((r) => `<div><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}
        </div>
        <button class="p-btn" data-go="3">${esc(idea.detail.cta)}</button>
      </div>`;
    }
    return `<div class="p-done">
      <div class="p-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h1>${esc(idea.done.title)}</h1>
      <p>${esc(idea.done.sub)}</p>
      <button class="p-btn" data-go="1">Back to home</button>
    </div>`;
  }

  /* mount(host, idea, opts) → controller { go(i), setDark(b), setAccent(c), index } */
  function mount(host, idea, opts) {
    const o = opts || {};
    let index = 0;
    host.innerHTML = `<div class="proto" style="--p-accent:${idea.accent}">${statusRow()}<div class="p-view"></div><div class="p-home"></div></div>`;
    const root = host.firstElementChild;
    const view = root.querySelector('.p-view');

    function go(i, silent) {
      index = Math.max(0, Math.min(3, i));
      view.classList.remove('p-in');
      view.innerHTML = screenHtml(idea, index);
      void view.offsetWidth;
      view.classList.add('p-in');
      if (!silent && typeof o.onNavigate === 'function') o.onNavigate(index);
    }

    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-go]');
      if (t) go(Number(t.dataset.go));
    });

    go(0, true);
    return {
      go: go,
      setDark: (b) => root.classList.toggle('p-dark', !!b),
      setAccent: (c) => root.style.setProperty('--p-accent', c),
      get index() { return index; }
    };
  }

  window.SelasiProto = { IDEAS: IDEAS, ACCENTS: ACCENTS, mount: mount };
})();
