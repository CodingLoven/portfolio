
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

(() => {
  const section = document.querySelector('#about');
  const slider = document.querySelector('.video-slider');
  const track = document.querySelector('.video-track');
  const btnLeft = slider?.querySelector('.video-arrow.left');
  const btnRight = slider?.querySelector('.video-arrow.right');

  if (!section || !slider || !track) return;

  /* =========================
     STATE & CONSTANTS
  ========================= */
  let posX = 0;
  const gap = parseFloat(getComputedStyle(track).gap) || 24;

  const cardWidth = () =>
    track.children[0] ? track.children[0].offsetWidth + gap : 0;

  /* =========================
     SWIPE/DRAG STATE
  ========================= */
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startPosX = 0;

  /* =========================
     ARROW NAVIGATION (INFINITE)
  ========================= */
  btnRight?.addEventListener('click', () => {
    posX -= cardWidth();
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(${posX}px)`;

    setTimeout(() => {
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      posX += cardWidth();
      track.style.transform = `translateX(${posX}px)`;
    }, 400);
  });

  btnLeft?.addEventListener('click', () => {
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    posX -= cardWidth();
    track.style.transition = 'none';
    track.style.transform = `translateX(${posX}px)`;

    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.4s ease';
      posX += cardWidth();
      track.style.transform = `translateX(${posX}px)`;
    });
  });

  /* =========================
     TOUCH/SWIPE SUPPORT
  ========================= */
  function handleDragStart(e) {
    isDragging = true;
    startPosX = posX;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(${startPosX + diff}px)`;
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    
    const diff = currentX - startX;
    const threshold = cardWidth() * 0.3; // 30% of card width to trigger slide

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped right (go to previous)
        btnLeft?.click();
      } else {
        // Swiped left (go to next)
        btnRight?.click();
      }
    } else {
      // Snap back to current position
      track.style.transition = 'transform 0.3s ease';
      track.style.transform = `translateX(${posX}px)`;
    }
  }

  // Mouse events (desktop)
  track.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  // Touch events (mobile/tablet)
  track.addEventListener('touchstart', handleDragStart, { passive: false });
  track.addEventListener('touchmove', handleDragMove, { passive: false });
  track.addEventListener('touchend', handleDragEnd);

  // Prevent drag on videos/iframes
  track.querySelectorAll('video, iframe').forEach(media => {
    media.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
    media.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });
  });

  // Add grab cursor
  track.style.cursor = 'grab';

})();




/*    STATS COUNT-UP ON SCROLL */

(() => {
  const counters = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.about-stats');

  if (!counters.length || !statsSection) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.value);
    let current = 0;
    const duration = 1000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.floor(progress * target);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.4
  });

  observer.observe(statsSection);
})();











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
