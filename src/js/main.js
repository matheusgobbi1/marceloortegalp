document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll("input");

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (isValid) {
        const formData = new FormData(form);
        const formValues = {};

        for (const [key, value] of formData.entries()) {
          formValues[key] = value;
        }

        console.log("Form submitted:", formValues);

        form.reset();

        alert("Formulário enviado com sucesso!");
      }
    });
  }
  
  setupSmoothScrolling();
});

function setupSmoothScrolling() {
 
  const heroLinkBtn = document.querySelector('.companies-section .cta-container a[href="#hero"]');
  
  if (heroLinkBtn) {
    heroLinkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        const duration = 1200;
        let startTime = null;
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const scrollY = easeInOutCubic(timeElapsed, startPosition, distance, duration);
          
          window.scrollTo(0, scrollY);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
        
        function easeInOutCubic(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        }
        
        // Iniciar animação
        requestAnimationFrame(animation);
      }
    });
  }
}

function carregarComponentes() {
  const componentes = [
    { id: 'hero-component', path: 'sections/hero/index.html' },
    { id: 'lectures-component', path: 'sections/lectures/index.html' },
    { id: 'palestras-info-component', path: 'sections/palestras-info/index.html' },
    { id: 'companies-component', path: 'sections/companies/index.html' },
    { id: 'footer-component', path: 'sections/footer/index.html' }
  ];

  const sliderJaExiste = document.querySelector('.companies-track') !== null;
  let componentesCarregados = 0;
  const totalComponentes = componentes.length;

  componentes.forEach(componente => {
    const elemento = document.getElementById(componente.id);
    if (elemento) {
  
      if (componente.id === 'companies-component' && sliderJaExiste) {
        initCompaniesSlider();
        componentesCarregados++;
        return;
      }

      fetch(componente.path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro ao carregar ${componente.path}: ${response.status}`);
          }
          return response.text();
        })
        .then(html => {
          if (!elemento.querySelector(`.${componente.id.replace('-component', '-section')}`)) {
            elemento.innerHTML = html;
          }
          
          componentesCarregados++;
          
          if (componentesCarregados === totalComponentes) {
            if (document.querySelector('.companies-track')) {
              initCompaniesSlider();
            }
          }
        })
        .catch(error => {
          console.error(`Erro ao carregar componente: ${error}`);
          componentesCarregados++;
          

          if (componentesCarregados === totalComponentes && document.querySelector('.companies-track')) {
            initCompaniesSlider();
          }
        });
    }
  });
  
  if (sliderJaExiste) {
    initCompaniesSlider();
  }
}

function initCompaniesSlider() {
  const sliderTrack = document.querySelector('.companies-track');
  const slides = document.querySelectorAll('.company-slide');

  if (!sliderTrack || slides.length === 0 || sliderTrack.dataset.initialized === 'true') {
    return;
  }
  
  sliderTrack.dataset.initialized = 'true';
  
  console.log('Inicializando slider de empresas...');

  let currentIndex = 0;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID = 0;
  let slideWidth = 0;
  let autoplayInterval;

  function setupInfiniteSlider() {
    if (sliderTrack.querySelectorAll('.company-slide').length > slides.length) {
      console.log('Slides já foram clonados, pulando clonagem.');
      updateSlideWidth();
      startAutoplay();
      return;
    }
    
    console.log('Configurando slider infinito...');
    
    const slidesToClone = slides.length;

    for (let i = slidesToClone - 1; i >= 0; i--) {
      const clone = slides[i].cloneNode(true);
      sliderTrack.insertBefore(clone, sliderTrack.firstChild);
    }
    
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < slidesToClone; i++) {
        const clone = slides[i].cloneNode(true);
        sliderTrack.appendChild(clone);
      }
    }
    
    currentIndex = slidesToClone;

    updateSlideWidth();

    startAutoplay();
  }
  
  function updateSlideWidth() {
    const allSlides = document.querySelectorAll('.company-slide');
    slideWidth = allSlides[0].offsetWidth;
    
    setSliderPosition();
    
    console.log(`Slide width atualizado: ${slideWidth}px, currentIndex: ${currentIndex}`);
  }
  
  function setSliderPosition() {
    sliderTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  }
  
  function startAutoplay() {
    stopAutoplay(); 
    
    let lastTimestamp = 0;
    const speed = 0.05;
    
    function moveSlider(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      currentIndex += (elapsed * speed) / slideWidth;
     
      const allSlides = document.querySelectorAll('.company-slide');
      const totalSlides = allSlides.length;
      const originalSlidesCount = slides.length;
      if (currentIndex >= totalSlides - originalSlidesCount / 2) {
        currentIndex = originalSlidesCount;
        console.log("Loop reiniciado para o início");
      }
      
      setSliderPosition();
      
      animationID = requestAnimationFrame(moveSlider);
    }
    
    animationID = requestAnimationFrame(moveSlider);
  }

  function stopAutoplay() {
    if (animationID) {
      cancelAnimationFrame(animationID);
    }
  }
  
  function touchStart(event) {
    stopAutoplay();
    
    startPos = getPositionX(event);
    isDragging = true;
    prevTranslate = currentIndex * slideWidth;
   
    sliderTrack.style.transition = 'none';
    
    window.requestAnimationFrame(animation);
  }
  
  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate - (currentPosition - startPos);
      currentIndex = currentTranslate / slideWidth;
    }
  }
  
  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
   
    const allSlides = document.querySelectorAll('.company-slide');
    const totalSlides = allSlides.length;
    const originalSlidesCount = slides.length;
    
    if (currentIndex < originalSlidesCount / 2) {
      currentIndex = totalSlides - originalSlidesCount - originalSlidesCount / 2;
      setSliderPosition();
    }

    else if (currentIndex > totalSlides - originalSlidesCount - originalSlidesCount / 2) {
      currentIndex = originalSlidesCount;
      setSliderPosition();
    }
    

    startAutoplay();
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  function animation() {
    if (isDragging) {
      setPositionByDrag();
      animationID = window.requestAnimationFrame(animation);
    }
  }
  
  function setPositionByDrag() {
    sliderTrack.style.transform = `translateX(${-currentTranslate}px)`;
  }
  
  sliderTrack.addEventListener('mousedown', touchStart);
  sliderTrack.addEventListener('touchstart', touchStart);
  
  sliderTrack.addEventListener('mousemove', touchMove);
  sliderTrack.addEventListener('touchmove', touchMove);
  
  sliderTrack.addEventListener('mouseup', touchEnd);
  sliderTrack.addEventListener('touchend', touchEnd);
  sliderTrack.addEventListener('mouseleave', touchEnd);

  window.addEventListener('resize', () => {
    updateSlideWidth();
  });
  
  sliderTrack.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
  
  setupInfiniteSlider();
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, inicializando componentes...');
  carregarComponentes();
});
