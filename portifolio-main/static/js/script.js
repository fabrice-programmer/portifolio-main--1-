/* ==========================================================================
   Portfolio - Enhanced Main JavaScript
   Professional interactive features for Fabrice Niyonsaba's portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================================================
    // 1. Preloader
    // ==========================================================================
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner"></div>
            <p class="preloader-text">Loading<span class="loading-dots"></span></p>
            <div class="preloader-progress">
                <div class="preloader-progress-bar" id="preloaderProgress"></div>
            </div>
        </div>
    `;

    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        #preloader {
            position: fixed;
            inset: 0;
            background: #0a0a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        #preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .preloader-content {
            text-align: center;
        }
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #2a2a4a;
            border-top-color: #6c63ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .preloader-text {
            color: #b0b0d0;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            margin-bottom: 16px;
        }
        .loading-dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
        }
        .preloader-progress {
            width: 200px;
            height: 3px;
            background: #2a2a4a;
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
        }
        .preloader-progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(135deg, #6c63ff, #f5576c);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);

    // Simulate progress
    let progress = 0;
    const progressBar = document.getElementById('preloaderProgress');
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        if (progressBar) progressBar.style.width = progress + '%';
    }, 200);

    window.addEventListener('load', () => {
        clearInterval(progressInterval);
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }, 400);
    });

    // Fallback
    setTimeout(() => {
        clearInterval(progressInterval);
        if (preloader && !preloader.classList.contains('hidden')) {
            if (progressBar) progressBar.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 600);
            }, 300);
        }
    }, 5000);

    // ==========================================================================
    // 2. Custom Cursor
    // ==========================================================================
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const interactiveElements = 'a, button, .btn, .social-link, .project-card, .skill-category, .nav-link, input, textarea, .stat, .timeline-content, .other-projects-list li';

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursorDot.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursorDot.classList.remove('hovering');
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
        cursorDot.style.display = 'none';
    }

    // ==========================================================================
    // 3. Particle Background
    // ==========================================================================
    const particlesCanvas = document.createElement('canvas');
    particlesCanvas.id = 'particles-canvas';
    document.body.prepend(particlesCanvas);

    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 250 : 340; // Purple or pink hue
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }

            if (this.x < 0 || this.x > particlesCanvas.width ||
                this.y < 0 || this.y > particlesCanvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        const count = Math.min(Math.floor((particlesCanvas.width * particlesCanvas.height) / 8000), 80);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (150 - dist) / 150;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    initParticles();
    animateParticles();

    // ==========================================================================
    // 4. Scroll Progress Indicator
    // ==========================================================================
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.prepend(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // ==========================================================================
    // 5. Section Title Underline Reveal
    // ==========================================================================
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-underline');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => titleObserver.observe(title));

    // ==========================================================================
    // 6. Navigation Toggle (Mobile)
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================================================
    // 7. Navbar Scroll Effects
    // ==========================================================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 8. Active Nav Link Highlighting
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);

    // ==========================================================================
    // 9. Animated Counter (Stats)
    // ==========================================================================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                counter.textContent = current + (target > 50 ? '%' : '+');
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (target > 50 ? '%' : '+');
                }
            }
            requestAnimationFrame(updateCounter);
        });
        countersAnimated = true;
    }

    // ==========================================================================
    // 10. Skill Bars Animation
    // ==========================================================================
    const skillFills = document.querySelectorAll('.skill-fill');
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;
        skillFills.forEach(fill => {
            const width = fill.getAttribute('data-width') || '0';
            // Stagger the animation
            const delay = Math.random() * 300;
            setTimeout(() => {
                fill.style.width = width + '%';
            }, delay);
        });
        skillsAnimated = true;
    }

    // ==========================================================================
    // 11. Intersection Observer for Animations
    // ==========================================================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
                if (entry.target.classList.contains('skills-content')) {
                    animateSkillBars();
                }
                const animElements = entry.target.querySelectorAll('.animate-on-scroll');
                animElements.forEach(el => el.classList.add('visible'));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);

    const skillsSection = document.querySelector('.skills-content');
    if (skillsSection) observer.observe(skillsSection);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // ==========================================================================
    // 12. 3D Tilt Effect on Project Cards
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.project-card, .skill-category, .stat');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });

    // ==========================================================================
    // 13. Testimonials Slider with Dots
    // ==========================================================================
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.testimonials-dots .dot');

    if (slider && dots.length > 0) {
        function updateActiveDot() {
            const scrollPosition = slider.scrollLeft;
            const cardWidth = slider.querySelector('.testimonial-card')?.offsetWidth + 30 || 0;

            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                const cardStart = index * cardWidth;
                const cardEnd = cardStart + cardWidth;
                if (scrollPosition >= cardStart - 50 && scrollPosition < cardEnd - 50) {
                    dot.classList.add('active');
                }
            });

            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                dots.forEach(d => d.classList.remove('active'));
                dots[dots.length - 1].classList.add('active');
            }
        }

        slider.addEventListener('scroll', updateActiveDot);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const card = slider.querySelectorAll('.testimonial-card')[index];
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            });
        });
    }

    // ==========================================================================
    // 14. Contact Form - Enhanced with Formspree/API
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim() || 'New Portfolio Message';
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !message) {
                showFormStatus('error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields (Name, Email, Message)');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('error', '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Try Formspree endpoint (free form backend)
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);

            fetch('https://formspree.io/f/xdknrygb', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showFormStatus('success', '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Server responded with an error');
                }
            })
            .catch(() => {
                // Fallback: open mailto
                const mailtoLink = `mailto:fabriceprogrammer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.open(mailtoLink);
                showFormStatus('success', '<i class="fas fa-check-circle"></i> Email client opened! Please send the message from your email.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });

        // Input validation styling
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.style.borderColor = 'rgba(39, 201, 63, 0.3)';
                } else {
                    this.style.borderColor = '';
                }
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = '';
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormStatus(type, message) {
        const existingStatus = contactForm.querySelector('.form-status');
        if (existingStatus) existingStatus.remove();

        const statusDiv = document.createElement('div');
        statusDiv.className = `form-status form-${type}`;
        statusDiv.innerHTML = message;
        contactForm.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.remove();
        }, 6000);
    }

    // ==========================================================================
    // 15. Back to Top Button
    // ==========================================================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 16. Smooth Scroll for Anchor Links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // 17. Newsletter Form
    // ==========================================================================
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const button = newsletterForm.querySelector('button');

            if (input.value && isValidEmail(input.value)) {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = 'linear-gradient(135deg, #27c93f, #50fa7b)';
                const email = input.value;
                input.value = '';

                // Store subscription (simulated)
                try {
                    const subscriptions = JSON.parse(localStorage.getItem('newsletter_subs') || '[]');
                    subscriptions.push({ email, date: new Date().toISOString() });
                    localStorage.setItem('newsletter_subs', JSON.stringify(subscriptions));
                } catch (err) {
                    console.warn('Could not save subscription');
                }

                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-arrow-right"></i>';
                    button.style.background = '';
                }, 3000);
            } else {
                button.innerHTML = '<i class="fas fa-exclamation"></i>';
                button.style.background = 'linear-gradient(135deg, #f5576c, #ff6b6b)';
                input.focus();
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-arrow-right"></i>';
                    button.style.background = '';
                }, 2000);
            }
        });
    }

    // ==========================================================================
    // 18. Profile Photo Upload (Edit & Persist)
    // ==========================================================================
    const editPhotoBtn = document.getElementById('editPhotoBtn');
    const photoInput = document.getElementById('photoInput');
    const profileImage = document.getElementById('profileImage');
    const profilePlaceholder = document.getElementById('profilePlaceholder');

    if (editPhotoBtn && photoInput && profileImage && profilePlaceholder) {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            profileImage.src = savedPhoto;
            profileImage.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        }

        editPhotoBtn.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('Image is too large. Please select an image under 2MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    profileImage.src = imageData;
                    profileImage.style.display = 'block';
                    profileImage.style.animation = 'fadeInUp 0.5s ease';
                    profilePlaceholder.style.display = 'none';
                    try {
                        localStorage.setItem('profilePhoto', imageData);
                    } catch (err) {
                        console.warn('Could not save image to localStorage (may be too large).');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================================================
    // 19. Mouse Parallax Effect on Hero
    // ==========================================================================
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (hero && heroBg) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ==========================================================================
    // 20. Typewriter Effect for Hero Title
    // ==========================================================================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.display = 'inline-block';
        heroTitle.style.borderRight = '2px solid var(--primary)';
        heroTitle.style.overflow = 'hidden';
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.animation = 'none';

        let charIndex = 0;
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 40);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        }
        setTimeout(typeWriter, 800);
    }

    // ==========================================================================
    // 21. Keyboard Navigation Support
    // ==========================================================================
    document.addEventListener('keydown', (e) => {
        // Press 'T' to go to top
        if (e.key === 't' || e.key === 'T') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Press 'C' to focus on contact
        if (e.key === 'c' || e.key === 'C') {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const nameInput = document.getElementById('name');
                if (nameInput) setTimeout(() => nameInput.focus(), 800);
            }
        }
    });

    // ==========================================================================
    // 22. Console Easter Egg
    // ==========================================================================
    console.log('%c🚀 Fabrice Niyonsaba | Full-Stack Developer & Data Statistician', 'font-size: 1.5rem; font-weight: bold; color: #6c63ff;');
    console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript | Data-driven development', 'font-size: 1rem; color: #b0b0d0;');
    console.log('%c🔥 Tip: Press "T" to scroll to top, "C" to focus contact form', 'font-size: 0.9rem; color: #8b85ff;');

});