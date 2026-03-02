(function () {
  'use strict';

  // Navbar scroll state
  var header = document.getElementById('header');
  if (header) {
    var scrolled = false;
    function onScroll() {
      if (window.scrollY > 50) {
        if (!scrolled) {
          header.classList.remove('transparent');
          header.classList.add('scrolled');
          scrolled = true;
        }
      } else {
        if (scrolled) {
          header.classList.add('transparent');
          header.classList.remove('scrolled');
          scrolled = false;
        }
      }
    }
    header.classList.add('transparent');
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile burger menu
  var burger = document.getElementById('burger');
  if (burger && header) {
    burger.addEventListener('click', function () {
      header.classList.toggle('open');
      document.body.style.overflow = header.classList.contains('open') ? 'hidden' : '';
    });

    var drawerLinks = header.querySelectorAll('.drawer-link, .drawer-cta');
    drawerLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === '#') return;
    a.addEventListener('click', function (e) {
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver: reveal sections
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Animated counters for stats
  var statValues = document.querySelectorAll('.stat-value');
  if (statValues.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 2500;
          var start = performance.now();
          var startVal = 0;

          function animate(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            var current = Math.floor(startVal + (target - startVal) * eased);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    statValues.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // Pricing toggle: month / year
  var pricingToggle = document.querySelector('.pricing-toggle');
  var toggleBtns = document.querySelectorAll('.toggle-btn');
  var priceNums = document.querySelectorAll('.price-num');
  if (pricingToggle && toggleBtns.length) {
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var period = btn.getAttribute('data-period');
        if (!period) return;
        pricingToggle.setAttribute('data-period', period);
        toggleBtns.forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-period') === period);
        });
        priceNums.forEach(function (num) {
          var val = period === 'monthly'
            ? num.getAttribute('data-monthly')
            : num.getAttribute('data-yearly');
          num.textContent = val;
        });
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
