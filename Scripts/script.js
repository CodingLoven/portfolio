
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  let activeFilter = "all";

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Prevent re-running same filter
      if (filter === activeFilter) return;
      activeFilter = filter;

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Animate out all cards first
      projectCards.forEach((card) => {
        card.classList.add("is-hidden");
      });

      // After fade-out, filter and fade-in
      setTimeout(() => {
        projectCards.forEach((card) => {
          const category = card.dataset.category;

          if (filter === "all" || category === filter) {
            card.style.display = "grid"; // restore layout
            requestAnimationFrame(() => {
              card.classList.remove("is-hidden");
            });
          } else {
            card.style.display = "none";
          }
        });
      }, 250);
    });
  });
});







// testimonial section js 

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================
     COUNT-UP NUMBERS ON SCROLL (UNCHANGED)
  ============================================ */
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  const countUp = (el) => {
    const raw = el.dataset.value;
    const isDecimal = raw.includes(".");
    const target = parseFloat(raw);
    const suffix = el.textContent.replace(/[0-9.]/g, "");
    const duration = 800;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = target * progress;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(countUp);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector(".about-stats");
  if (statsSection) statsObserver.observe(statsSection);

  /* ============================================
     VIDEO STACK WITH MANUAL SWIPE
  ============================================ */
  const stack = document.querySelector(".video-stack");
  const cards = Array.from(document.querySelectorAll(".video-card"));
  const nextBtn = document.querySelector(".video-next-btn");

  if (!stack || cards.length === 0) return;

  const SWIPE_THRESHOLD = 50;

  let activeIndex = 0;

  /* Update visual stack positioning */
  const updateStack = () => {
    cards.forEach((card, i) => {
      const pos = (i - activeIndex + cards.length) % cards.length;

      card.classList.toggle("active", pos === 0);
      card.style.zIndex = cards.length - pos;
      card.style.opacity = 1;

      if (pos === 0) {
          card.style.transform = "translate(0, 0) scale(1)";
        } else if (pos === 1) {
          card.style.transform = "translate(20px, -15px) scale(0.95)";
        } else if (pos === 2) {
          card.style.transform = "translate(40px, -30px) scale(0.90)";
        } else {
          card.style.transform = "translate(60px, -45px) scale(0.85)";
        }
    });
  };

  /* Navigate through cards */
  const navigate = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    updateStack();
  };

  /* Button click */
  if (nextBtn) {
    nextBtn.addEventListener("click", () => navigate(1));
  }

  /* Swipe detection (bi-directional) */
  let startX = 0;
  let startY = 0;

  const swipeTargets = [stack, ...cards];

  swipeTargets.forEach(target => {
    target.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    target.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = startX - endX;
      const deltaY = startY - endY;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        navigate(deltaX > 0 ? 1 : -1);
      }
    }, { passive: true });
  });
  
  /* Initialize */
  updateStack();

  /* ============================================
     SWIPE HINT OVERLAY
  ============================================ */
  const showSwipeHint = () => {
    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.innerHTML = 'Swipe <span style="font-size: 1.3em; margin-left: 4px;">→</span>';
    hint.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 500;
      pointer-events: none;
      z-index: 100;
      animation: fadeInOut 3.5s ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    stack.appendChild(hint);
    
    setTimeout(() => hint.remove(), 3500);
  };

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
      15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
  `;
  document.head.appendChild(style);

  // Show hint when section comes into view (once per page load)
  let hintShown = false;
  const hintObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hintShown) {
        hintShown = true;
        setTimeout(showSwipeHint, 600);
        hintObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );
  hintObserver.observe(stack);
});

// header Hamburger

const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

toggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
});

// header scroll float script

let lastScrollY = window.scrollY;
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    header.classList.add("is-hidden");   // scrolling down → hide
  } else {
    header.classList.remove("is-hidden"); // scrolling up → show
  }

  lastScrollY = currentScrollY;
});





// Faq Tabs

const tabs = document.querySelectorAll('.faq-tab');
const groups = document.querySelectorAll('.faq-group');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    groups.forEach(g => g.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Accordion
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const group = item.closest('.faq-group');

    group.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) {
        const answer = other.querySelector('.faq-answer');
        answer.style.height = '0px';
        other.classList.remove('active');
      }
    });

    const answer = item.querySelector('.faq-answer');

    if (item.classList.contains('active')) {
      answer.style.height = '0px';
      item.classList.remove('active');
    } else {
      item.classList.add('active');
      answer.style.height = answer.scrollHeight + 'px';
    }
  });
});

// Open first FAQ item on load
window.addEventListener('load', () => {
  const firstGroup = document.querySelector('.faq-group.active');
  if (!firstGroup) return;

  const firstItem = firstGroup.querySelector('.faq-item');
  if (!firstItem) return;

  const answer = firstItem.querySelector('.faq-answer');

  firstItem.classList.add('active');
  answer.style.height = answer.scrollHeight + 'px';
  answer.style.opacity = '1';
  answer.style.transform = 'translateY(0)';
});






// section reveal script

const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

reveals.forEach(el => revealObserver.observe(el));


// Get Year script
document.getElementById("year").textContent = new Date().getFullYear();





//  Cal element-click embed code begins 

(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "business-meeting", { origin: "https://app.cal.com" });

Cal.ns["business-meeting"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
