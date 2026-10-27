/* Eduardo Fenos | Presença Digital — interações do site */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('menu');
  var toggle = document.querySelector('.nav-toggle');
  var waFloat = document.querySelector('.wa-float');
  var hero = document.getElementById('inicio');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ano atual no rodapé */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* Cabeçalho com fundo após rolar */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var mobileQuery = window.matchMedia('(max-width: 960px)');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    }
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') && mobileQuery.matches) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* Mantém o foco dentro do menu aberto */
  nav.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab' || !nav.classList.contains('is-open')) return;
    var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll('a')));
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === nav.querySelector('a')) {
      event.preventDefault();
      first.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileQuery.addEventListener('change', function (event) {
    if (!event.matches) setMenu(false);
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-checklist] li').forEach(function (li) { li.classList.add('is-done'); });
    if (waFloat) waFloat.classList.add('is-visible');
    return;
  }

  /* Revelação suave das seções */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Checklist do Perfil da Empresa (hero) */
  var checklist = document.querySelectorAll('[data-checklist] li');
  checklist.forEach(function (li, i) {
    if (reduceMotion) {
      li.classList.add('is-done');
    } else {
      setTimeout(function () { li.classList.add('is-done'); }, 1700 + i * 380);
    }
  });

  /* Botão flutuante aparece depois da primeira dobra */
  if (waFloat && hero) {
    new IntersectionObserver(function (entries) {
      waFloat.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(hero);
  }

  /* Link ativo na navegação conforme a seção visível */
  var links = {};
  nav.querySelectorAll('.nav__link').forEach(function (link) {
    links[link.getAttribute('href').slice(1)] = link;
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.keys(links).forEach(function (id) { links[id].classList.remove('is-active'); });
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
})();
