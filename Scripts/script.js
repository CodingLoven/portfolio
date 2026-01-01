
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

  const nextBtn = document.querySelector(".video-next-btn"); // your top button
  const prevBtn = document.querySelector(".video-prev-btn"); // optional if you have it

  if (!stack || cards.length === 0) return;

  let activeIndex = 0;
  const SWIPE_THRESHOLD = 60;

  const updateStack = () => {
    cards.forEach((card, i) => {
      const pos = (i - activeIndex + cards.length) % cards.length;

      card.classList.toggle("active", pos === 0);
      card.style.zIndex = String(cards.length - pos);
      card.style.opacity = "1";
      card.style.pointerEvents = pos === 0 ? "auto" : "none";

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

  // ✅ Desktop buttons
  if (nextBtn) nextBtn.addEventListener("click", () => navigate(1));
  if (prevBtn) prevBtn.addEventListener("click", () => navigate(-1));

  updateStack();

  // If you don't have swipeLayer, still allow desktop to work
  if (!swipeLayer) return;

  // ✅ Swipe logic (single system)
  let startX = 0, startY = 0;
  let dragging = false;
  let locked = false;

  const getActiveCard = () => cards[activeIndex];

  swipeLayer.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    dragging = false;
    locked = false;

    const active = getActiveCard();
    if (active) active.style.transition = "none";
  }, { passive: true });

  swipeLayer.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

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

    active.style.transition = "transform 0.6s ease, opacity 0.6s ease";
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

  // ✅ Tap-to-play: works with <video>. If you're using iframe embeds, tell me.
  swipeLayer.addEventListener("touchend", (e) => {
    if (dragging) return;

      const video = getActiveCard()?.querySelector("video");
      if (!video) return;

      video.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    });
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
