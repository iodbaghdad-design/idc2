// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Initialize all animations and interactions
    initScrollAnimations();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    
    // Load data from localStorage
    loadDatesData();
    loadEventsData();
    loadCouncilData();
    loadStudiesData();
    loadAdsData();
});

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeHttpUrl(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    try {
        const url = new URL(raw, window.location.href);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) {
        return '';
    }
}

function sanitizeImageSource(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    if (/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(raw)) return raw;

    try {
        const url = new URL(raw, window.location.href);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) {
        return '';
    }
}

// Scroll Animation Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    // Hero content animation on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background blur based on scroll
        if (currentScroll > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.add('bg-white/95');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.remove('bg-white/95');
        }

        // Hide/show navbar on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isOpen = false;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            mobileMenu.classList.toggle('hidden');
            
            // Animate menu icon
            const icon = menuBtn.querySelector('i');
            if (isOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                isOpen = false;
                const icon = menuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('#home img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Form Validation and Submission
// Form submission is handled by EmailJS in index.html

// Studies Data Loading
function loadStudiesData() {
    const studies = JSON.parse(localStorage.getItem('iraq_dates_studies') || '[]');
    const container = document.getElementById('studiesContainer');
    
    if (!container) return;
    
    if (studies.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-stone-500">لا توجد دراسات متاحة حالياً</div>';
        return;
    }
    
    container.innerHTML = studies.map(study => `
        <div class="bg-white p-6 rounded-xl shadow-lg border border-stone-100 hover:shadow-xl transition-shadow">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i data-lucide="file-text" class="w-6 h-6 text-amber-600"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-stone-800 mb-2">${escapeHTML(study.title)}</h3>
                    <p class="text-stone-600 mb-4">${escapeHTML(study.description)}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-stone-500">${escapeHTML(study.date || 'غير محدد')}</span>
                        <button onclick="downloadStudy(${Number(study.id)})" class="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            تحميل
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// Ads Data Loading
function loadAdsData() {
    const ads = JSON.parse(localStorage.getItem('iraq_dates_ads') || '[]');
    const container = document.getElementById('adsContainer');
    
    if (!container) return;
    
    if (ads.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-stone-500">لا توجد إعلانات متاحة حالياً</div>';
        return;
    }
    
    container.innerHTML = ads.map(ad => {
        const safeImage = sanitizeImageSource(ad.image) || '';
        const safeLink = sanitizeHttpUrl(ad.link);
        return `
        <div class="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-xl transition-shadow group">
            <img src="${safeImage}" alt="${escapeHTML(ad.title)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="px-3 py-1 bg-amber-100 text-amber-600 text-sm font-semibold rounded-full">${escapeHTML(ad.type)}</span>
                    <span class="text-stone-400 text-sm">${escapeHTML(ad.date || 'غير محدد')}</span>
                </div>
                <h3 class="text-xl font-bold text-stone-800 mb-3">${escapeHTML(ad.title)}</h3>
                <p class="text-stone-600 mb-4 line-clamp-2">${escapeHTML(ad.description)}</p>
                ${safeLink ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold">
                    <i data-lucide="external-link" class="w-4 h-4"></i>
                    المزيد
                </a>` : ''}
            </div>
        </div>
    `;
    }).join('');
    
    lucide.createIcons();
}

function downloadStudy(fileName) {
    const studies = JSON.parse(localStorage.getItem('iraq_dates_studies') || '[]');
    const study = studies.find(item => Number(item.id) === Number(fileName));
    
    if (!study || !study.fileData) {
        showNotification('ملف الدراسة غير متوفر للتحميل حالياً', 'error');
        return;
    }

    const link = document.createElement('a');
    link.href = study.fileData;
    link.download = study.fileName || study.file || 'study.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 transition-all duration-500 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-6 h-6"></i>
            <span class="font-semibold">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-amber-600');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-amber-600');
            }
        });
    });
}

updateActiveNavLink();

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add magnetic button effect to CTAs
document.querySelectorAll('button, .btn-glow').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--x', `${x}px`);
        this.style.setProperty('--y', `${y}px`);
    });
});

// Load Data Functions
function loadDatesData() {
    const dates = JSON.parse(localStorage.getItem('iraq_dates_types') || '[]');
    const container = document.getElementById('datesContainer');
    
    if (dates.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-stone-400">لا توجد أنواع تمور متاحة حالياً</div>';
        return;
    }
    
    container.innerHTML = dates.map(date => `
        <div class="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/20 transition-all group cursor-pointer">
            <div class="relative overflow-hidden h-48">
                <img src="${date.image}" alt="${date.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div class="w-full p-4">
                        <p class="text-white text-sm font-semibold">${date.classification}</p>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold text-white mb-2">${date.name}</h3>
                <p class="text-sm text-stone-400 mb-3 line-clamp-2">${date.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-amber-300 font-semibold">${date.size}</span>
                    <span class="text-xs text-stone-400">${date.classification}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function loadEventsData() {
    const events = JSON.parse(localStorage.getItem('iraq_dates_events') || '[]');
    const container = document.getElementById('eventsContainer');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-stone-500">لا توجد فعاليات متاحة حالياً</div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div class="h-40 overflow-hidden">
                <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-stone-800">${event.title}</h3>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${getEventBadgeColor(event.type)}">
                        ${event.type}
                    </span>
                </div>
                <p class="text-stone-600 text-sm mb-4">${event.description}</p>
                <div class="flex items-center gap-4 text-sm text-stone-500 border-t border-stone-100 pt-4">
                    <div class="flex items-center gap-1">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span>${event.date}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i data-lucide="map-pin" class="w-4 h-4"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function loadCouncilData() {
    const council = JSON.parse(localStorage.getItem('iraq_dates_council') || '[]');
    const container = document.getElementById('councilContainer');
    
    if (council.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-stone-400">لا توجد معلومات عن أعضاء المجلس</div>';
        return;
    }
    
    container.innerHTML = council.map((member, index) => `
        <div class="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/20 transition-all group">
            <div class="relative overflow-hidden aspect-square">
                <img src="${member.image}" alt="${member.name}" class="w-full h-full object-contain bg-stone-200 group-hover:scale-110 transition-transform duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 class="text-xl font-bold mb-1">${member.name}</h3>
                    <p class="text-amber-300 font-semibold text-sm">${member.position}</p>
                </div>
                <span class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
                    ${member.category}
                </span>
            </div>
            <div class="p-4 bg-stone-900">
                <p class="text-stone-300 text-sm mb-3 line-clamp-2">${member.bio}</p>
                <div class="space-y-2 text-xs text-stone-400 border-t border-stone-700 pt-3 mb-3">
                    <p class="flex items-center gap-2 hover:text-amber-400 transition-colors">
                        <i data-lucide="mail" class="w-3 h-3"></i> 
                        <span>${member.email}</span>
                    </p>
                    <p class="flex items-center gap-2">
                        <i data-lucide="phone" class="w-3 h-3"></i>
                        <span>${member.phone}</span>
                    </p>
                </div>
                <button onclick="openMemberModal(${index})" class="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="info" class="w-4 h-4"></i>
                    تفاصيل
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
    createMemberModal();
}

function createMemberModal() {
    if (document.getElementById('memberModal')) return;

    const modal = document.createElement('div');
    modal.id = 'memberModal';
    modal.className = 'fixed inset-0 z-[999] flex items-center justify-center p-4';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeMemberModal()"></div>
        <div class="relative bg-stone-900 text-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden z-10 border border-stone-700">
            <button onclick="closeMemberModal()" class="absolute top-4 left-4 w-9 h-9 bg-stone-700 hover:bg-stone-600 rounded-full flex items-center justify-center transition-colors z-20">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div id="modalImage" class="w-full h-56 overflow-hidden relative">
                <img id="modalImg" src="" alt="" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
                <div class="absolute bottom-0 right-0 p-5">
                    <span id="modalCategory" class="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full"></span>
                </div>
            </div>
            <div class="p-6">
                <h3 id="modalName" class="text-2xl font-bold mb-1 text-white"></h3>
                <p id="modalPosition" class="text-amber-400 font-semibold mb-4 text-sm"></p>
                <p id="modalBio" class="text-stone-300 text-sm leading-relaxed mb-5"></p>
                <div class="space-y-2 text-sm text-stone-400 border-t border-stone-700 pt-4">
                    <p id="modalEmail" class="flex items-center gap-2">
                        <i data-lucide="mail" class="w-4 h-4 text-amber-400"></i>
                        <span></span>
                    </p>
                    <p id="modalPhone" class="flex items-center gap-2">
                        <i data-lucide="phone" class="w-4 h-4 text-amber-400"></i>
                        <span></span>
                    </p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
}

function openMemberModal(index) {
    const council = JSON.parse(localStorage.getItem('iraq_dates_council') || '[]');
    const member = council[index];
    if (!member) return;

    const modal = document.getElementById('memberModal');
    document.getElementById('modalImg').src = member.image;
    document.getElementById('modalImg').alt = member.name;
    document.getElementById('modalCategory').textContent = member.category;
    document.getElementById('modalName').textContent = member.name;
    document.getElementById('modalPosition').textContent = member.position;
    document.getElementById('modalBio').textContent = member.bio;
    document.getElementById('modalEmail').querySelector('span').textContent = member.email;
    document.getElementById('modalPhone').querySelector('span').textContent = member.phone;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

function getEventBadgeColor(type) {
    const colors = {
        'سنوي': 'bg-amber-100 text-amber-600',
        'نصف سنوي': 'bg-blue-100 text-blue-600',
        'مستمر': 'bg-green-100 text-green-600',
        'مرة واحدة': 'bg-purple-100 text-purple-600'
    };
    return colors[type] || 'bg-stone-100 text-stone-600';
}