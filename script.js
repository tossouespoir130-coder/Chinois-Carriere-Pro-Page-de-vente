/**
 * ==========================================================================
 * CHINOIS CARRIÈRE PRO — INTERACTIONS & LOGIQUE JS
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initCarousel();
  initAccordion();
  initModal();
  initHeaderScroll();
  initCurrentYear();
  initVideo();
  initIncludes();
  initAnchors();
  initStickyCta();
});

/* ==================== 1. TICKER DYNAMIQUE (3.2s) ==================== */
function initTicker() {
  const tickerItems = [
    { icon: '🚀', text: 'Multiplie tes opportunités professionnelles par 5' },
    { icon: '🏭', text: 'Négocie directement avec les usines chinoises sans intermédiaire' },
    { icon: '💼', text: 'Débloque des promotions et des postes stratégiques' },
    { icon: '⚡', text: 'Méthode accélérée : seulement 20 à 30 min par jour' },
    { icon: '🤝', text: 'Mentorat direct & communauté active avec Espoir Chinois' }
  ];

  const iconEl = document.getElementById('ticker-icon');
  const textEl = document.getElementById('ticker-text');
  if (!iconEl || !textEl) return;

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % tickerItems.length;
    
    // Animation de transition
    textEl.style.opacity = '0';
    iconEl.style.opacity = '0';
    textEl.style.transform = 'translateY(4px)';

    setTimeout(() => {
      iconEl.textContent = tickerItems[currentIndex].icon;
      textEl.textContent = tickerItems[currentIndex].text;
      textEl.style.opacity = '1';
      iconEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 200);

  }, 3200);
}

/* ==================== 2. CARROUSEL ÉDUCATIF (20s + Pause au survol) ==================== */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const container = document.getElementById('edu-carousel');
  const progressBar = document.getElementById('timer-progress');

  if (!slides.length) return;

  let currentSlide = 0;
  const slideDuration = 20000; // 20 secondes
  let slideInterval = null;
  let progressInterval = null;
  let progressValue = 0;
  let isPaused = false;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    resetTimer();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startTimer() {
    progressValue = 0;
    if (progressBar) progressBar.style.width = '0%';

    clearInterval(progressInterval);
    clearInterval(slideInterval);

    const stepMs = 100;
    const increment = (stepMs / slideDuration) * 100;

    progressInterval = setInterval(() => {
      if (!isPaused) {
        progressValue += increment;
        if (progressBar) progressBar.style.width = `${Math.min(progressValue, 100)}%`;
      }
    }, stepMs);

    slideInterval = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, slideDuration);
  }

  function resetTimer() {
    startTimer();
  }

  // Événements boutons et dots
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.dataset.dot, 10);
      goToSlide(targetIndex);
    });
  });

  // Pause au survol de la souris
  if (container) {
    container.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    container.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }

  // Démarrage initial
  startTimer();
}

/* ==================== 3. ACCORDÉON FAQ ==================== */
function initAccordion() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      // Ferme tous les autres éléments ouverts
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle l'élément cliqué
      if (isOpen) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==================== 4. MODALE WHATSAPP ==================== */
function initModal() {
  const modal = document.getElementById('whatsapp-modal');
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const closeButton = document.getElementById('modal-close');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  // Fermeture en cliquant sur l'overlay extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Fermeture avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==================== 5. GESTION DE LA SOUMISSION DU FORMULAIRE ==================== */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('submit-btn');
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();

  if (!name || !phone || !email) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  // Animation de chargement
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Redirection vers WhatsApp en cours...</span>';

  // Simulation d'envoi et redirection vers WhatsApp
  setTimeout(() => {
    const whatsappMessage = encodeURIComponent(`Bonjour Espoir Chinois ! Je m'appelle ${name} (${email}). Je souhaite rejoindre la Masterclass Chinois Carrière Pro.`);
    // Numéro de redirection officiel
    const targetUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;
    
    window.open(targetUrl, '_blank');
    
    // Message de confirmation sur le formulaire
    form.innerHTML = `
      <div style="text-align:center; padding: 20px 0;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h4 style="font-size: 1.3rem; color: #1e3a8a; margin-bottom: 8px;">Félicitations ${name} !</h4>
        <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">
          Votre inscription est validée. Si la redirection WhatsApp ne s'est pas lancée automatiquement, 
          <a href="${targetUrl}" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">cliquez ici pour entrer dans le groupe</a>.
        </p>
      </div>
    `;
  }, 900);
}

/* ==================== 6. EFFET HEADER AU SCROLL ==================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==================== 7. MISE À JOUR DE L'ANNÉE DU FOOTER ==================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==================== 8. VIDÉO YOUTUBE (FAÇADE CLIQUABLE) ==================== */
/* La façade (miniature + bouton bleu) cède la place à l'iframe au premier
   clic. Rien n'est chargé depuis YouTube avant ce clic. */
function initVideo() {
  const facade = document.querySelector('.video-facade');
  if (!facade) return;

  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.className = 'video-embed';
    // URL et attributs repris de l'oEmbed officiel de YouTube : playsinline
    // évite le passage en plein écran forcé sur iOS.
    iframe.src = 'https://www.youtube.com/embed/' + facade.dataset.videoId +
                 '?autoplay=1&rel=0&playsinline=1';
    iframe.title = 'Chinois Carrière Pro';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                   'gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });
}

/* ==================== 9. ANIMATION DES ÉLÉMENTS DE L'OFFRE ==================== */
/* La classe .in-view est posée à l'entrée dans l'écran et retirée à la sortie,
   pour que l'animation se rejoue à chaque passage. Sans IntersectionObserver
   la coche reste simplement affichée, dessinée. */
function initIncludes() {
  const items = document.querySelectorAll('.include-item');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.35 });

  items.forEach((item) => observer.observe(item));
}

/* ==================== 10. ANCRES INTERNES ==================== */
/* Les liens « Je m'inscris » défilent jusqu'aux tarifs sans inscrire #tarifs
   dans l'URL. Sans cela, l'ancre restait dans la barre d'adresse : un
   rechargement, un partage du lien ou un retour sur la page faisait
   atterrir le visiteur sur les prix au lieu de la bannière. */
function initAnchors() {
  const liens = document.querySelectorAll('a[href^="#"]');
  if (!liens.length) return;

  // Arrivée avec une ancre héritée d'un ancien lien : on repart du haut.
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  const sansAnimation = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  liens.forEach((lien) => {
    const href = lien.getAttribute('href');
    if (href === '#') return;

    lien.addEventListener('click', (event) => {
      const cible = document.querySelector(href);
      if (!cible) return; // ancre morte : on laisse le navigateur faire
      event.preventDefault();
      cible.scrollIntoView({ behavior: sansAnimation ? 'auto' : 'smooth' });
    });
  });
}

/* ==================== 11. BARRE D'INSCRIPTION ESCAMOTABLE ==================== */
/* Sur mobile la barre est masquée par défaut (voir vente.css) et n'apparaît
   qu'une fois le bouton de l'accroche dépassé, pour ne pas afficher deux
   fois le même appel à l'action. Sur ordinateur la règle CSS ne s'applique
   pas : la barre y reste visible en permanence, la classe est sans effet. */
function initStickyCta() {
  const barre = document.querySelector('.sticky-cta');
  const repere = document.querySelector('.hero-cta-group');
  if (!barre || !repere) return;

  // Sans IntersectionObserver, on affiche la barre plutôt que de la perdre.
  if (!('IntersectionObserver' in window)) {
    barre.classList.add('is-visible');
    return;
  }

  const observateur = new IntersectionObserver((entrees) => {
    const e = entrees[0];
    // Visible seulement une fois le repère dépassé vers le haut.
    barre.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
  }, { threshold: 0 });

  observateur.observe(repere);
}
