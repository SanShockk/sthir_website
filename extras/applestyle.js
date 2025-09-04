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
  
  
  
  
  
  
  
  
  