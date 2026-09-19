document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animating
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => scrollObserver.observe(el));

    // Stagger children
    const staggerContainers = document.querySelectorAll('.stagger-children');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // 4. Smooth scroll
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Animated counter
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            current = Math.floor(easeProgress * target);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // 6. Parallax effect
    const hero = document.querySelector('.hero');
    const heroOrbs = document.querySelectorAll('.hero-orb');

    if (hero && heroOrbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            heroOrbs.forEach(orb => {
                const speed = orb.getAttribute('data-speed') || 20;
                const xOffset = (window.innerWidth / 2 - e.pageX) * speed / 1000;
                const yOffset = (window.innerHeight / 2 - e.pageY) * speed / 1000;

                // Max movement 20px
                const clampedX = Math.max(-20, Math.min(20, xOffset));
                const clampedY = Math.max(-20, Math.min(20, yOffset));

                orb.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
            });
        });
    }

    // 7. Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);

    // 8. Testimonial auto-rotation
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        
        setInterval(() => {
            testimonials[currentTestimonial].classList.remove('active');
            testimonials[currentTestimonial].style.opacity = '0';
            
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            
            testimonials[currentTestimonial].classList.add('active');
            testimonials[currentTestimonial].style.opacity = '1';
        }, 5000);
    }

    // 9. Typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = ['More Views.', 'More Leads.', 'More Sales.'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing new phrase
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing
        setTimeout(type, 1000);
    }

    // 10. River particle animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 50;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 + 0.5; // Move right
                this.speedY = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.amplitude = Math.random() * 0.5 + 0.1; // Wave amplitude
                this.baseY = this.y;
                
                // Palette: #81A8BA (Stream Teal/Blue) & #D1AB9B (Sand Rose) with soft opacity
                const isTeal = Math.random() > 0.3;
                if (isTeal) {
                    // #81A8BA -> rgb(129, 168, 186)
                    const opacity = Math.random() * 0.4 + 0.15;
                    this.color = `rgba(129, 168, 186, ${opacity})`;
                } else {
                    // #D1AB9B -> rgb(209, 171, 155)
                    const opacity = Math.random() * 0.3 + 0.15;
                    this.color = `rgba(209, 171, 155, ${opacity})`;
                }
            }

            update() {
                this.x += this.speedX;
                this.angle += 0.05;
                this.y = this.baseY + Math.sin(this.angle) * this.amplitude * 20;

                if (this.x > canvas.width) {
                    this.x = -10;
                    this.baseY = Math.random() * canvas.height;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 11. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all other FAQs
            faqItems.forEach(other => other.classList.remove('active'));
            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // 12. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.removeAttribute('data-visible');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-visible', 'false');
                }
            });
        });
    });

    // 13. Contact Form Validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let valid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--c-sand)';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            if (valid) {
                alert('Thank you! We\'ll be in touch within one business day.');
                contactForm.reset();
            }
        });
    }
});
