// --- Navbar sticky scroll effect ---
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- Mobile Nav Toggle ---
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
navToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", mobileMenu.classList.contains("active"));
});

// Close mobile menu on link click & smooth scroll
document.querySelectorAll('.mobile-menu a, .nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    // Smooth scroll
    const hash = this.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      e.preventDefault();
      document.querySelector(hash).scrollIntoView({behavior: "smooth"});
      mobileMenu.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// --- AOS Animations ---
AOS.init({ duration: 900, once: true });

// --- Testimonial Slider for Mobile ---
const slider = document.getElementById('testimonial-slider');
const dots = document.querySelectorAll('.testimonial-dot');
let slideIdx = 0;
function showSlide(idx) {
  if (!slider) return;
  const slides = slider.querySelectorAll('.testimonial-card');
  slides.forEach((s, i) => {
    s.style.display = (i === idx) ? 'flex' : 'none';
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}
if (window.innerWidth < 850 && slider) {
  showSlide(slideIdx);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slideIdx = i;
      showSlide(slideIdx);
    });
  });
}

// --- Floating labels for contact form ---
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value !== '') {
      this.classList.add('filled');
    } else {
      this.classList.remove('filled');
    }
  });
});

// --- AI Tool Logic ---
const validateIdeaBtn = document.getElementById('validate-idea-btn');
const businessIdeaInput = document.getElementById('business-idea-input');
const validatorLoader = document.getElementById('validator-loader');
const validatorOutput = document.getElementById('validator-output');
const generateTipBtn = document.getElementById('generate-tip-btn');
const tipLoader = document.getElementById('tip-loader');
const tipOutput = document.getElementById('tip-output');

// Replace with your actual Gemini API Key for production!
const GEMINI_API_KEY = "AIzaSyCj2YQ4XO6PZY0lyoBAr2giyHwKh1gqh3Y";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, loader, output, btn) {
  loader.classList.remove('hidden');
  output.classList.add('hidden');
  btn.disabled = true;

  try {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("API call failed: " + response.status);
    const result = await response.json();
    let text = "Sorry, something went wrong. Please try again later.";
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
      text = result.candidates[0].content.parts[0].text;
    }
    output.textContent = text;
    output.classList.remove('hidden');
  } catch (err) {
    output.textContent = "Sorry, something went wrong. Please try again later.";
    output.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
    btn.disabled = false;
  }
}
if (validateIdeaBtn) {
  validateIdeaBtn.addEventListener('click', () => {
    const idea = businessIdeaInput.value.trim();
    if (!idea) { alert("Please enter your business idea."); return; }
    const prompt = `Act as an experienced startup mentor for Sthir. A user has submitted a business idea. Provide a concise, constructive analysis (100-150 words): "Potential Strengths", "Potential Weaknesses", and "Key Questions to Consider". The user's idea is: "${idea}"`;
    callGemini(prompt, validatorLoader, validatorOutput, validateIdeaBtn);
  });
}
if (generateTipBtn) {
  generateTipBtn.addEventListener('click', () => {
    const prompt = "Act as Shalu Ahuja, founder of Sthir. Provide one unique, actionable, inspiring leadership tip for a young student or aspiring entrepreneur, in one or two sentences, reflecting the 'Sit Sthir, Stand Tall' philosophy.";
    callGemini(prompt, tipLoader, tipOutput, generateTipBtn);
  });
}
//FAQs Section
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const faqIcon = button.querySelector('.faq-icon');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-answer').classList.remove('active');
            item.querySelector('.faq-icon').textContent = '+';
        }
    });
    
    // Toggle current FAQ item
    if (faqAnswer.classList.contains('active')) {
        faqAnswer.classList.remove('active');
        faqIcon.textContent = '+';
    } else {
        faqAnswer.classList.add('active');
        faqIcon.textContent = '×';
    }
}

  // 12-Week Roadmap interactions

(function(){
  const base = document.getElementById('roadBase');
  const dash = document.getElementById('roadDash');
  const g = document.getElementById('waypoints');
  const panel = document.getElementById('roadPanel');
  const rpWeek = document.getElementById('rpWeek');
  const rpTitle = document.getElementById('rpTitle');
  const rpList = document.getElementById('rpList');
  const prevBtn = document.querySelector('.roadmap-prev');
  const nextBtn = document.querySelector('.roadmap-next');

  if(!base || !g) return;

  // normalized positions along the path (smooth spacing)
  const t = [0.02,0.10,0.18,0.26,0.38,0.46,0.54,0.62,0.73,0.82,0.90,0.97];

  // short tags shown near dots
  const tags = [
    'Autopilot','Self & Systems','Anchoring Map','Commit',
    'Bold Step','Team','JTBD','Synthesis',
    'Influence','Network','MVP','Commitment'
  ];

  // phase mapping (1–4, 5–8, 9–12)
  const phaseOf = i => (i<4?1:(i<8?2:3));

  // lightweight content for the panel
  const info = [
    {title:'Disrupting Autopilot', bullets:[
      'Neuroscience of attention & patterns',
      'Audit a day to spot default loops',
      'Pick one area to observe this week'
    ]},
    {title:'Seeing Self & Systems', bullets:[
      'Map habits + social structures',
      'Identify functional / emotional / social needs',
      'Run a 5-Whys on your problem'
    ]},
    {title:'Anchoring Map', bullets:[
      'Co-create your personal Anchoring Map',
      'Separate signal from noise',
      'Form early teams around a problem'
    ]},
    {title:'Commit to Explore', bullets:[
      'Cognitive flexibility through exercises',
      'Choose one problem space to pursue',
      'Articulate a clear problem statement'
    ]},
    {title:'Bold Step', bullets:[
      'Design a small real-world experiment',
      'Test desirability with real people',
      'Reflect: doubt → action'
    ]},
    {title:'Teaming with Humans', bullets:[
      'Build a Team Charter (roles & norms)',
      'Practice deep listening / open questions',
      'Collaboration across assumptions'
    ]},
    {title:'Jobs-To-Be-Done', bullets:[
      'Map functional, emotional, social jobs',
      'Interview 1–2 people for unmet needs',
      'Refine your problem lens'
    ]},
    {title:'Synthesis', bullets:[
      'Cluster insights into a Synthesis Map',
      'Create “How might we…?” directions',
      'Pick hypotheses for next phase'
    ]},
    {title:'Power & Influence', bullets:[
      'Map your influence (French & Raven)',
      'Identify gaps & growth actions',
      'Set 1 influence action for 2 weeks'
    ]},
    {title:'Social Capital & Experts', bullets:[
      'Stakeholder map (core / emerging / aspirational)',
      'Draft and send one real outreach',
      'Practice value-exchange networking'
    ]},
    {title:'MVP Sprint', bullets:[
      'Define the smallest testable MVP',
      'Rapid prototyping + peer critique',
      'Set 3 next milestones'
    ]},
    {title:'Commitment Ceremony', bullets:[
      'Share MVP / plan to peers & guests',
      'Feedback & broaden perspective',
      'Write your leadership commitment'
    ]}
  ];

  const total = base.getTotalLength();
  let active = 0;

  // draw waypoints exactly on the curve
  t.forEach((p, i) => {
    const pt = base.getPointAtLength(total * p);
    const grp = document.createElementNS('http://www.w3.org/2000/svg','g');
    grp.classList.add('waypoint');
    grp.setAttribute('data-phase', String(phaseOf(i)));
    grp.setAttribute('tabindex', '0');
    grp.setAttribute('role', 'button');
    grp.setAttribute('aria-label', `Week ${i+1}: ${info[i].title}`);
    grp.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    grp.innerHTML = `
      <circle r="9"></circle>
      <text class="wp-num" x="0" y="-14" text-anchor="middle">${i+1}</text>
      <text class="wp-tag" x="0" y="${i%2?22:28}" text-anchor="middle">${tags[i]}</text>
    `;
    grp.addEventListener('click', () => setActive(i));
    grp.addEventListener('keydown', (e) => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); setActive(i);} });
    g.appendChild(grp);
  });

  function setActive(i){
    active = i;
    [...g.children].forEach((el, idx) => el.setAttribute('aria-current', idx===i ? 'step' : 'false'));
    rpWeek.textContent = `Week ${i+1}`;
    rpTitle.textContent = info[i].title;
    rpList.innerHTML = info[i].bullets.map(b=>`<li>${b}</li>`).join('');
    panel.classList.remove('hidden');
  }

  // prev/next controls
  prevBtn.addEventListener('click', () => setActive((active+11)%12));
  nextBtn.addEventListener('click', () => setActive((active+1)%12));

  // init to week 1
  setActive(0);

  // keep dash path identical to base
  dash.setAttribute('d', base.getAttribute('d'));
})();

