/**
 * Connectedu Premium SaaS Website JS Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initCardGlows();
    initStatsCounters();
    initTestimonialsCarousel();
    initScrollspy();
    initCalendly();
    initContactModal();
});

/**
 * 1. Sticky Navigation Header
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case of refresh
}

/**
 * 2. Mobile Menu Navigation Hamburger
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        
        // Animated hamburger state
        const spans = toggle.querySelectorAll('span');
        if (menu.classList.contains('active')) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking links
    const links = menu.querySelectorAll('.nav-link, .btn');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * 3. Modern Scroll Reveal via Intersection Observer
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target); // Reveal once
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without observer
        reveals.forEach(el => el.classList.add('active'));
    }
}

/**
 * 4. Cursor Hover Radial Glow Effect for Glass Cards
 */
function initCardGlows() {
    const cards = document.querySelectorAll('.glow-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * 5. Trust & Credibility Animated Statistics Counter
 */
function initStatsCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const runCounter = (el) => {
        const targetStr = el.getAttribute('data-target');
        const isPlus = targetStr.includes('+');
        const target = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // EaseOutQuad function
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * target);

            if (target >= 1000000) {
                el.innerText = `${(currentValue / 1000000).toFixed(1)}M${isPlus ? '+' : ''}`;
            } else if (target >= 1000) {
                el.innerText = `${Math.floor(currentValue / 100) / 10}k${isPlus ? '+' : ''}`;
            } else {
                el.innerText = `${currentValue}${isPlus ? '+' : ''}`;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                el.innerText = targetStr; // Set final text precisely
            }
        };

        requestAnimationFrame(animate);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(el => observer.observe(el));
    } else {
        stats.forEach(el => runCounter(el));
    }
}

/**
 * 6. Premium Testimonial Carousel
 */
function initTestimonialsCarousel() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!slider || slides.length === 0 || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const slideCount = slides.length;

    const updateSlider = () => {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    });

    // Auto rotate every 8 seconds
    let interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }, 8000);

    // Pause rotation on interaction
    const resetInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
        }, 8000);
    };

    nextBtn.addEventListener('click', resetInterval);
    prevBtn.addEventListener('click', resetInterval);
}

/**
 * 7. Video Player Demo Walkthrough Modal
 */
function initVideoModal() {
    const trigger = document.querySelector('.hero-cta-video');
    const modal = document.querySelector('.video-modal');
    const closeBtn = document.querySelector('.video-modal-close');
    const iframe = modal ? modal.querySelector('iframe') : null;

    if (!trigger || !modal || !closeBtn) return;

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scroll
        
        // Start playing mock video if iframe src is not loaded yet
        if (iframe && !iframe.getAttribute('src')) {
            // High premium product demonstration placeholder
            iframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1');
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable page scroll
        if (iframe) {
            // Stop playing video on close
            iframe.setAttribute('src', '');
        }
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * 8. Scrollspy: Highlight active nav link on scroll
 */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScrollspy = () => {
        let currentId = '';
        const scrollPosition = window.scrollY + 120; // Offset for sticky nav

        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.endsWith(`#${currentId}`) && currentId !== '') {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollspy);
    handleScrollspy(); // Run initially
}

/**
 * 9. Calendly integration: Open booking popup on click
 */
function initCalendly() {
    const demoButtons = document.querySelectorAll('.book-demo-btn');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof Calendly !== 'undefined') {
                Calendly.initPopupWidget({ url: 'https://calendly.com/mslabba-turgut/30min' });
            } else {
                // Graceful fallback if Calendly script fails to load (e.g. ad blockers)
                window.open('https://calendly.com/mslabba-turgut/30min', '_blank');
            }
        });
    });
}

/**
 * 10. Contact Sales Modal integration: Open modal form on click
 */
function initContactModal() {
    const trigger = document.querySelector('.contact-sales-btn');
    const modal = document.getElementById('contactSalesModal');
    const closeBtn = modal ? modal.querySelector('.contact-modal-close') : null;
    
    if (!trigger || !modal || !closeBtn) return;

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scroll
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable page scroll
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

