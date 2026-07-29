// Interactivity and Scroll Effects for Madhukar's Portfolio

document.addEventListener('DOMContentLoaded', () => {
  initGridNavigation();
  initActiveSectionTracker();
  initScrollReveal();
  initScrollToTop();
});

/**
 * Grid Navigation: Map colored grid blocks to page sections
 * Clicking a block smooth-scrolls the user to the corresponding section.
 */
function initGridNavigation() {
  const blocks = document.querySelectorAll('.grid-block');
  
  // Mapping blocks by their grid position classes to target section IDs
  const positionMapping = {
    // Row 1
    'pos-1-4': 'skills',      // Yellow block -> Skills
    'pos-1-5': 'projects',    // Blue block -> Projects
    
    // Row 2
    'pos-2-1': 'about',       // Red block -> About
    'pos-2-2': 'skills',      // Yellow block -> Skills
    'pos-2-3': 'projects',    // Blue block -> Projects
    'pos-2-4': 'experience',  // Green block -> Experience
    'pos-2-5': 'about',       // Red block -> About
    
    // Row 3
    'pos-3-2': 'experience',  // Green block -> Experience
    'pos-3-3': 'about',       // Red block -> About
    'pos-3-4': 'education',   // Yellow block -> Education
    'pos-3-5': 'hobbies'      // Blue block -> Hobbies
  };

  blocks.forEach(block => {
    // Find the position class of the block
    let targetSectionId = null;
    for (const className of block.classList) {
      if (positionMapping[className]) {
        targetSectionId = positionMapping[className];
        break;
      }
    }
    
    if (targetSectionId) {
      // Add visual title/indicator on hover
      block.setAttribute('title', `Go to ${capitalizeFirstLetter(targetSectionId)}`);
      
      block.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

/**
 * Active Section Tracker: Detect current section on screen
 * Highlights side dot navigation and changes its active class/color.
 */
function initActiveSectionTracker() {
  const sections = document.querySelectorAll('section');
  const navDots = document.querySelectorAll('.nav-dot');
  
  // Section color mapping for side dots
  const sectionColors = {
    'hero': 'active',
    'about': 'active-red',
    'skills': 'active-yellow',
    'projects': 'active-blue',
    'certifications': 'active-red',
    'experience': 'active-green',
    'education': 'active-yellow',
    'hobbies': 'active-blue'
  };

  // Modern IntersectionObserver approach
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies mid-screen
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          updateActiveDot(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback scroll listener for older browsers
    window.addEventListener('scroll', () => {
      let currentSection = 'hero';
      const scrollPosition = window.scrollY + 200;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSection = section.getAttribute('id');
        }
      });

      updateActiveDot(currentSection);
    });
  }

  function updateActiveDot(activeSectionId) {
    navDots.forEach(dot => {
      dot.className = 'nav-dot'; // Reset classes
      
      if (dot.getAttribute('data-section') === activeSectionId) {
        dot.classList.add('active');
        
        // Add color-specific active styling
        const colorClass = sectionColors[activeSectionId] || 'active';
        if (colorClass !== 'active') {
          dot.classList.add(colorClass);
        }
      }
    });
  }
}

/**
 * Scroll Reveal: Add class to elements when they are scrolled into view
 */
function initScrollReveal() {
  // Elements to reveal
  const revealTargets = [
    '.about-large-text', '.about-details p',
    '.skill-card', '.project-card', '.certification-card',
    '.timeline-item', '.hobby-card'
  ];

  // Set initial hidden styles dynamically (improves page load if JS disabled)
  const elements = document.querySelectorAll(revealTargets.join(', '));
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el); // Only animate once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before it enters the viewport fully
      threshold: 0.05
    });

    elements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: Reveal instantly if no observer is supported
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

/**
 * Scroll to Top: Reveal a fixed control after the hero and return smoothly.
 */
function initScrollToTop() {
  const button = document.querySelector('.scroll-to-top');
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();

  button.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

// Helper utility
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
