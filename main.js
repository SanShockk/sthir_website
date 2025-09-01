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

