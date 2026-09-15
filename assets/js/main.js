/**
 * ANIL KUMAR - MODERN PORTFOLIO INTERACTIVITY
 * High-performance vanilla JavaScript modules
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initCounters();
  initNavigation();
  initSkillsFilter();
  initResumeDropdown();
  initContactForm();
  initBackToTop();
});

/* -------------------------------------------------------------------------- */
/* 1. TYPING EFFECT                                                          */
/* -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'Publisher Solution Specialist',
    'AdTech Technical Implementation Expert',
    'Ex-Senior Implementation Rep @ Taboola',
    'Search Monetization & AdOps Lead',
    'JavaScript & SQL Technical Troubleshooter'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingDelay = 2200; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 500; // Pause before typing new word
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* -------------------------------------------------------------------------- */
/* 2. NUMBER COUNTERS (INTERSECTION OBSERVER)                                */
/* -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const timer = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentVal = Math.round(target * progress);

            counter.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

            if (frame === totalFrames) {
              clearInterval(timer);
              counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          }, frameDuration);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

function easeOutQuad(t) {
  return t * (2 - t);
}

/* -------------------------------------------------------------------------- */
/* 3. NAVIGATION & SCROLLSPY                                                 */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 4. SKILLS FILTER TABS                                                     */
/* -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!tabButtons.length || !skillCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. RESUME DROPDOWN TOGGLE                                                 */
/* -------------------------------------------------------------------------- */
function initResumeDropdown() {
  const dropdownTriggers = document.querySelectorAll('.resume-dropdown-btn');

  dropdownTriggers.forEach(btn => {
    const parent = btn.closest('.dropdown');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      parent.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. REAL BACKEND CONTACT FORM (AJAX EMAIL DELIVERY)                        */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusBanner = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn') || (form ? form.querySelector('button[type="submit"]') : null);

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const subject = document.getElementById('subjectInput').value.trim() || 'New Portfolio Inquiry from ' + name;
    const message = document.getElementById('messageInput').value.trim();

    if (!name || !email || !message) {
      showStatus('error', '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields.');
      return;
    }

    // Set Loading State
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
    showStatus('loading', '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting your message directly to Anil\'s inbox...');

    const payload = {
      name: name,
      email: email,
      _subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
      message: message,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/anil.k1202@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
        showStatus('success', '<i class="fa-solid fa-circle-check"></i> <strong>Thank you, ' + name + '!</strong> Your message has been sent directly to Anil\'s inbox. You will receive a response shortly.');
        form.reset();
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.style.background = '';
        }, 5000);
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (err) {
      console.warn('Direct form submission error, providing fallback:', err);
      const mailtoUrl = `mailto:anil.k1202@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      showStatus('error', `<i class="fa-solid fa-circle-exclamation"></i> Could not send automatically. <a href="${mailtoUrl}" style="color: #ffffff; text-decoration: underline; font-weight: 700;">Click here to send directly via Email</a>`);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  function showStatus(type, html) {
    if (!statusBanner) return;
    statusBanner.className = `form-status ${type}`;
    statusBanner.innerHTML = html;
    statusBanner.style.display = 'flex';
  }
}

/* -------------------------------------------------------------------------- */
/* 7. BACK TO TOP BUTTON                                                     */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
