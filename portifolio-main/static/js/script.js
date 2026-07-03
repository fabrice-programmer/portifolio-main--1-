/* =
   Portfolio - Main JavaScript
   = */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================
    // Navigation Toggle (Mobile)
    // ============================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ============================
    // Navbar Scroll Effect
    // ============================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================
    // Active Nav Link Highlighting
    // ============================
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

    // ============================
    // Animated Counter (Stats)
    // ============================
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
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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

    // ============================
    // Skill Bars Animation
    // ============================
    const skillFills = document.querySelectorAll('.skill-fill');
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;

        skillFills.forEach(fill => {
            const width = fill.getAttribute('data-width') || '0';
            fill.style.width = width + '%';
        });

        skillsAnimated = true;
    }

    // ============================
    // Intersection Observer for Animations
    // ============================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Counter animation trigger
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }

                // Skill bars animation trigger
                if (entry.target.classList.contains('skills-content')) {
                    animateSkillBars();
                }

                // General fade-in animation
                const animElements = entry.target.querySelectorAll('.animate-on-scroll');
                animElements.forEach(el => el.classList.add('visible'));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe about stats
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);

    // Observe skills section
    const skillsSection = document.querySelector('.skills-content');
    if (skillsSection) observer.observe(skillsSection);

    // Observe sections for fade-in
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // ============================
    // Testimonials Slider with Dots
    // ============================
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

            // If at the end, activate last dot
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

    // ============================
    // Contact Form - Static (mailto fallback)
    // ============================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim() || 'New Portfolio Message';
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill all required fields';
                submitBtn.style.background = 'linear-gradient(135deg, #f5576c, #ff6b6b)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
                return;
            }

            // Show sending feedback (form will submit via mailto: action)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening email...';
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Ready!';
                submitBtn.style.background = 'linear-gradient(135deg, #27c93f, #50fa7b)';
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitBtn.style.background = '';
                }, 2000);
            }, 500);
        });

        // Floating label effect
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // ============================
    // Back to Top Button
    // ============================
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

    // ============================
    // Smooth Scroll for Anchor Links
    // ============================
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

    // ============================
    // Newsletter Form
    // ============================
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const button = newsletterForm.querySelector('button');

            if (input.value) {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = 'linear-gradient(135deg, #27c93f, #50fa7b)';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-arrow-right"></i>';
                    button.style.background = '';
                }, 3000);
            }
        });
    }

    // ============================
    // Profile Photo Upload (Edit & Persist)
    // ============================
    const editPhotoBtn = document.getElementById('editPhotoBtn');
    const photoInput = document.getElementById('photoInput');
    const profileImage = document.getElementById('profileImage');
    const profilePlaceholder = document.getElementById('profilePlaceholder');

    if (editPhotoBtn && photoInput && profileImage && profilePlaceholder) {
        // Load saved profile photo from localStorage
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            profileImage.src = savedPhoto;
            profileImage.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        }

        // Trigger file input on button click
        editPhotoBtn.addEventListener('click', () => {
            photoInput.click();
        });

        // Handle file selection
        photoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const imageData = event.target.result;
                    // Display the image
                    profileImage.src = imageData;
                    profileImage.style.display = 'block';
                    profilePlaceholder.style.display = 'none';
                    // Save to localStorage for persistence
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

    // ============================
    // Mouse Parallax Effect on Hero
    // ============================
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (hero && heroBg) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ============================
    // Typewriter Effect for Hero Title
    // ============================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.display = 'inline-block';
        heroTitle.style.borderRight = '2px solid var(--primary)';
        heroTitle.style.overflow = 'hidden';
        heroTitle.style.whiteSpace = 'nowrap';

        let charIndex = 0;
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        }

        setTimeout(typeWriter, 500);
    }

    // ============================
    // Preloader
    // ============================
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;

    // Style the preloader
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
            transition: opacity 0.5s ease, visibility 0.5s ease;
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
            margin: 0 auto 16px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .preloader-content p {
            color: #b0b0d0;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
        }
    `;

    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 300);
    });

    // Fallback: hide preloader after 3s if load event doesn't fire
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
        }
    }, 4000);

    console.log('%c🚀 Fabrice Niyonsaba | Full-Stack Developer & Data Statistician', 'font-size: 1.5rem; font-weight: bold; color: #6c63ff;');
    console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript | Data-driven development', 'font-size: 1rem; color: #b0b0d0;');
});
