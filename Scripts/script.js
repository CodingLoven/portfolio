
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
  const stack = document.querySelector(".video-stack");
  const cards = Array.from(document.querySelectorAll(".video-card"));
  const swipeLayer = document.querySelector(".video-swipe-layer");
  const nextBtn = document.querySelector(".video-next-btn");
  const prevBtn = document.querySelector(".video-prev-btn");

  if (!stack || cards.length === 0) return;

  let activeIndex = 0;
  const SWIPE_THRESHOLD = 60;
  const TAP_TIME_THRESHOLD = 200; // Max time for tap (not swipe)
  const TAP_MOVE_THRESHOLD = 10;  // Max movement for tap

  const updateStack = () => {
    cards.forEach((card, i) => {
      const pos = (i - activeIndex + cards.length) % cards.length;

      card.classList.toggle("active", pos === 0);
      card.style.zIndex = String(cards.length - pos);
      card.style.opacity = "1";

      if (pos === 0) card.style.transform = "translate(0,0) scale(1)";
      else if (pos === 1) card.style.transform = "translate(20px,-15px) scale(0.95)";
      else if (pos === 2) card.style.transform = "translate(40px,-30px) scale(0.90)";
      else card.style.transform = "translate(60px,-45px) scale(0.85)";
    });
  };

  const navigate = (dir) => {
    activeIndex = (activeIndex + dir + cards.length) % cards.length;
    updateStack();
  };

  if (nextBtn) nextBtn.addEventListener("click", () => navigate(1));
  if (prevBtn) prevBtn.addEventListener("click", () => navigate(-1));

  updateStack();

  if (!swipeLayer) return;

  // ✅ MASTER SOLUTION: Detect tap vs swipe
  let startX = 0, startY = 0;
  let startTime = 0;
  let dragging = false;
  let locked = false;
  let moved = false;

  const getActiveCard = () => cards[activeIndex];

  swipeLayer.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startTime = Date.now();
    dragging = false;
    locked = false;
    moved = false;

    const active = getActiveCard();
    if (active) active.style.transition = "none";
  }, { passive: true });

  swipeLayer.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    // Mark that user moved their finger
    if (Math.abs(dx) > TAP_MOVE_THRESHOLD || Math.abs(dy) > TAP_MOVE_THRESHOLD) {
      moved = true;
    }

    if (!locked) {
      locked = true;
      dragging = Math.abs(dx) > Math.abs(dy);
    }

    if (dragging) {
      e.preventDefault();

      const active = getActiveCard();
      if (!active) return;

      const tilt = Math.max(-10, Math.min(10, dx * 0.06));
      const scale = 1 - Math.min(0.05, Math.abs(dx) / 800);

      active.style.transform = `translate(${dx}px,0) rotate(${tilt}deg) scale(${scale})`;
      active.style.opacity = String(1 - Math.min(0.35, Math.abs(dx) / 600));
    }
  }, { passive: false });

  swipeLayer.addEventListener("touchend", (e) => {
    const active = getActiveCard();
    if (!active) return;

    const endTime = Date.now();
    const duration = endTime - startTime;

    active.style.transition = "transform 0.6s ease, opacity 0.6s ease";

    // ✅ Detect TAP: quick touch with minimal movement
    const isTap = duration < TAP_TIME_THRESHOLD && !moved;

    if (isTap) {
      // It's a tap - trigger video play
      const video = active.querySelector("video");
      const iframe = active.querySelector("iframe");

      if (video) {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      } else if (iframe) {
        // For Vimeo/YouTube iframes - simulate click on iframe
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }

      // Reset transform in case of partial drag
      active.style.transform = "translate(0,0) scale(1)";
      active.style.opacity = "1";
      return;
    }

    // ✅ It's a SWIPE - handle navigation
    if (!dragging) return;

    const endX = e.changedTouches?.[0]?.clientX ?? startX;
    const dx = endX - startX;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const off = dx < 0 ? -stack.clientWidth - 80 : stack.clientWidth + 80;
      active.style.transform = `translate(${off}px,0) rotate(${dx < 0 ? -10 : 10}deg) scale(0.92)`;
      active.style.opacity = "0.2";

      active.addEventListener("transitionend", function done() {
        active.removeEventListener("transitionend", done);
        navigate(dx < 0 ? 1 : -1);
      });
    } else {
      active.style.transform = "translate(0,0) scale(1)";
      active.style.opacity = "1";
    }
  }, { passive: false });
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
