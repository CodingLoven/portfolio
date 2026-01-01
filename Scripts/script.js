
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
     VIDEO STACK WITH AUTO-ROTATION
  ============================================ */
  const stack = document.querySelector(".video-stack");
  const cards = Array.from(document.querySelectorAll(".video-card"));
  const nextBtn = document.querySelector(".video-next-btn");

  if (!stack || cards.length === 0) return;

  const AUTOPLAY_INTERVAL = 4000; // 4 seconds - slow and smooth
  const SWIPE_THRESHOLD = 50;
  const INVIEW_THRESHOLD = 0.5;

  let activeIndex = 0;
  let autoplayTimer = null;
  let inView = false;
  let videoPlaying = false;

  /* Update visual stack positioning */
  const updateStack = () => {
    cards.forEach((card, i) => {
      const pos = (i - activeIndex + cards.length) % cards.length;

      card.classList.toggle("active", pos === 0);
      card.style.zIndex = cards.length - pos;
      card.style.opacity = pos > 2 ? 0 : 1;

      if (pos === 0) {
        card.style.transform = "translate(0,0) scale(1)";
      } else if (pos === 1) {
        card.style.transform = "translate(12px,12px) scale(0.92)";
      } else if (pos === 2) {
        card.style.transform = "translate(24px,24px) scale(0.85)";
      } else {
        card.style.transform = "translate(36px,36px) scale(0.80)";
      }
    });
  };

  /* Navigate through cards */
  const navigate = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    updateStack();
  };

  /* Auto-rotation control */
  const startAutoplay = () => {
    if (autoplayTimer || !inView || videoPlaying || cards.length <= 1) return;
    autoplayTimer = setInterval(() => navigate(1), AUTOPLAY_INTERVAL);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  /* Button click */
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      navigate(1);
      resetAutoplay();
    });
  }

  /* Swipe detection (bi-directional) */
  let startX = 0;
  let startY = 0;

  stack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stopAutoplay();
  }, { passive: true });

  stack.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = startX - endX;
    const deltaY = startY - endY;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX > 0 ? 1 : -1); // Swipe left = next, swipe right = previous
    }

    resetAutoplay();
  }, { passive: true });

  /* Video playback detection */
  cards.forEach((card) => {
    // Native <video> elements
    const video = card.querySelector("video");
    if (video) {
      video.addEventListener("play", () => {
        videoPlaying = true;
        stopAutoplay();
      });

      video.addEventListener("pause", () => {
        videoPlaying = false;
        startAutoplay();
      });

      video.addEventListener("ended", () => {
        videoPlaying = false;
        startAutoplay();
      });
    }

    // Vimeo iframe detection (more complex)
    const iframe = card.querySelector("iframe");
    if (iframe && iframe.src.includes("vimeo.com")) {
      // Vimeo Player API messages
      window.addEventListener("message", (e) => {
        if (e.origin !== "https://player.vimeo.com") return;

        try {
          const data = JSON.parse(e.data);
          
          if (data.event === "play") {
            videoPlaying = true;
            stopAutoplay();
          } else if (data.event === "pause" || data.event === "ended") {
            videoPlaying = false;
            startAutoplay();
          }
        } catch (err) {
          // Ignore parse errors
        }
      });

      // Enable Vimeo API
      iframe.src += (iframe.src.includes("?") ? "&" : "?") + "api=1";
    }
  });

  /* IntersectionObserver - start/stop when in view */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= INVIEW_THRESHOLD;
        if (inView) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      });
    },
    { threshold: INVIEW_THRESHOLD }
  );

  sectionObserver.observe(stack);

  /* Pause when tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (inView && !videoPlaying) {
      startAutoplay();
    }
  });

  /* Initialize */
  updateStack();
  startAutoplay();
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
