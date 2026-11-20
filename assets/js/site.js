// 1) Light/dark toggle. The page starts in the reader's system setting;
//    clicking the button switches and remembers the choice in this browser.
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// 2) Underline the menu item for the section currently on screen.
//    Works for any <section id="..."> that has a matching <a href="#...">.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if (!sections.length) return;

  function update() {
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    // at the very bottom of the page, highlight the last section
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + current.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// 3) English / Spanish pages.
//    English page: index.html.  Spanish page: es/index.html.
//    - The EN/ES button is a link to the other page; it keeps you in the same section.
//    - The Spanish page loads the publication list from the English page and
//      translates the small words, so papers are only edited in index.html.
//    - On the Spanish page, "cv" links use assets/pdf/CV-es.pdf once that file exists.
(function () {
  // EN/ES link: jump to the section currently on screen
  var langLink = document.querySelector('.lang-toggle');
  if (langLink) langLink.addEventListener('click', function () {
    var cur = document.querySelector('.site-nav a[aria-current]');
    var hash = cur ? cur.getAttribute('href') : '';
    if (hash === '#about') hash = '';
    langLink.setAttribute('href', langLink.getAttribute('href').split('#')[0] + hash);
  });

  if (document.documentElement.getAttribute('lang') !== 'es') return;

  // words swapped in the publication list (coauthor part only; titles and journals untouched)
  var STATUS_ES = { 'Submitted': 'Enviado', 'To appear': 'Por aparecer', 'In preparation': 'En preparación' };
  var HEADINGS_ES = { 'Preprints': 'Preprints', 'Published': 'Publicados' };

  function translate(root) {
    root.querySelectorAll('.pub-meta').forEach(function (m) {
      var t = m.firstChild;
      if (t && t.nodeType === 3) {
        var cut = t.nodeValue.indexOf('·');
        var head = cut < 0 ? t.nodeValue : t.nodeValue.slice(0, cut);
        var tail = cut < 0 ? '' : t.nodeValue.slice(cut);
        t.nodeValue = head.replace(/^(\s*)with /, '$1con ').replace(/,? and /, ' y ') + tail;
      }
      m.querySelectorAll('em').forEach(function (e) {
        if (STATUS_ES[e.textContent]) e.textContent = STATUS_ES[e.textContent];
      });
    });
    root.querySelectorAll('.pub-links a').forEach(function (a) {
      if (a.textContent === 'journal') a.textContent = 'revista';
    });
    root.querySelectorAll('.pub-section').forEach(function (h) {
      if (HEADINGS_ES[h.textContent]) h.textContent = HEADINGS_ES[h.textContent];
    });
    root.querySelectorAll('.note').forEach(function (n) {
      n.textContent = n.textContent.replace('undergraduate collaborator', 'colaborador(a) de licenciatura');
    });
  }

  var box = document.getElementById('pubs-from-en');
  if (box && window.fetch) {
    fetch('../index.html').then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var src = doc.getElementById('publications');
      if (!src) return;
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(src.children, function (el) {
        if (!el.classList.contains('section-title')) frag.appendChild(document.importNode(el, true));
      });
      translate(frag);
      box.innerHTML = '';
      box.appendChild(frag);
      window.dispatchEvent(new Event('resize'));   // refresh menu highlighting
      if (location.hash === '#publications') document.getElementById('publications').scrollIntoView();
    }).catch(function () {});
  }

  var cvLinks = document.querySelectorAll('.cv-link');
  if (cvLinks.length && window.fetch) {
    var cvEs = cvLinks[0].getAttribute('href').replace(/CV\.pdf$/, 'CV-es.pdf');
    fetch(cvEs, { method: 'HEAD' }).then(function (r) {
      if (r.ok) cvLinks.forEach(function (a) { a.setAttribute('href', cvEs); });
    }).catch(function () {});
  }
})();
