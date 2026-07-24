/* =========================================================
   NARA'S WORLD -- shared vanilla JS
   Handles: sticky nav, mobile menu, hero slider, filter tabs,
   image gallery lightbox, scroll reveal animation.
   No frameworks, no build step.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('solid');
      } else {
        header.classList.remove('solid');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Hero / matchday slider ---------- */
  var slidesWrap = document.querySelector('.slides');
  if (slidesWrap) {
    var slides = Array.prototype.slice.call(slidesWrap.querySelectorAll('.slide'));
    var dotsWrap = document.querySelector('.slider-dots');
    var prevBtn = document.querySelector('[data-slide="prev"]');
    var nextBtn = document.querySelector('[data-slide="next"]');
    var current = 0;
    var timer = null;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      if (dotsWrap) {
        Array.prototype.slice.call(dotsWrap.children).forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      render();
      restart();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    if (slides.length) {
      render();
      restart();
    }
  }

  /* ---------- Generic filter tabs (terms / clubs / players) ---------- */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('button'));
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-filter');

        items.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          var show = target === 'all' || cat === target;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Picture gallery lightbox ---------- */
  var gallery = document.querySelector('.gallery');
  var lightbox = document.querySelector('.lightbox');
  if (gallery && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    gallery.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var full = link.getAttribute('href');
        var alt = link.querySelector('img') ? link.querySelector('img').alt : '';
        lightboxImg.setAttribute('src', full);
        lightboxImg.setAttribute('alt', alt);
        lightbox.classList.add('open');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.setAttribute('src', '');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
