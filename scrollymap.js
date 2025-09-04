/* Sthir Scrollytelling PRO — no external deps */
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const track = $('#fxTrack');
  if (!track) return;

  // ---------------- Data (concise; expand bullets whenever you like) ----------------
  const data = [
    {
      phase: 'Anchoring',
      weeks: [
        { n:1, title:'Week 1 – Disrupting Autopilot', purpose:'Spotlight present ways of seeing; break routine thinking; open awareness to self.',
          bullets:['Neuroscience of attention & patterns','Autopilot audit + learner mindset','Daily anchor rituals'] },
        { n:2, title:'Week 2 – Seeing Self & Systems', purpose:'Visualize how habits + social structures shape worldview.',
          bullets:['Conditioning & mirror neurons','“My Lens” map (personal + collective)','5-Whys + needs mapping'] },
        { n:3, title:'Week 3 – Navigate Information Overload', purpose:'Create your Anchoring Map to filter signal from noise.',
          bullets:['Cognitive overload micro-exercises','Co-create Anchoring Map','Team formation & research approach'] },
        { n:4, title:'Week 4 – Commit to an Exploration', purpose:'Synthesize discoveries into a clear anchor area & problem statement.',
          bullets:['Cognitive flexibility & empathy','Perspective Carousel + listening','Articulate problem statement'] },
      ]
    },
    {
      phase: 'Exploration',
      weeks: [
        { n:5, title:'Week 5 – Bold First Steps', purpose:'Transform doubt/distress into action via small experiments.',
          bullets:['Fear → exec brain activation','Desirability first (DT lens)','Run a tiny desirability test'] },
        { n:6, title:'Week 6 – Teaming with Diverse Humans', purpose:'Collaboration, listening & open-ended questions.',
          bullets:['Collab Charter (roles, norms)','Labeling & Peacock exercises','Listening across assumptions'] },
        { n:7, title:'Week 7 – Jobs-To-Be-Done (JBTD)', purpose:'Uncover functional, emotional, social jobs.',
          bullets:['JBTD canvas + interviews','Map jobs & struggles','Refine problem lens'] },
        { n:8, title:'Week 8 – Synthesis & Possibility Framing', purpose:'Sense-make exploration & generate HMW paths.',
          bullets:['Cluster insights','HMW reframing','Gallery walk + celebrate'] },
      ]
    },
    {
      phase: 'Rooting',
      weeks: [
        { n:9, title:'Week 9 – Power & Influence Mapping', purpose:'See your power objectively; plan to grow influence.',
          bullets:['French & Raven self-rating','Power Mirror feedback','1 influence action'] },
        { n:10, title:'Week 10 – Social Capital & Expert Networks', purpose:'Reach out meaningfully; build stakeholder map.',
          bullets:['Weak ties & reciprocity','Relationship action plan','Draft & send 1 outreach'] },
        { n:11, title:'Week 11 – MVP Sprint', purpose:'Turn insight into MVP or action plan; test with someone.',
          bullets:['Define MVP/pilot','Rapid prototyping + critique','Next 3 milestones'] },
        { n:12, title:'Week 12 – Rooting & Commitment', purpose:'Share work, feedback, and commitment forward.',
          bullets:['Pitch circle + feedback','Leadership Commitment (3–6 mo)','Pass-the-Torch ceremony'] },
      ]
    }
  ];

  // ---------------- Build week cards into each phase container ----------------
  const totalWeeks = data.reduce((a,p)=>a + p.weeks.length, 0);
  data.forEach(({phase, weeks})=>{
    const wrap = $(`.phase-weeks[data-phase="${phase}"]`, track);
    const frag = document.createDocumentFragment();
    weeks.forEach(w=>{
      const card = document.createElement('article');
      card.className = 'week-card';
      card.dataset.week = String(w.n);
      card.dataset.phase = phase;
      card.innerHTML = `
        <div class="wkhead">
          <span class="wkphase">${phase}</span>
          <div class="wktitle">${w.title}</div>
        </div>
        <p><strong>Purpose:</strong> ${w.purpose}</p>
        ${w.bullets?.length ? `<ul>${w.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : ''}
      `;
      frag.appendChild(card);
    });
    wrap?.appendChild(frag);
  });

  // ---------------- Build left week tracker ----------------
  const fxWeekList = $('#fxWeekList');
  const fxPhaseName = $('#fxPhaseName');
  const fxRail = $('#fxRail');

  const weekIndexToPhase = [];
  data.forEach(p=>{
    p.weeks.forEach(w=>{
      weekIndexToPhase[w.n] = p.phase;
    });
  });

  const tFrag = document.createDocumentFragment();
  for (let w=1; w<=totalWeeks; w++){
    const li = document.createElement('li');
    li.setAttribute('role','option');
    li.dataset.week = String(w);
    li.innerHTML = `<span class="wknum">${w}</span><span class="wktitle">${shortTitle(w)}</span>`;
    li.addEventListener('click', ()=>{
      const target = $(`.week-card[data-week="${w}"]`, track);
      target?.scrollIntoView({ behavior: prefersReduced()? 'auto':'smooth', block:'start' });
    });
    tFrag.appendChild(li);
  }
  fxWeekList.appendChild(tFrag);

  function shortTitle(w){
    const found = data.flatMap(p=>p.weeks).find(x=>x.n===w);
    return found ? found.title.replace(/^Week\s*\d+\s*[–-]\s*/,'') : `Week ${w}`;
  }

  // ---------------- Observe banners & cards ----------------
  const cards = $$('.week-card', track);
  const banners = $$('.phase-banner', track);

  // phase banner visibility (fade up on enter)
  const bannerIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('is-visible');
        announcePhaseSwap(e.target.dataset.phase);
      }
    });
  }, { root:null, threshold:0.5 });
  banners.forEach(b=>bannerIO.observe(b));

  // current card highlight + left tracker update
  let currentWeek = 1;
  const cardIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        const idx = Number(e.target.dataset.week);
        setCurrentWeek(idx);
      }
    });
  },{
    root:null,
    rootMargin:'0px 0px -60% 0px',
    threshold:0.15
  });
  cards.forEach(c=>cardIO.observe(c));

  function setCurrentWeek(w){
    if (w === currentWeek) return;
    // right: highlight card
    cards.forEach(c=>c.classList.toggle('is-current', Number(c.dataset.week)===w));

    // left: highlight tracker
    $$('#fxWeekList li').forEach(li=>{
      li.classList.toggle('is-active', Number(li.dataset.week)===w);
    });

    // phase label + progress
    const phase = weekIndexToPhase[w];
    fxPhaseName.textContent = phase;
    const boundary = getPhaseBoundary(phase);
    const pct = Math.round(((w - boundary.start) / (boundary.end - boundary.start)) * 100);
    fxRail.style.width = `${Math.max(0, Math.min(100, pct))}%`;

    currentWeek = w;
  }

  function getPhaseBoundary(phase){
    let start = 1, end = totalWeeks, seen = 0;
    for (const p of data){
      const len = p.weeks.length;
      const s = seen + 1, e = seen + len;
      if (p.phase === phase){ start = s; end = e; break; }
      seen += len;
    }
    return { start, end };
  }

  // phase swap overlay (quick celebratory pill)
  const overlay = document.createElement('div');
  overlay.className = 'phase-swap';
  overlay.innerHTML = `<div class="swap-pill">Phase</div>`;
  document.body.appendChild(overlay);
  let swapTimeout;
  function announcePhaseSwap(phase){
    // Called when phase banner becomes visible
    overlay.querySelector('.swap-pill').textContent = `Phase: ${phase}`;
    if (prefersReduced()) return;
    overlay.classList.add('show');
    clearTimeout(swapTimeout);
    swapTimeout = setTimeout(()=>overlay.classList.remove('show'), 1000);
  }

  function prefersReduced(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // initialize first states
  setCurrentWeek(1);
})();










(function(){
  const onReady = (fn)=> (document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn)
    : fn());

  onReady(function(){
    const $  = (s, r=document)=>r.querySelector(s);
    const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

    const section = $('#program-runway');
    if(!section) return;

    const hstage  = section.querySelector('.hstage');
    const sticky  = section.querySelector('.hstage-sticky');
    const pan     = section.querySelector('#hPan');
    const bar     = section.querySelector('.weekbar.is-local');
    const barDots = section.querySelector('#rwDots');
    const barFill = section.querySelector('#rwFill');

    if(!hstage || !sticky || !pan || !bar || !barDots || !barFill) return;

    /* ----------------- Config ----------------- */
    const SEGMENTS            = 3;   // phases
    const CARDS_PER_SEG       = 4;   // 4 per phase
    const TOTAL_WEEKS         = SEGMENTS * CARDS_PER_SEG;
    const PAN_START_FRAC      = 0.92;
    const PANEL_WIDTH_VW      = 100;  // each phase panel width (vw)
    const SCROLL_PER_CARD_VH  = 70;  // ↑ increase to slow between cards
    const EASE                = (t)=>1-(1-t)*(1-t);  // easeOutQuad
    const SMOOTHSTEP          = (t)=>t*t*(3-2*t);
    const REDUCED             = ()=> window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    const pageTop = el => window.scrollY + el.getBoundingClientRect().top;

    /* ----------------- Data ----------------- */
    const DATA = [
      { phase:'Anchoring', weeks:[
        {n:1,  title:'Week 1 – Disrupting Autopilot',   purpose:'Spotlight present ways of seeing; break routine thinking.', bullets:['Attention science','Autopilot audit','Daily anchor rituals']},
        {n:2,  title:'Week 2 – Seeing Self & Systems',  purpose:'Habits + structures shape worldview.', bullets:['Conditioning & mirrors','“My Lens” map','5-Whys & needs']},
        {n:3,  title:'Week 3 – Navigate Overload',      purpose:'Create your Anchoring Map to filter noise.', bullets:['Micro-exercises','Anchoring Map','Team & research']},
        {n:4,  title:'Week 4 – Commit to Exploration',  purpose:'Choose clear anchor area + problem.', bullets:['Flexibility & empathy','Perspective carousel','Articulate problem']},
      ]},
      { phase:'Exploration', weeks:[
        {n:5,  title:'Week 5 – Bold First Steps',       purpose:'Transform doubt into action with tiny tests.', bullets:['Fear → exec brain','Desirability first','Run a micro-test']},
        {n:6,  title:'Week 6 – Teaming with Humans',    purpose:'Collab, listening, open-ended questions.', bullets:['Charter','Labeling & Peacock','Listening tools']},
        {n:7,  title:'Week 7 – Jobs-To-Be-Done',        purpose:'Uncover functional/emotional/social jobs.', bullets:['JBTD canvas','Interviews','Refine lens']},
        {n:8,  title:'Week 8 – Synthesis & HMW',        purpose:'Sense-make & generate possibilities.', bullets:['Cluster insights','HMW reframing','Share & celebrate']},
      ]},
      { phase:'Rooting', weeks:[
        {n:9,  title:'Week 9 – Power & Influence',      purpose:'See power objectively; grow referent/expert.', bullets:['5 bases rating','Power Mirror','1 influence action']},
        {n:10, title:'Week 10 – Social Capital',        purpose:'Stakeholders + meaningful outreach.', bullets:['Weak ties, reciprocity','Relation plan','Send 1 outreach']},
        {n:11, title:'Week 11 – MVP Sprint',            purpose:'Prototype or plan; test with someone.', bullets:['Define MVP/pilot','Rapid proto + critique','Next 3 milestones']},
        {n:12, title:'Week 12 – Rooting & Commitment',  purpose:'Share work; commit forward.', bullets:['Pitch circle','Leadership commitment','Pass-the-Torch']},
      ]},
    ];

    /* ----------------- DETAILS for richer cards (1–4 now, add more later) ----------------- */
    const DETAILS = {
      1: {
        anchors: ["Clarity","Courage"],
        outcomes: [
          "Spot autopilot patterns",
          "Practice daily anchor rituals"
        ],
        activities: ["Autopilot audit","Noticing exercises"],
        vibe: ["Excited","Reflective"]
      },
      2: {
        anchors: ["Clarity","Conscious Choice"],
        outcomes: [
          "See habits & structures clearly",
          "Map personal lenses"
        ],
        activities: ["Hot-seat interviews","Lens mapping"],
        vibe: ["Curious","Engaged"]
      },
      3: {
        anchors: ["Clarity","Courage"],
        outcomes: [
          "Handle overload & reset focus",
          "Draft Anchoring Map"
        ],
        activities: ["Micro-resets","Anchoring Map workshop"],
        vibe: ["Interested","Thoughtful"]
      },
      4: {
        anchors: ["Conscious Choice","Courage"],
        outcomes: [
          "Identify high-energy areas",
          "Define problem statement"
        ],
        activities: ["Perspective carousel","Listening drills"],
        vibe: ["Engaged","Looking forward"]
      },
      5: {
        anchors: ["Courage","Clarity"],
        outcomes: [
          "Transform fear into action",
          "Run a micro-test"
        ],
        activities: ["Tiny experiment","Desirability check"],
        vibe: ["Energized","Curious"]
      },
      6: {
        anchors: ["Courage","Connection"],
        outcomes: [
          "Build a team charter",
          "Practice deep listening"
        ],
        activities: ["Charter draft","Open-ended Qs"],
        vibe: ["Connected","Supportive"]
      },
      7: {
        anchors: ["Clarity"],
        outcomes: [
          "Discover jobs-to-be-done",
          "Refine problem lens"
        ],
        activities: ["JBTD mapping","User interviews"],
        vibe: ["Focused","Engaged"]
      },
      8: {
        anchors: ["Clarity","Choice"],
        outcomes: [
          "Synthesize insights",
          "Frame HMW questions"
        ],
        activities: ["Clustering","Reframing workshop"],
        vibe: ["Creative","Collaborative"]
      },
      9: {
        anchors: ["Choice","Leadership"],
        outcomes: [
          "Rate power bases",
          "Pick 1 influence action"
        ],
        activities: ["Power Mirror","Influence drill"],
        vibe: ["Empowered","Reflective"]
      },
      10: {
        anchors: ["Courage","Connection"],
        outcomes: [
          "Map stakeholders",
          "Send outreach"
        ],
        activities: ["Network map","Outreach draft"],
        vibe: ["Curious","Bold"]
      },
      11: {
        anchors: ["Clarity","Courage"],
        outcomes: [
          "Prototype MVP",
          "Plan milestones"
        ],
        activities: ["Rapid proto","Peer critique"],
        vibe: ["Productive","Confident"]
      },
      12: {
        anchors: ["Leadership","Commitment"],
        outcomes: [
          "Pitch your work",
          "Write commitment statement"
        ],
        activities: ["Pitch circle","Pass-the-torch"],
        vibe: ["Proud","Uplifted"]
      }
    };
    

    const icon = (p)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"></path></svg>`;
    const STAR = "M12 2l2.9 6h6.3l-5 3.9 1.9 6.1L12 16l-6.1 2 1.9-6.1-5-3.9h6.3z";
    const HEART= "M12 21s-6.7-4.2-9.3-7.6C-0.6 9.8 1 6 4.4 5.3 6.4 4.9 8.2 6 9 7.6 9.8 6 11.6 4.9 13.6 5.3 17 6 18.6 9.8 21.3 13.4 18.7 16.8 12 21 12 21z";
    const BOLT = "M13 2L3 14h7l-1 8 10-12h-7l1-8z";

    function enhanceCard(cardEl){
      const w = Number(cardEl.dataset.week);
      const d = DETAILS[w];
      if(!d) return;

      const phase = cardEl.dataset.phase;
      const title = cardEl.querySelector('.rw-title')?.textContent || `Week ${w}`;
      const purpose = cardEl.querySelector('p')?.innerHTML || '';

      cardEl.innerHTML = `
        <div class="rw-head">
          <span class="rw-phase">${phase}</span>
          <div class="rw-title">${title}</div>
        </div>

        <div class="rw-meta">
          <span class="rw-chip">${icon(STAR)} Anchors: ${d.anchors.join(" · ")}</span>
          <span class="rw-chip">${icon(BOLT)} Outcomes: ${d.outcomes.length}</span>
          <span class="rw-chip">${icon(HEART)} Vibe: ${d.vibe[0]}</span>
        </div>

        <p><strong>Purpose:</strong> ${purpose.replace('<strong>Purpose:</strong>','')}</p>

        <div class="rw-details">
          <div class="rw-section">
            <h4>Core Activities</h4>
            <ul class="rw-list">${d.activities.map(s=>`<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="rw-section">
            <h4>Outcomes</h4>
            <ul class="rw-list">${d.outcomes.map(s=>`<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="rw-section">
            <h4>Group Energy</h4>
            <p>${d.vibe.join(' · ')}</p>
          </div>
        </div>

        <button class="rw-toggle" aria-expanded="false" aria-controls="rw-d-${w}">
          <svg class="caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg>
          <span>Details</span>
        </button>
      `;

      const toggle = cardEl.querySelector('.rw-toggle');
      const details = cardEl.querySelector('.rw-details');
      if(toggle && details){
        details.id = `rw-d-${w}`;
        toggle.addEventListener('click', ()=>{
          const expanded = cardEl.classList.toggle('is-expanded');
          toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
      }
    }

    /* ----------------- Build DOM ----------------- */
    const rowsByPhase = {};
    $$('.phase-row', pan).forEach(pr => rowsByPhase[pr.dataset.phase] = pr.querySelector('.prow-cards'));

    // cards
    DATA.forEach(group=>{
      const df=document.createDocumentFragment();
      group.weeks.forEach(w=>{
        const el=document.createElement('article');
        el.className='rw-card';
        el.dataset.week=String(w.n);
        el.dataset.phase=group.phase;
        el.innerHTML=`
          <div class="rw-head">
            <span class="rw-phase">${group.phase}</span>
            <div class="rw-title">${w.title}</div>
          </div>
          <p><strong>Purpose:</strong> ${w.purpose}</p>
          ${w.bullets?.length ? `<ul>${w.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : ''}
        `;
        df.appendChild(el);
      });
      rowsByPhase[group.phase].appendChild(df);

      // enhance after insertion
      group.weeks.forEach(w=>{
        const card = rowsByPhase[group.phase].querySelector(`.rw-card[data-week="${w.n}"]`);
        if(card) enhanceCard(card);
      });
    });

    // week dots
    (()=>{
      const df=document.createDocumentFragment();
      for(let i=1;i<=TOTAL_WEEKS;i++){
        const li=document.createElement('li');
        li.textContent=String(i);
        li.dataset.week=String(i);
        li.addEventListener('click',()=>jumpToWeek(i));
        df.appendChild(li);
      }
      barDots.appendChild(df);
    })();

    function setActiveWeek(w){
      const ww=clamp(w,1,TOTAL_WEEKS);
      $$('#rwDots li').forEach(d=>{
        const n=Number(d.dataset.week);
        d.classList.toggle('is-active',n===ww);
        d.classList.toggle('is-done',n<ww);
      });
      barFill.style.width=`${(ww/TOTAL_WEEKS)*100}%`;
      section.querySelector('.weekbar-rail')?.setAttribute('aria-valuenow',String(ww));
    }
    setActiveWeek(1);

    /* ----------------- Stage sizing (dynamic, slower scroll) ----------------- */
    const panelCount = $$('.phase-row', pan).length; // 3
    const STAGE_VH = TOTAL_WEEKS * SCROLL_PER_CARD_VH; // vh per card
    hstage.style.height = STAGE_VH+'vh';

    // align pan grid with 35vw columns
    pan.style.width = (panelCount * PANEL_WIDTH_VW) + 'vw';
    pan.style.gridTemplateColumns = `repeat(${panelCount}, ${PANEL_WIDTH_VW}vw)`;

    /* keep weekbar local */
    new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        bar.style.opacity = e.isIntersecting ? '1' : '0';
        bar.style.pointerEvents = e.isIntersecting ? 'auto' : 'none';
      });
    },{threshold:.05}).observe(section);

    /* ----------------- Progress math with safety clamp ----------------- */
    let rangeCache = null;
    const computeRange = ()=>{
      const top=pageTop(hstage);
      const H=hstage.offsetHeight;
      const sh=sticky.offsetHeight;
      const minScrollable = window.innerHeight * 2; // at least 2 viewports
      rangeCache = { start: top, end: top + Math.max(minScrollable, H - sh) };
    };
    computeRange();

    const progress=()=>{
      const {start,end}=rangeCache;
      const y=window.scrollY;
      if(y<=start) return 0;
      if(y>=end)   return 1;
      return (y-start)/(end-start);
    };

    // recompute on resize/orientation/content changes
    let resizeTO;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTO);
      resizeTO = setTimeout(()=>{ computeRange(); }, 120);
    });

    /* ----------------- Reveal & Pan ----------------- */
    function update(p){                        // p already eased (0..1)
      const seg   = clamp(Math.floor(p*SEGMENTS),0,SEGMENTS-1);
      const local = (p*SEGMENTS) - seg;        // 0..1 inside this segment

      // 1) REVEAL in [0 .. PAN_START_FRAC]
      const revealLocal = Math.min(local, PAN_START_FRAC) / PAN_START_FRAC;  // 0..1
      const revealCount = Math.max(1, Math.ceil(revealLocal * CARDS_PER_SEG)); // 1..4
      const startW = seg*CARDS_PER_SEG + 1;
      const endW   = startW + CARDS_PER_SEG - 1;

      for(let w=startW; w<=endW; w++){
        const card = section.querySelector(`.rw-card[data-week="${w}"]`);
        if(!card) continue;
        const idx=(w-startW)+1; // 1..4
        card.classList.toggle('is-revealed', idx<=revealCount);
      }
      const currentWeek = (local <= PAN_START_FRAC) ? (startW + revealCount - 1) : endW;
      setActiveWeek(currentWeek);

      // 2) PAN in final slice, step size = PANEL_WIDTH_VW
      const maxUnits = panelCount - 1;
      let panUnits   = seg;
      if (seg < maxUnits && local > PAN_START_FRAC){
        const t = clamp((local - PAN_START_FRAC) / (1 - PAN_START_FRAC), 0, 1);
        panUnits = Math.min(maxUnits, seg + SMOOTHSTEP(t));
      }
      pan.style.transform = `translate3d(${-PANEL_WIDTH_VW * panUnits}vw,0,0)`;
    }

    /* ----------------- rAF loop ----------------- */
    (function loop(){
      const raw = progress();
      const p   = REDUCED() ? raw : EASE(raw);
      update(p);
      requestAnimationFrame(loop);
    })();

    /* ----------------- Jump to week ----------------- */
    function jumpToWeek(week){
      const w   = clamp(week,1,TOTAL_WEEKS);
      const seg = Math.floor((w-1)/CARDS_PER_SEG); // 0,1,2
      const idx = (w-1)%CARDS_PER_SEG;             // 0..3
      const localRevealTarget = PAN_START_FRAC * ((idx + 0.9) / CARDS_PER_SEG);
      const targetP = (seg + localRevealTarget) / SEGMENTS;
      const {start,end}=rangeCache;
      const y = start + targetP*(end-start);
      window.scrollTo({ top:y, behavior: REDUCED()? 'auto':'smooth' });
    }
  });
})();
