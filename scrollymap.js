  (function(){
    const onReady = (fn)=> (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());
    onReady(function(){
      const $  = (s, r=document)=>r.querySelector(s);
      const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

      /* ===== Decor rings (parallax) ===== */
      const rings = $('.rings');
      for(let i=0;i<8;i++){
        const d = document.createElement('div');
        d.className = 'ring';
        const size = 200 + Math.random()*900;
        d.style.width = d.style.height = size+ 'px';
        d.style.left = (Math.random()*100) + '%';
        d.style.top  = (Math.random()*100) + '%';
        d.dataset.depth = (Math.random()*0.8 + 0.2).toFixed(2);
        rings.appendChild(d);
      }
      window.addEventListener('mousemove', (e)=>{
        const cx = window.innerWidth/2, cy = window.innerHeight/2;
        const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy;
        $$('.ring').forEach(el=>{
          const k = parseFloat(el.dataset.depth||'0.5');
          el.style.transform = `translate(${dx*-10*k}px, ${dy*-10*k}px)`;
        });
      }, {passive:true});

      /* ===== Data (from your snippet) ===== */
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

      const DETAILS = {
        1:{anchors:["Clarity","Courage"], outcomes:["Spot autopilot patterns","Practice daily anchor rituals"], activities:["Autopilot audit","Noticing exercises"], vibe:["Excited","Reflective"]},
        2:{anchors:["Clarity","Conscious Choice"], outcomes:["See habits & structures clearly","Map personal lenses"], activities:["Hot-seat interviews","Lens mapping"], vibe:["Curious","Engaged"]},
        3:{anchors:["Clarity","Courage"], outcomes:["Handle overload & reset focus","Draft Anchoring Map"], activities:["Micro-resets","Anchoring Map workshop"], vibe:["Interested","Thoughtful"]},
        4:{anchors:["Conscious Choice","Courage"], outcomes:["Identify high-energy areas","Define problem statement"], activities:["Perspective carousel","Listening drills"], vibe:["Engaged","Looking forward"]},
        5:{anchors:["Courage","Clarity"], outcomes:["Transform fear into action","Run a micro-test"], activities:["Tiny experiment","Desirability check"], vibe:["Energized","Curious"]},
        6:{anchors:["Courage","Connection"], outcomes:["Build a team charter","Practice deep listening"], activities:["Charter draft","Open-ended Qs"], vibe:["Connected","Supportive"]},
        7:{anchors:["Clarity"], outcomes:["Discover jobs-to-be-done","Refine problem lens"], activities:["JBTD mapping","User interviews"], vibe:["Focused","Engaged"]},
        8:{anchors:["Clarity","Choice"], outcomes:["Synthesize insights","Frame HMW questions"], activities:["Clustering","Reframing workshop"], vibe:["Creative","Collaborative"]},
        9:{anchors:["Choice","Leadership"], outcomes:["Rate power bases","Pick 1 influence action"], activities:["Power Mirror","Influence drill"], vibe:["Empowered","Reflective"]},
        10:{anchors:["Courage","Connection"], outcomes:["Map stakeholders","Send outreach"], activities:["Network map","Outreach draft"], vibe:["Curious","Bold"]},
        11:{anchors:["Clarity","Courage"], outcomes:["Prototype MVP","Plan milestones"], activities:["Rapid proto","Peer critique"], vibe:["Productive","Confident"]},
        12:{anchors:["Leadership","Commitment"], outcomes:["Pitch your work","Write commitment statement"], activities:["Pitch circle","Pass-the-torch"], vibe:["Proud","Uplifted"]},
      };

      const section = $('#program-runway');
      const pan = $('#hPan');

      /* ===== Build panels + cards ===== */
      const ICON = (p)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"></path></svg>`;
      const STAR = "M12 2l2.9 6h6.3l-5 3.9 1.9 6.1L12 16l-6.1 2 1.9-6.1-5-3.9h6.3z";
      const HEART= "M12 21s-6.7-4.2-9.3-7.6C-0.6 9.8 1 6 4.4 5.3 6.4 4.9 8.2 6 9 7.6 9.8 6 11.6 4.9 13.6 5.3 17 6 18.6 9.8 21.3 13.4 18.7 16.8 12 21 12 21z";
      const BOLT = "M13 2L3 14h7l-1 8 10-12h-7l1-8z";

      DATA.forEach(group=>{
        const panel = document.createElement('section');
        panel.className = 'phase';
        panel.dataset.phase = group.phase;
        panel.innerHTML = `
          <header>
            <span class="pill">${group.phase}</span>
            <h2>${group.phase}</h2>
            <p class="sub">${
              group.phase==='Anchoring'?'Consciousness begins with disruption.':
              group.phase==='Exploration'?'Courage & confidence are born through action and friction.':
              'Clarity deepens through creation.'}
            </p>
          </header>
          <div class="cards"></div>
        `;
        const grid = panel.querySelector('.cards');
        group.weeks.forEach(w=>{
          const d = DETAILS[w.n];
          const el = document.createElement('article');
          el.className = 'card';
          el.dataset.week = w.n;
          el.innerHTML = `
            <div class="head">
              <span class="pill">${group.phase}</span>
              <div class="title">${w.title}</div>
            </div>
            <p><strong>Purpose:</strong> ${w.purpose}</p>
            ${w.bullets?.length ? `<ul>${w.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : ''}
            ${d?`
            <div class="meta">
              <span class="chip">${ICON(STAR)} Anchors: ${d.anchors.join(' · ')}</span>
              <span class="chip">${ICON(BOLT)} Outcomes: ${d.outcomes.length}</span>
              <span class="chip">${ICON(HEART)} Vibe: ${d.vibe[0]}</span>
            </div>
            <div class="details" id="det-${w.n}">
              <div class="sect"><h4>Core Activities</h4><ul>${d.activities.map(s=>`<li>${s}</li>`).join('')}</ul></div>
              <div class="sect"><h4>Outcomes</h4><ul>${d.outcomes.map(s=>`<li>${s}</li>`).join('')}</ul></div>
              <div class="sect"><h4>Group Energy</h4><p>${d.vibe.join(' · ')}</p></div>
            </div>
            <button class="toggle" aria-expanded="false" aria-controls="det-${w.n}"><svg class="caret" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg><span>Details</span></button>
            `:''}
          `;
          el.querySelector('.toggle')?.addEventListener('click',()=>{
            const expanded = el.classList.toggle('expanded');
            const btn = el.querySelector('.toggle');
            btn && btn.setAttribute('aria-expanded', expanded? 'true':'false');
          });
          grid.appendChild(el);
        });
        pan.appendChild(panel);
      });

      /* ===== Progress, reveal & cinematic pan ===== */
      const TOTAL_WEEKS = 12; const SEGMENTS=3; const CARDS_PER_SEG=4; const PAN_START_FRAC=.9;
      const stickyRange = (()=>{
        const hstage = section.querySelector('.hstage');
        const sticky = section.querySelector('.sticky');
        const pageTop = el => window.scrollY + el.getBoundingClientRect().top;
        const compute = ()=>{
          const top=pageTop(hstage), H=hstage.offsetHeight, sh=sticky.offsetHeight; const minScrollable = window.innerHeight*2;
          return {start: top, end: top + Math.max(minScrollable, H - sh)};
        };
        let cache = compute();
        window.addEventListener('resize', ()=>{ cache = compute(); }, {passive:true});
        return ()=>cache;
      })();

      const barDots = $('#rwDots');
      const barFill = $('#rwFill');
      for(let i=1;i<=TOTAL_WEEKS;i++){
        const li=document.createElement('li'); li.textContent=String(i); li.dataset.week=String(i);
        li.addEventListener('click',()=>jumpToWeek(i)); barDots.appendChild(li);
      }
      function setActiveWeek(w){
        const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)); const ww=clamp(w,1,TOTAL_WEEKS);
        $$('.dots li').forEach(d=>{ const n=Number(d.dataset.week); d.classList.toggle('active',n===ww); d.classList.toggle('done',n<ww); });
        barFill.style.width = `${(ww/TOTAL_WEEKS)*100}%`;
        section.querySelector('.rail')?.setAttribute('aria-valuenow',String(ww));
      }
      setActiveWeek(1);

      // entrance observer per card
      const revealIO = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); revealIO.unobserve(e.target);} });
      }, {root: $('.sticky'), threshold:.15});
      $$('.card').forEach(c=> revealIO.observe(c));

      // scrub loop: glide panels horizontally with easing while cards reveal vertically
      const SMOOTHSTEP=(t)=>t*t*(3-2*t); const EASE=(t)=>1-(1-t)*(1-t);
      function progress(){ const {start,end}=stickyRange(); const y=window.scrollY; if(y<=start) return 0; if(y>=end) return 1; return (y-start)/(end-start); }
      function update(p){
        // compute segment + local
        const seg = Math.max(0, Math.min(SEGMENTS-1, Math.floor(p*SEGMENTS)));
        const local = (p*SEGMENTS) - seg;
        // 1) card reveal pacing
        const revealLocal = Math.min(local, PAN_START_FRAC) / PAN_START_FRAC;  // 0..1
        const revealCount = Math.max(1, Math.ceil(revealLocal * CARDS_PER_SEG));
        const startW = seg*CARDS_PER_SEG + 1; const endW=startW + CARDS_PER_SEG - 1;
        for(let w=startW; w<=endW; w++){
          const card = section.querySelector(`.card[data-week="${w}"]`);
          if(card) card.classList.toggle('revealed', (w-startW+1) <= revealCount);
        }
        const currentWeek = (local <= PAN_START_FRAC) ? (startW + revealCount - 1) : endW;
        setActiveWeek(currentWeek);
        // 2) cinematic pan with slight tilt
        const maxUnits = SEGMENTS - 1; let panUnits = seg;
        if (seg < maxUnits && local > PAN_START_FRAC){
          const t = Math.max(0, Math.min(1, (local - PAN_START_FRAC) / (1 - PAN_START_FRAC)));
          panUnits = Math.min(maxUnits, seg + SMOOTHSTEP(t));
        }
        const tx = -100 * panUnits; // vw units (each panel is 100vw)
        const tilt = (p*2-1) * 2; // -2..2deg
        $('#hPan').style.transform = `translate3d(${tx}vw,0,0) rotateY(${tilt}deg)`;
      }
      (function loop(){ const raw = progress(); const p = matchMedia('(prefers-reduced-motion: reduce)').matches? raw : EASE(raw); update(p); requestAnimationFrame(loop); })();

      function jumpToWeek(week){
        const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
        const w=clamp(week,1,TOTAL_WEEKS); const seg=Math.floor((w-1)/CARDS_PER_SEG); const idx=(w-1)%CARDS_PER_SEG;
        const localRevealTarget = PAN_START_FRAC * ((idx + 0.9) / CARDS_PER_SEG);
        const targetP = (seg + localRevealTarget) / SEGMENTS; const {start,end}=stickyRange();
        const y = start + targetP*(end-start); window.scrollTo({ top:y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches? 'auto':'smooth' });
      }

      // subtle magnetic hover
      $$('.card').forEach(card=>{
        card.addEventListener('pointermove', (e)=>{
          const r = card.getBoundingClientRect(); const x = (e.clientX - r.left)/r.width - .5; const y = (e.clientY - r.top)/r.height - .5;
          card.style.transform = `rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateZ(0)`;
        });
        card.addEventListener('pointerleave', ()=>{ card.style.transform=''; });
      });
    });
  })();

  (function(){
    const onReady = (fn)=> (document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn());
  
    onReady(function(){
      const $  = (s, r=document)=>r.querySelector(s);
      const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  
      /* ========= 1) Mobile-safe viewport height var ========= */
      // Keeps sticky stage consistent when the mobile URL bar shows/hides
      function setVH(){
        document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
      }
      setVH();
      window.addEventListener('resize', setVH, {passive:true});
  
      /* ========= 2) Rings: fewer on mobile + fallback inputs ========= */
      const ringsRoot = $('.rings');
      if (ringsRoot) {
        const isNarrow = matchMedia('(max-width: 520px)').matches;
        const RING_COUNT = isNarrow ? 4 : 8;
  
        // Build rings with smaller blur footprint on small screens
        for (let i=0;i<RING_COUNT;i++){
          const d = document.createElement('div');
          d.className = 'ring';
          const size = (isNarrow ? 140 : 200) + Math.random() * (isNarrow ? 520 : 900);
          d.style.width = d.style.height = size + 'px';
          d.style.left = (Math.random()*100) + '%';
          d.style.top  = (Math.random()*100) + '%';
          d.dataset.depth = (Math.random()*0.8 + 0.2).toFixed(2);
          d.style.willChange = 'transform';
          ringsRoot.appendChild(d);
        }
  
        const rings = $$('.ring');
        const moveRings = (dx, dy)=>{
          // dx, dy are -1..1
          for (const el of rings){
            const k = parseFloat(el.dataset.depth||'0.5');
            el.style.transform = `translate3d(${dx * -10 * k}px, ${dy * -10 * k}px, 0)`;
          }
        };
  
        const hasHover = matchMedia('(hover: hover)').matches;
  
        // Desktop: mouse move
        if (hasHover) {
          window.addEventListener('mousemove', (e)=>{
            const cx = window.innerWidth/2, cy = window.innerHeight/2;
            const dx = (e.clientX - cx)/cx;   // -1..1
            const dy = (e.clientY - cy)/cy;   // -1..1
            moveRings(dx, dy);
          }, {passive:true});
        } else {
          // Mobile: try tilt first (requires permission on iOS)
          let usingTilt = false, raf = null, target = {x:0, y:0}, current = {x:0, y:0};
  
          function tick(){
            // ease to target for smoothness
            current.x += (target.x - current.x) * 0.12;
            current.y += (target.y - current.y) * 0.12;
            moveRings(current.x, current.y);
            raf = requestAnimationFrame(tick);
          }
  
          function startRAF(){ if (!raf) raf = requestAnimationFrame(tick); }
          function stopRAF(){ if (raf) cancelAnimationFrame(raf), raf=null; }
  
          async function tryTilt(){
            try {
              // iOS 13+ needs user gesture; if not granted, it throws
              if (typeof DeviceOrientationEvent !== 'undefined' &&
                  typeof DeviceOrientationEvent.requestPermission === 'function') {
                const res = await DeviceOrientationEvent.requestPermission();
                if (res !== 'granted') throw new Error('permission denied');
              }
              usingTilt = true;
              window.addEventListener('deviceorientation', (e)=>{
                // gamma: left/right (~-45..45), beta: front/back (~-45..45)
                const dx = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
                const dy = Math.max(-1, Math.min(1, (e.beta  || 0) / 30));
                target.x = dx; target.y = dy;
              }, {passive:true});
              startRAF();
            } catch {
              usingTilt = false;
            }
          }
  
          // Kick off tilt; if not available or permission denied, we’ll fall back to scroll
          tryTilt().finally(()=>{
            if (!usingTilt) {
              // Fallback: gentle scroll parallax
              const maxShift = 0.6; // keep subtle
              const onScroll = ()=>{
                const y = window.scrollY || 0;
                const dy = Math.sin(y / 800) * maxShift; // -max..max
                const dx = Math.cos(y / 1000) * maxShift;
                moveRings(dx, dy);
              };
              onScroll();
              window.addEventListener('scroll', onScroll, {passive:true});
            }
          });
  
          // Stop RAF when page hidden to save battery
          document.addEventListener('visibilitychange', ()=>{
            if (document.hidden) stopRAF(); else if (usingTilt) startRAF();
          });
        }
      }
  
      /* ========= 3) Disable heavy hover-tilt on touch ========= */
      // Your original code adds pointermove on all cards; gate it to hover-capable only
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        $$('.card').forEach(card=>{
          card.addEventListener('pointermove', (e)=>{
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left)/r.width - .5;
            const y = (e.clientY - r.top)/r.height - .5;
            card.style.transform = `rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateZ(0)`;
          });
          card.addEventListener('pointerleave', ()=>{ card.style.transform=''; });
        });
      }
    });
  })();
  