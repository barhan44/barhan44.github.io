// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');

// Mobile Menu Toggle
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navList.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navList.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    navToggle.classList.remove('active');
    navList.classList.remove('active');
    document.body.style.overflow = '';
}

// Smooth scroll to sections
function smoothScrollTo(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle navigation link clicks
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        smoothScrollTo(targetId);
        closeMobileMenu();
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
    }
}

// Header scroll effect
function handleHeaderScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(`
        .main-info__item,
        .about__content > div,
        .skills__category,
        .project-card,
        .interest-item
    `);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Active section highlighting in navigation
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Keyboard navigation support
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape' && navList.classList.contains('active')) {
        closeMobileMenu();
    }
}

// Initialize everything when DOM is loaded
function init() {
    // Mobile menu events
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation link events
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        
        // Throttle the active navigation update
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavigation, 100);
    });
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') && 
            !navList.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Set initial active navigation
    updateActiveNavigation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Enhanced smooth scrolling for better performance
function enhancedSmoothScroll() {
    // Only add this enhancement if the browser doesn't support smooth scrolling natively
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Polyfill for smooth scrolling
        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.smoothScrollTo = (target) => {
            const startPosition = window.pageYOffset;
            const targetPosition = target;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutQuad(timeElapsed / duration) * distance + startPosition;
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            requestAnimationFrame(animation);
        };
    }
}

// Performance optimization: Lazy load images if any were added
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Add loading state management
function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Initialize enhancements
enhancedSmoothScroll();
initLazyLoading();

// Export functions for potential external use
window.portfolioApp = {
    smoothScrollTo,
    toggleMobileMenu,
    closeMobileMenu,
    init
};