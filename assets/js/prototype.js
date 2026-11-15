/* Selasi AI concept build: the sample prototypes that render inside the
   device frame. Apps fill the screen; sites open inside browser chrome.
   Every size is in em so one layout scales with the frame. */
(function () {
  'use strict';

  const APPS = {
    susu: {
      key: 'susu', kind: 'app', name: 'SusuCircle', mark: 'S', accent: '#1f8a5b',
      prompt: 'A savings circle app where friends pool money every week and take turns receiving the pot.',
      tagline: 'Save together. Reach it sooner.',
      home: ['Circles', 'All circles and total saved'], listTitle: 'Your circles',
      summaryLabel: 'Saved this year', summaryValue: 'GH₵ 6,150',
      items: [
        { e: '🧺', t: 'Makola Traders', s: '8 members · weekly', v: 'GH₵ 2,400' },
        { e: '🏠', t: 'Hall 7 Roommates', s: '5 members · monthly', v: 'GH₵ 1,250' },
        { e: '👪', t: 'Family Fund', s: '6 members · monthly', v: 'GH₵ 2,500' }
      ],
      detail: { name: 'Circle detail', desc: 'Pot, turn order, contribute', statLabel: 'Pot this round',
        rows: [['Next payout', 'Ama · Friday'], ['Your turn', 'Round 5 of 8'], ['Paid in so far', '6 of 8 members']], cta: 'Contribute' },
      pay: { name: 'Contribute', desc: 'Pick an amount and confirm', label: 'How much this week?', options: ['GH₵ 20', 'GH₵ 50', 'GH₵ 100'], method: 'Mobile money', cta: 'Confirm contribution' },
      done: { title: 'Contribution sent', sub: 'Added to Makola Traders. Ama receives the pot on Friday.' },
      activity: [['Contribution', 'Makola Traders · today', '− GH₵ 50'], ['Payout received', 'Family Fund · 2 Nov', '+ GH₵ 2,500'], ['Contribution', 'Hall 7 Roommates · 1 Nov', '− GH₵ 250']]
    },
    food: {
      key: 'food', kind: 'app', name: 'QuickChop', mark: 'Q', accent: '#e2622f',
      prompt: 'A campus food pre-order app so students can order ahead and skip the lunch queue.',
      tagline: 'Order ahead. Skip the queue.',
      home: ['Menu', 'Meals ready near you'], listTitle: 'Ready near you',
      summaryLabel: 'Pickup window', summaryValue: '12:30 to 1:00',
      items: [
        { e: '🍛', t: 'Jollof and grilled chicken', s: 'Night Market · 12 min', v: 'GH₵ 45' },
        { e: '🍚', t: 'Waakye special', s: 'Bush Canteen · 8 min', v: 'GH₵ 35' },
        { e: '🐟', t: 'Banku and tilapia', s: 'Central Cafeteria · 20 min', v: 'GH₵ 60' }
      ],
      detail: { name: 'Meal detail', desc: 'Kitchen, timing, order', statLabel: 'Price',
        rows: [['Kitchen', 'Night Market'], ['Ready in', 'About 12 minutes'], ['Pickup', 'Counter 3']], cta: 'Order this' },
      pay: { name: 'Checkout', desc: 'Portion size and payment', label: 'Choose a portion', options: ['Regular', 'Large', 'Sharing'], method: 'Mobile money', cta: 'Place order' },
      done: { title: 'Order placed', sub: 'Your jollof will be ready at Counter 3 in about 12 minutes.' },
      activity: [['Jollof and grilled chicken', 'Night Market · today', 'GH₵ 45'], ['Waakye special', 'Bush Canteen · Monday', 'GH₵ 35'], ['Banku and tilapia', 'Central Cafeteria · last week', 'GH₵ 60']]
    },
    study: {
      key: 'study', kind: 'app', name: 'StudyLoop', mark: 'L', accent: '#5b63d6',
      prompt: 'A study group planner that matches students revising the same course.',
      tagline: 'Find your people. Revise together.',
      home: ['Sessions', 'Groups meeting this week'], listTitle: 'Sessions this week',
      summaryLabel: 'Hours revised', summaryValue: '14 h',
      items: [
        { e: '📐', t: 'Calculus II past questions', s: 'Tue 4 pm · Library L2', v: '5 going' },
        { e: '💻', t: 'Data Structures revision', s: 'Wed 6 pm · Lab 4', v: '8 going' },
        { e: '🔥', t: 'Thermodynamics problem set', s: 'Fri 2 pm · Room B12', v: '3 going' }
      ],
      detail: { name: 'Session detail', desc: 'Time, place, join', statLabel: 'Going',
        rows: [['When', 'Tuesday, 4:00 pm'], ['Where', 'Library, Level 2'], ['Host', 'Kojo A.']], cta: 'Join session' },
      pay: { name: 'Join', desc: 'Pick how you will take part', label: 'How will you join?', options: ['In person', 'Online', 'Just notes'], method: 'Reminder 1 hour before', cta: 'Confirm seat' },
      done: { title: "You're in", sub: 'Calculus II past questions, Tuesday at 4:00 pm.' },
      activity: [['Calculus II past questions', 'Joined · today', '2 h'], ['Physics lab prep', 'Attended · Friday', '1.5 h'], ['Data Structures revision', 'Hosted · last week', '3 h']]
    },
    events: {
      key: 'events', kind: 'app', name: 'Gather', mark: 'G', accent: '#c2255c',
      prompt: 'An events app where people discover local events and buy tickets.',
      tagline: 'Find what is on. Be there.',
      home: ['Events', 'What is on near you'], listTitle: 'On this week',
      summaryLabel: 'Your tickets', summaryValue: '2 upcoming',
      items: [
        { e: '🎶', t: 'Afrobeats Night', s: 'Sat 9 pm · Osu', v: 'GH₵ 80' },
        { e: '💡', t: 'Tech Meetup Accra', s: 'Thu 6 pm · Airport', v: 'Free' },
        { e: '🎨', t: 'Sunday Art Market', s: 'Sun 11 am · Labone', v: 'GH₵ 20' }
      ],
      detail: { name: 'Event detail', desc: 'Time, place, tickets', statLabel: 'Ticket',
        rows: [['When', 'Saturday, 9:00 pm'], ['Where', 'Osu, Oxford Street'], ['Host', 'Night Shift Live']], cta: 'Get tickets' },
      pay: { name: 'Tickets', desc: 'Quantity and payment', label: 'How many tickets?', options: ['1', '2', '4'], method: 'Mobile money', cta: 'Pay now' },
      done: { title: 'Tickets booked', sub: 'Two tickets for Afrobeats Night are in your wallet.' },
      activity: [['Afrobeats Night', '2 tickets · today', 'GH₵ 160'], ['Sunday Art Market', '1 ticket · last week', 'GH₵ 20'], ['Tech Meetup Accra', 'Attended · October', 'Free']]
    },
    gym: {
      key: 'gym', kind: 'app', name: 'Stride', mark: 'S', accent: '#0c8599',
      prompt: 'A workout planner app that builds a weekly gym routine and tracks progress.',
      tagline: 'A plan you will actually follow.',
      home: ['Plan', 'This week at a glance'], listTitle: 'This week',
      summaryLabel: 'Current streak', summaryValue: '12 days',
      items: [
        { e: '💪', t: 'Push day', s: 'Mon · 45 min', v: '6 moves' },
        { e: '🦵', t: 'Leg day', s: 'Wed · 50 min', v: '7 moves' },
        { e: '🏃', t: 'Core and cardio', s: 'Fri · 30 min', v: '5 moves' }
      ],
      detail: { name: 'Workout', desc: 'Moves, time, start', statLabel: 'Today',
        rows: [['Focus', 'Chest and shoulders'], ['Time', '45 minutes'], ['Level', 'Intermediate']], cta: 'Start workout' },
      pay: { name: 'Set up', desc: 'Intensity and rest', label: 'Pick your intensity', options: ['Light', 'Steady', 'Hard'], method: 'Rest timer 60 s', cta: 'Begin' },
      done: { title: 'Workout logged', sub: 'Push day done. Your streak is now 13 days.' },
      activity: [['Push day', 'Completed · today', '45 min'], ['Core and cardio', 'Completed · Friday', '30 min'], ['Leg day', 'Completed · Wednesday', '50 min']]
    },
    generic: {
      key: 'generic', kind: 'app', name: 'Your concept', mark: 'C', accent: '#ff7a59',
      prompt: '', tagline: 'Your idea, on a real screen.',
      home: ['Home', 'Main list'], listTitle: 'Main list',
      summaryLabel: 'Key number', summaryValue: '128',
      items: [{ e: '⭐', t: 'First item', s: 'Supporting detail', v: 'Value' }, { e: '⭐', t: 'Second item', s: 'Supporting detail', v: 'Value' }, { e: '⭐', t: 'Third item', s: 'Supporting detail', v: 'Value' }],
      detail: { name: 'Detail', desc: 'One item and its action', statLabel: 'Headline figure',
        rows: [['Detail one', 'Value'], ['Detail two', 'Value'], ['Detail three', 'Value']], cta: 'Main action' },
      pay: { name: 'Action', desc: 'Options and confirm', label: 'Choose an option', options: ['Option A', 'Option B', 'Option C'], method: 'Secondary detail', cta: 'Confirm' },
      done: { title: 'Done', sub: 'This is where the success state for your main action goes.' },
      activity: [['Recent item', 'Detail · today', 'Value'], ['Recent item', 'Detail · yesterday', 'Value'], ['Recent item', 'Detail · last week', 'Value']]
    }
  };

  const SITES = {
    bakery: {
      key: 'bakery', kind: 'site', name: 'Adjoa Bakes', mark: 'A', accent: '#b4552d', domain: 'adjoabakes.preview',
      prompt: 'A website for my home bakery where people can see the menu and order a cake.',
      heroTitle: 'Fresh from the oven, every morning.', heroSub: 'Small-batch bread, pastries and celebration cakes, baked to order in Accra.',
      heroCta: 'Order a cake', listName: 'Menu', art: ['🥐', '🍞', '🧁'], featured: 'Popular this week', listLead: 'Tap anything to order it.',
      points: [['⏰', 'Baked daily', 'Nothing sits on a shelf overnight.'], ['🎂', 'Made to order', 'Tell us the size, flavour and message.'], ['🛵', 'Pickup or delivery', 'Same-day within the city.']],
      products: [['🍞', 'Butter bread', 'GH₵ 25'], ['🥧', 'Meat pie', 'GH₵ 12'], ['🍫', 'Chocolate cake', 'GH₵ 180'], ['🥮', 'Cinnamon rolls', 'GH₵ 40'], ['🍌', 'Banana loaf', 'GH₵ 35'], ['🎂', 'Birthday cake', 'GH₵ 250']],
      story: ['Our story', 'It started with one oven and a family recipe for butter bread. Neighbours kept asking for more, so the kitchen grew.', 'Everything is still mixed by hand, in small batches, by the same three people.'],
      orderTitle: 'Order a cake', fields: ['Your name', 'Phone number', 'What would you like?'], orderCta: 'Send order',
      sent: ['Order received', 'We will call you within the hour to confirm the details.']
    },
    portfolio: {
      key: 'portfolio', kind: 'site', name: 'Esi Mensah', mark: 'E', accent: '#5b63d6', domain: 'esimensah.preview',
      prompt: 'A portfolio website for a product designer to show case studies and get hired.',
      heroTitle: 'I design calm products for busy people.', heroSub: 'Product designer in Accra. Six years across fintech, health and logistics.',
      heroCta: 'Work with me', listName: 'Work', art: ['🎨', '✏️', '📱'], featured: 'Selected work', listLead: 'Case studies from the last three years.',
      points: [['🔎', 'Research first', 'I talk to users before I draw anything.'], ['🧩', 'Systems thinking', 'Components that scale past the first screen.'], ['🚀', 'Ships with engineers', 'Specs that survive contact with code.']],
      products: [['💳', 'Wallet redesign', 'Fintech'], ['🩺', 'Clinic booking', 'Health'], ['📦', 'Courier tracker', 'Logistics'], ['🎯', 'Savings goals', 'Fintech'], ['🧱', 'Design system', 'Internal'], ['✨', 'Onboarding flow', 'Growth']],
      story: ['About', 'I started in print, moved to mobile, and stayed for the problem solving. I like projects where the hard part is deciding what to leave out.', 'Outside work I teach a weekend design class for secondary school students.'],
      orderTitle: 'Work with me', fields: ['Your name', 'Email', 'Tell me about the project'], orderCta: 'Send message',
      sent: ['Message sent', 'Thanks. I reply to every enquiry within two working days.']
    },
    salon: {
      key: 'salon', kind: 'site', name: 'Fade Lab', mark: 'F', accent: '#b7791f', domain: 'fadelab.preview',
      prompt: 'A website for my barbershop where customers can see services and book a slot.',
      heroTitle: 'Sharp cuts. No waiting.', heroSub: 'Book a chair in East Legon and walk straight in.',
      heroCta: 'Book a slot', listName: 'Services', art: ['💈', '✂️', '🪒'], featured: 'Most booked', listLead: 'Tap a service to book it.',
      points: [['⏱️', 'Walk straight in', 'Your chair is ready at your time.'], ['✂️', 'Master barbers', 'Every barber has five years or more.'], ['🌙', 'Open late', 'Until 9 pm, seven days a week.']],
      products: [['✂️', 'Skin fade', 'GH₵ 60'], ['🧔', 'Beard trim', 'GH₵ 30'], ['🧒', 'Kids cut', 'GH₵ 40'], ['🎨', 'Hair dye', 'GH₵ 120'], ['🪒', 'Hot towel shave', 'GH₵ 50'], ['📐', 'Line up', 'GH₵ 25']],
      story: ['Our story', 'Fade Lab opened with two chairs and a rule: nobody waits. The booking system came first, the shop second.', 'Today there are six chairs, and the rule has not changed.'],
      orderTitle: 'Book a slot', fields: ['Your name', 'Phone number', 'Service and preferred time'], orderCta: 'Request booking',
      sent: ['Booking requested', 'We will text you to confirm your slot.']
    },
    genericSite: {
      key: 'genericSite', kind: 'site', name: 'Your site', mark: 'Y', accent: '#ff7a59', domain: 'yoursite.preview',
      prompt: '', heroTitle: 'Your headline goes here.', heroSub: 'One or two lines that say what you offer and who it is for.',
      heroCta: 'Main action', listName: 'Products', art: ['✨', '⭐', '💡'], featured: 'Featured', listLead: 'A short line about the list.',
      points: [['⭐', 'First benefit', 'A short supporting line.'], ['⭐', 'Second benefit', 'A short supporting line.'], ['⭐', 'Third benefit', 'A short supporting line.']],
      products: [['⭐', 'Item one', 'Price'], ['⭐', 'Item two', 'Price'], ['⭐', 'Item three', 'Price'], ['⭐', 'Item four', 'Price'], ['⭐', 'Item five', 'Price'], ['⭐', 'Item six', 'Price']],
      story: ['About', 'A paragraph about who you are and why you started.', 'A second paragraph about how you work.'],
      orderTitle: 'Get in touch', fields: ['Your name', 'Phone or email', 'Message'], orderCta: 'Send',
      sent: ['Message sent', 'This is the confirmation state for your contact form.']
    }
  };

  Object.values(APPS).forEach((d) => {
    d.screens = [
      { key: 'welcome', name: 'Welcome', desc: 'Intro and get started' },
      { key: 'signin', name: 'Sign in', desc: 'Phone number and continue' },
      { key: 'home', name: d.home[0], desc: d.home[1] },
      { key: 'detail', name: d.detail.name, desc: d.detail.desc },
      { key: 'pay', name: d.pay.name, desc: d.pay.desc },
      { key: 'done', name: 'Confirmation', desc: 'Success state' },
      { key: 'activity', name: 'Activity', desc: 'Recent history' },
      { key: 'profile', name: 'Profile', desc: 'Account and preferences' }
    ];
    d.taps = ['Get started', 'Continue', 'Tap an item', d.detail.cta, d.pay.cta, 'Tab bar', 'Tab bar'];
  });
  Object.values(SITES).forEach((d) => {
    d.screens = [
      { key: 'home', name: 'Home', desc: 'Hero, benefits, featured' },
      { key: 'menu', name: d.listName, desc: 'Everything on offer' },
      { key: 'story', name: d.story[0], desc: 'Who is behind it' },
      { key: 'order', name: d.orderTitle, desc: 'Short form' },
      { key: 'sent', name: 'Confirmation', desc: 'Form sent' }
    ];
    d.taps = [d.listName + ' link', d.story[0] + ' link', d.heroCta, d.orderCta];
  });

  const IDEAS = Object.assign({}, APPS, SITES);
  const ACCENTS = ['#1f8a5b', '#e2622f', '#5b63d6', '#c2255c', '#0c8599', '#b4552d', '#b7791f'];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tick = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function statusRow() {
    const d = new Date();
    return `<div class="p-status"><span>${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}</span><span class="p-status-r"><i class="sig"></i><i class="bat"></i></span></div>`;
  }

  function tabBar(on) {
    const tabs = [['home', 'Home'], ['activity', 'Activity'], ['profile', 'Profile']];
    return `<div class="p-tabs">${tabs.map((t) => `<button data-go="${t[0]}"${t[0] === on ? ' class="on"' : ''}><i></i>${t[1]}</button>`).join('')}</div>`;
  }

  function appScreen(d, key) {
    const first = d.items[0];
    switch (key) {
      case 'welcome': return `<div class="p-center">
          <div class="p-logo"><b>${esc(d.mark)}</b></div>
          <h1>${esc(d.name)}</h1><p>${esc(d.tagline)}</p>
          <button class="p-btn" data-go="signin">Get started</button>
          <button class="p-link" data-go="signin">I already have an account</button>
        </div>`;
      case 'signin': return `<div class="p-pad">
          <button class="p-back" data-go="welcome">‹ Back</button>
          <div class="p-head"><h2>Welcome back</h2><small>Enter your phone number to continue.</small></div>
          <div class="p-field"><small>Phone number</small><b>024 000 0000</b></div>
          <div class="p-field"><small>One-time code</small><b>• • • •</b></div>
          <span class="p-grow"></span>
          <button class="p-btn" data-go="home">Continue</button>
        </div>`;
      case 'home': return `<div class="p-pad">
          <div class="p-top"><div><small>Good to see you</small><h2>${esc(d.listTitle)}</h2></div><button class="p-avatar" data-go="profile">K</button></div>
          <div class="p-summary"><small>${esc(d.summaryLabel)}</small><b>${esc(d.summaryValue)}</b></div>
          <div class="p-list">${d.items.map((it) => `<button class="p-item" data-go="detail">
            <span class="p-dot">${it.e || ''}</span>
            <span class="p-item-text"><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span>
            <span class="p-item-val">${esc(it.v)}</span></button>`).join('')}</div>
        </div>${tabBar('home')}`;
      case 'detail': return `<div class="p-pad">
          <button class="p-back" data-go="home">‹ Back</button>
          <div class="p-hero"><small>${esc(d.detail.statLabel)}</small><b>${esc(first.v)}</b><span>${esc(first.t)}</span></div>
          <div class="p-rows">${d.detail.rows.map((r) => `<div><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>
          <span class="p-grow"></span>
          <button class="p-btn" data-go="pay">${esc(d.detail.cta)}</button>
        </div>`;
      case 'pay': return `<div class="p-pad">
          <button class="p-back" data-go="detail">‹ Back</button>
          <div class="p-head"><h2>${esc(d.pay.name)}</h2><small>${esc(d.pay.label)}</small></div>
          <div class="p-options">${d.pay.options.map((o, i) => `<button data-pick${i === 1 ? ' class="on"' : ''}>${esc(o)}</button>`).join('')}</div>
          <div class="p-rows"><div><span>${esc(first.t)}</span><b>${esc(first.v)}</b></div><div><span>Method</span><b>${esc(d.pay.method)}</b></div></div>
          <span class="p-grow"></span>
          <button class="p-btn" data-go="done">${esc(d.pay.cta)}</button>
        </div>`;
      case 'done': return `<div class="p-center">
          <div class="p-check">${tick}</div>
          <h1>${esc(d.done.title)}</h1><p>${esc(d.done.sub)}</p>
          <button class="p-btn" data-go="home">Back to home</button>
          <button class="p-link" data-go="activity">See activity</button>
        </div>`;
      case 'activity': return `<div class="p-pad">
          <div class="p-head"><h2>Activity</h2><small>Your recent history</small></div>
          <div class="p-rows">${d.activity.map((a) => `<div class="tall"><span><b>${esc(a[0])}</b><small>${esc(a[1])}</small></span><b>${esc(a[2])}</b></div>`).join('')}</div>
        </div>${tabBar('activity')}`;
      default: return `<div class="p-pad">
          <div class="p-profile"><div class="p-avatar big">K</div><h2>Kwame</h2><small>Member since 2026</small></div>
          <div class="p-rows">${['Notifications', 'Payment methods', 'Privacy', 'Help'].map((r) => `<div><span>${r}</span><b>›</b></div>`).join('')}</div>
          <span class="p-grow"></span>
          <button class="p-link" data-go="welcome">Sign out</button>
        </div>${tabBar('profile')}`;
    }
  }

  function siteScreen(d, key) {
    const nav = `<nav class="s-nav"><button class="s-brand" data-go="home"><i>${esc(d.mark)}</i>${esc(d.name)}</button>
      <span class="s-links"><button data-go="menu"${key === 'menu' ? ' class="on"' : ''}>${esc(d.listName)}</button><button data-go="story"${key === 'story' ? ' class="on"' : ''}>${esc(d.story[0])}</button><button class="s-cta" data-go="order">${esc(d.heroCta)}</button></span></nav>`;
    const foot = `<footer class="s-foot"><b>${esc(d.name)}</b><span>Made with Selasi AI. Concept preview.</span></footer>`;
    const card = (p) => `<button class="s-card" data-go="order"><i>${p[0]}</i><b>${esc(p[1])}</b><small>${esc(p[2])}</small></button>`;
    const art = (cls) => `<i class="s-art${cls || ''}"><u>${d.art[0]}</u><u>${d.art[1]}</u><u>${d.art[2]}</u></i>`;
    let body;
    if (key === 'home') {
      body = `<section class="s-hero"><div><h1>${esc(d.heroTitle)}</h1><p>${esc(d.heroSub)}</p>
          <div class="s-row"><button class="p-btn" data-go="order">${esc(d.heroCta)}</button><button class="s-ghost" data-go="menu">See the ${esc(d.listName.toLowerCase())}</button></div></div>${art()}</section>
        <section class="s-points">${d.points.map((p) => `<div><i>${p[0]}</i><b>${esc(p[1])}</b><small>${esc(p[2])}</small></div>`).join('')}</section>
        <section class="s-sec"><h2>${esc(d.featured)}</h2><div class="s-grid">${d.products.slice(0, 3).map(card).join('')}</div></section>`;
    } else if (key === 'menu') {
      body = `<section class="s-sec"><h1>${esc(d.listName)}</h1><p class="s-lead">${esc(d.listLead)}</p><div class="s-grid">${d.products.map(card).join('')}</div></section>`;
    } else if (key === 'story') {
      body = `<section class="s-sec narrow"><h1>${esc(d.story[0])}</h1>${art(' wide')}<p>${esc(d.story[1])}</p><p>${esc(d.story[2])}</p><button class="p-btn" data-go="order">${esc(d.heroCta)}</button></section>`;
    } else if (key === 'order') {
      body = `<section class="s-sec narrow"><h1>${esc(d.orderTitle)}</h1><p class="s-lead">It takes less than a minute.</p>
        ${d.fields.map((f, i) => `<div class="p-field${i === 2 ? ' area' : ''}"><small>${esc(f)}</small><b>&nbsp;</b></div>`).join('')}
        <button class="p-btn" data-go="sent">${esc(d.orderCta)}</button></section>`;
    } else {
      body = `<section class="s-sec narrow s-sent"><div class="p-check">${tick}</div><h1>${esc(d.sent[0])}</h1><p>${esc(d.sent[1])}</p><button class="p-btn" data-go="home">Back to home</button></section>`;
    }
    return nav + `<div class="s-body">${body}</div>` + foot;
  }

  function chrome(d) {
    return `<div class="p-chrome">
      <span class="pc-lights"><i></i><i></i><i></i></span>
      <button data-nav="back" aria-label="Back">‹</button><button data-nav="fwd" aria-label="Forward">›</button>
      <span class="pc-url"><i class="pc-lock"></i>${esc(d.domain)}</span>
      <span class="pc-tabs">1</span>
    </div>`;
  }

  /* mount(host, idea, opts) → controller */
  function mount(host, idea, opts) {
    const o = opts || {};
    const site = idea.kind === 'site';
    const keys = idea.screens.map((s) => s.key);
    let index = 0, hist = [0], pos = 0;
    host.innerHTML = `<div class="proto ${site ? 'site' : 'app'}" style="--p-accent:${idea.accent}">${statusRow()}${site ? chrome(idea) : ''}<div class="p-view"></div><div class="p-home"></div></div>`;
    const root = host.firstElementChild;
    const view = root.querySelector('.p-view');

    function paint(silent) {
      view.classList.remove('p-in');
      view.innerHTML = site ? siteScreen(idea, keys[index]) : appScreen(idea, keys[index]);
      view.scrollTop = 0;
      void view.offsetWidth;
      view.classList.add('p-in');
      if (site) {
        root.querySelector('[data-nav="back"]').disabled = pos === 0;
        root.querySelector('[data-nav="fwd"]').disabled = pos >= hist.length - 1;
      }
      if (!silent && typeof o.onNavigate === 'function') o.onNavigate(index);
    }
    function go(target, silent) {
      const i = typeof target === 'number' ? target : keys.indexOf(target);
      if (i < 0 || i >= keys.length) return;
      if (i !== index) { hist = hist.slice(0, pos + 1); hist.push(i); pos = hist.length - 1; }
      index = i;
      paint(silent);
    }
    root.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        const next = pos + (nav.dataset.nav === 'back' ? -1 : 1);
        if (next >= 0 && next < hist.length) { pos = next; index = hist[pos]; paint(); }
        return;
      }
      const pick = e.target.closest('[data-pick]');
      if (pick) { pick.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === pick)); return; }
      const t = e.target.closest('[data-go]');
      if (t) go(t.dataset.go);
    });

    paint(true);
    return {
      go: go,
      setDark: (b) => root.classList.toggle('p-dark', !!b),
      setAccent: (c) => root.style.setProperty('--p-accent', c),
      setWide: (b) => root.classList.toggle('p-wide', !!b),
      get index() { return index; }
    };
  }

  window.SelasiProto = { IDEAS: IDEAS, ACCENTS: ACCENTS, mount: mount };
})();
