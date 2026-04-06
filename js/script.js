// ======================== NAV ========================
const nav = document.getElementById('mainNav');
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const mobileLinks = document.querySelectorAll('.nav__mobile-link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobile.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobile.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: .4 });
sections.forEach(s => io.observe(s));

// ======================== SCROLL TO TOP ========================
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ======================== SMOOTH SCROLL ========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ======================== REVEAL ON SCROLL ========================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ======================== PARALLAX HERO ========================
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      heroBg.style.transform = `translateY(${y * 0.35}px)`;
    }
  }, { passive: true });
}

// ======================== COUNTER ANIMATION ========================
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const dur = 2000;
      const step = target / (dur / 16);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur).toLocaleString('pt-BR') + '+';
        if (cur >= target) clearInterval(timer);
      }, 16);
    });
    counterObs.unobserve(entry.target);
  });
}, { threshold: .5 });
const statsEl = document.querySelector('.about__stats');
if (statsEl) counterObs.observe(statsEl);

// ======================== SERVICES GALLERY ========================
(function () {

  const SERVICES = [
    {
      tag:     'Serviço Premium',
      title:   'Corte <span>Premium</span> ',
      desc:    'Corte personalizado com lavagem especial e finalização com produtos de alto padrão. Cada detalhe pensado para o seu estilo.',
      price:   '60',
      badge:   null,
      link:    'https://wa.me/5547991597258?text=Olá!%20Gostaria%20de%20agendar%20um%20Corte%20Premium.',
    },
    {
      tag:     'Serviço Premium',
      title:   'Barba <span>Terapia</span>',
      desc:    'Toalha quente, esfoliação, navalha afiada e hidratação profunda. Um ritual completo de cuidado e relaxamento.',
      price:   '50',
      badge:   null,
      link:    'https://wa.me/5547991597258?text=Olá!%20Gostaria%20de%20agendar%20uma%20Barba%20Terapia.',
    },
    {
      tag:     'Experiência Completa',
      title:   'Nosso <span>Combo</span>',
      desc:    'A experiência total. Corte e barba com todos os cuidados que você merece em uma única sessão premium.',
      price:   '100',
      badge:   'Mais Popular',
      link:    'https://wa.me/5547991597258?text=Olá!%20Gostaria%20de%20agendar%20o%20Combo%20Completo.',
    },
    {
      tag:     'Tratamento',
      title:   'Camuflagem<br><span>de Brancos</span>',
      desc:    'Redução natural dos fios brancos com técnica precisa para um visual mais jovem, moderno e discreto.',
      price:   '45',
      badge:   null,
      link:    'https://wa.me/5547991597258?text=Olá!%20Gostaria%20de%20agendar%20Camuflagem%20de%20Brancos.',
    },
  ];

  const content   = document.getElementById('svcContent');
  const indexEl   = document.getElementById('svcIndex');
  const countEl   = document.getElementById('svcCount');
  const prevBtn   = document.getElementById('svcPrev');
  const nextBtn   = document.getElementById('svcNext');
  const bar       = document.getElementById('svcProgressBar');
  const images    = document.querySelectorAll('.svc-img');
  const gallery   = document.getElementById('svcSlider');

  if (!content || !gallery) return;

  let current = 0;
  let isAnim  = false;
  const total = SERVICES.length;

  // ── Índice lateral ──
  SERVICES.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'svc-idx-item' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Ver ${s.tag}`);
    btn.innerHTML = `
      <span class="svc-idx-item__label">${s.tag}</span>
      <span class="svc-idx-item__line"></span>
    `;
    btn.addEventListener('click', () => goTo(i));
    indexEl.appendChild(btn);
  });

  // ── Renderiza conteúdo ──
  function renderContent(i, animate) {
    const s = SERVICES[i];
    content.innerHTML = `
      <p class="svc-content__tag">
        ${s.tag}
        ${s.badge ? `<span class="svc-content__badge">${s.badge}</span>` : ''}
      </p>
      <h2 class="svc-content__title" id="services-title">${s.title}</h2>
      <p class="svc-content__desc">${s.desc}</p>
      <div class="svc-content__footer">
        <span class="svc-content__price"><sup>R$</sup>${s.price}</span>
        <a href="${s.link}" class="svc-content__link"
           target="_blank" rel="noopener noreferrer"
           aria-label="Agendar ${s.tag} pelo WhatsApp">
          Agendar <i class="bi bi-whatsapp"></i>
        </a>
      </div>
    `;
    if (animate) {
      content.classList.remove('is-entering');
      void content.offsetWidth;
      content.classList.add('is-entering');
    }
  }

  // ── Atualiza estado ──
  function updateState() {
    // Imagens: fade
    images.forEach((img, i) => img.classList.toggle('active', i === current));

    // Índice
    indexEl.querySelectorAll('.svc-idx-item').forEach((el, i) =>
      el.classList.toggle('active', i === current)
    );

    // Contador
    const pad = n => String(n + 1).padStart(2, '0');
    countEl.textContent = `${pad(current)} / ${pad(total - 1)}`;

    // Barra de progresso
    bar.style.width = `${((current + 1) / total) * 100}%`;
  }

  function goTo(index, animate = true) {
    if (isAnim || index === current) return;
    isAnim = true;
    current = (index + total) % total;
    updateState();
    renderContent(current, animate);
    setTimeout(() => { isAnim = false; }, 950);
  }

  // ── Init ──
  renderContent(0, false);
  updateState();

  // ── Botões ──
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // ── Teclado ──
  document.addEventListener('keydown', e => {
    const rect = gallery.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft')  goTo(current - 1);
  });

  // ── Touch / Swipe ──
  let touchX = 0, touchY = 0, dragging = false;

  gallery.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  gallery.addEventListener('touchend', e => {
    if (!dragging) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }
    dragging = false;
  }, { passive: true });

  // ── Mouse drag (desktop) ──
  let mouseX = 0, mouseDown = false;
  gallery.addEventListener('mousedown', e => {
    mouseX = e.clientX;
    mouseDown = true;
    gallery.classList.add('is-dragging');
  });
  window.addEventListener('mouseup', e => {
    if (!mouseDown) return;
    const dx = e.clientX - mouseX;
    if (Math.abs(dx) > 60) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    mouseDown = false;
    gallery.classList.remove('is-dragging');
  });
  gallery.addEventListener('mousemove', e => { if (mouseDown) e.preventDefault(); });

  // ── Autoplay ──
  let autoTimer = setInterval(() => goTo(current + 1), 6000);
  gallery.addEventListener('mouseenter', () => clearInterval(autoTimer));
  gallery.addEventListener('mouseleave', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  });

})();