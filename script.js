document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Set Current Year in Footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
        });
    });

    // --- 3. Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });

    // --- 4. JS Smooth Scroll Fallback & Header Offset ---
    const headerOffset = document.getElementById('site-header').offsetHeight;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 6. Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 7. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 400); // Matches CSS transition duration
                }
            });
        });
    });

    // --- 8. Testimonials Carousel ---
    const track = document.getElementById('testimonial-track');
    const cards = Array.from(track.children);
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    const dotsNav = document.getElementById('carousel-dots');
    
    let currentIndex = 0;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dotsNav.appendChild(dot);
    });
    
    const dots = Array.from(dotsNav.children);

    const updateCarousel = (index) => {
        // Simple logic: shift by 100% of one card width + gap
        // For responsive design, we calculate actual width dynamically
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 32; // 2rem gap
        track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
        
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
        updateCarousel(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
        updateCarousel(currentIndex);
    });

    dotsNav.addEventListener('click', e => {
        if (!e.target.closest('.dot')) return;
        currentIndex = parseInt(e.target.dataset.index);
        updateCarousel(currentIndex);
    });

    // Auto-play interval
    let carouselInterval = setInterval(() => {
        nextBtn.click();
    }, 5000);

    // Pause on hover
    document.querySelector('.carousel-container').addEventListener('mouseenter', () => clearInterval(carouselInterval));
    document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => nextBtn.click(), 5000);
    });

    // Handle Resize to fix track offset
    window.addEventListener('resize', () => updateCarousel(currentIndex));


    // --- 9. Contact Form Validation ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const group = input.parentElement;
            if (!input.value.trim()) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }

            // Simple Email Regex check
            if (input.type === 'email' && input.value.trim()) {
                const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRe.test(input.value.trim())) {
                    group.classList.add('error');
                    isValid = false;
                }
            }
        });

        if (isValid) {
            // Simulate form submission
            const btnText = form.querySelector('.submit-btn .btn-text');
            btnText.textContent = 'Sending...';
            
            setTimeout(() => {
                form.reset();
                btnText.textContent = 'Send Message';
                formStatus.textContent = "Thank you! Your message has been sent successfully.";
                formStatus.className = 'form-status success';
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        }
    });

    // Remove error class on input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('error');
        });
    });
});