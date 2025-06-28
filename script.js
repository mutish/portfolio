// script.js - Portfolio Website with Anime.js Animations

document.addEventListener('DOMContentLoaded', function () {
  // Text animation for the main heading
  anime.timeline({loop: false})
    .add({
      targets: '.ml6 .letter',
      scale: [0, 1],
      opacity: [0, 1],
      translateZ: 0,
      easing: 'easeOutExpo',
      duration: 1000,
      delay: (el, i) => 70 * (i+1)
    });

  // Split text into spans for animation
  const textWrapper = document.querySelector('.ml6 .letters');
  if (textWrapper) {
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
  }

  // Floating animation for the arrow icon
  anime({
    targets: '.arrow-icon i',
    translateY: [0, -10],
    opacity: [0.6, 1],
    easing: 'easeInOutQuad',
    duration: 1500,
    direction: 'alternate',
    loop: true
  });

  // Image hover effect
  const imageContent = document.querySelector('.image-content');
  if (imageContent) {
    imageContent.addEventListener('mouseenter', () => {
      anime({
        targets: '.hero-image',
        scale: 1.05,
        duration: 500,
        easing: 'easeInOutQuad'
      });
    });

    imageContent.addEventListener('mouseleave', () => {
      anime({
        targets: '.hero-image',
        scale: 1,
        duration: 500,
        easing: 'easeInOutQuad'
      });
    });
  }
  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Animate navigation items on page load
  if (navMenu) {
    anime({
      targets: navMenu.querySelectorAll('li'),
      translateX: [20, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuart'
    });
  }

  navToggle.addEventListener('click', function () {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for anchor links with animation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        
        // Animate scroll
        anime({
          targets: document.documentElement,
          scrollTop: target.offsetTop,
          duration: 1000,
          easing: 'easeInOutQuart'
        });
        
        // Add focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // Keyboard navigation for sections
  document.querySelectorAll('section').forEach(section => {
    section.setAttribute('tabindex', '-1');
  });

  // Dynamic year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Services section scroll animation
  const servicesSection = document.querySelector('.services-section');
  
  const animateOnScroll = () => {
    if (servicesSection) {
      const sectionTop = servicesSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Add 'visible' class when the section is in the viewport
      if (sectionTop < windowHeight - 100) {
        servicesSection.classList.add('visible');
        // Remove the event listener after the animation is triggered
        window.removeEventListener('scroll', animateOnScroll);
      }
    }
  };

  // Initial check in case the section is already in view
  animateOnScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);

  // Animate service cards with a slight delay after the section becomes visible
  if (servicesSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.service-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 200 * index);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(servicesSection);
  }

  // Animate project cards on scroll
  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe each project card
    projectCards.forEach((card, index) => {
      // Add delay based on index for staggered animation
      card.style.transitionDelay = `${index * 100}ms`;
      projectObserver.observe(card);
    });
  }

  // Interactive Roadmap
  const aboutSectionMilestones = document.querySelectorAll('.about-section .milestone');
  const roadmapPerson = document.getElementById('roadmap-person');
  const roadmapRoad = document.querySelector('.about-section .road');

  // 1. Reveal milestones as they enter the viewport
  if (aboutSectionMilestones.length > 0) {
    const milestoneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of the milestone is visible

    aboutSectionMilestones.forEach(milestone => milestoneObserver.observe(milestone));
  }

  // 2. Animate the person character along the path based on scroll position
  function animatePersonOnScroll() {
    if (!roadmapPerson || !roadmapRoad) return;

    const roadRect = roadmapRoad.getBoundingClientRect();
    const personHeight = roadmapPerson.offsetHeight;
    const roadHeight = roadmapRoad.scrollHeight;
    
    // Calculate scroll progress through the 'road' container.
    // Progress is 0 when the top of the road enters the viewport, and 1 when the bottom leaves.
    let progress = (window.innerHeight - roadRect.top) / (window.innerHeight + roadRect.height);
    
    // Clamp progress between 0 and 1 to keep the person within the road
    progress = Math.max(0, Math.min(1, progress));

    // Calculate the new 'top' position for the person
    const newTop = progress * (roadHeight - personHeight);

    // Use anime.js for a smooth, non-blocking animation
    anime({
      targets: roadmapPerson,
      top: `${newTop}px`,
      duration: 100, // Provides a slight smoothing effect
      easing: 'linear'
    });
  }

  // Attach the animation function to the window's scroll event
  window.addEventListener('scroll', animatePersonOnScroll);


  // --- GENERIC SCROLL-IN ANIMATIONS FOR OTHER SECTIONS ---
  const scrollFadeInElements = document.querySelectorAll('.service-card, .project-card');

  if (scrollFadeInElements.length > 0) {
      const scrollObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  observer.unobserve(entry.target); // Unobserve after animation
              }
          });
      }, { threshold: 0.1 });

      scrollFadeInElements.forEach(el => {
          scrollObserver.observe(el);
      });
  }

  
  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formMessage = document.getElementById('form-message');
      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');
      
      // Show loading state
      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';
      btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      
      // Get form data
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // Send email using EmailJS
      emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formValues.name,
          from_email: formValues.email,
          subject: formValues.subject,
          message: formValues.message
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      )
      .then((response) => {
        // Show success message
        formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        formMessage.className = 'form-message success';
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formMessage.textContent = '';
          formMessage.className = 'form-message';
        }, 5000);
      })
      .catch((error) => {
        // Show error message
        console.error('Error sending email:', error);
        formMessage.textContent = 'Failed to send message. Please try again later or email me directly at mutindastacey@gmail.com';
        formMessage.className = 'form-message error';
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
      });
    });
  }
});