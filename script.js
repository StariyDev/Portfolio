document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // MULTI-LANGUAGE (i18n) DICTIONARY & ENGINE
    // ==========================================
    const translations = {
        en: {
            nav: {
                home: "Home",
                services: "Services",
                projects: "Projects",
                contact: "Contact",
                btnContact: "Get in Touch"
            },
            hero: {
                badge: "Available for new projects",
                titlePrefix: "Software & Fullstack",
                titleSuffix: "Developer",
                subtitle: "Full-cycle engineering: Web, Desktop & Mobile applications, API design, and process automation. Building resilient cross-platform software powered by C#, Python, and Node.js.",
                btnDiscuss: "Discuss Project",
                btnWorks: "View Portfolio",
                techBarTitle: "Core Stack:"
            },
            services: {
                tagline: "Specializations",
                title: "What I Build",
                subtitle: "Professional development of cross-platform software, robust backend architectures, and intelligent automation systems.",
                card1Title: "Web & Backend Development",
                card1Desc: "Building high-load web services, designing REST/GraphQL APIs, microservices, databases, and responsive admin panels.",
                card2Title: "Desktop & Mobile Applications",
                card2Desc: "Developing cross-platform desktop and mobile apps with responsive, ergonomic UI/UX and full native integration.",
                card3Title: "Automation, Scripts & Tools",
                card3Desc: "Automating data scraping, third-party API integrations, Telegram/Discord bots, and custom internal tools to optimize business workflows."
            },
            projects: {
                tagline: "Portfolio",
                title: "Featured Projects",
                subtitle: "Examples of real-world end-to-end projects engineered from architecture design to production deployment.",
                filterAll: "All Projects",
                filterWeb: "Web & Backend",
                filterDesktopMobile: "Desktop & Mobile",
                filterAutomation: "Automation",
                card1Title: "Cross-Platform Desktop App",
                card1Desc: "Application for secure local data management, file encryption, and real-time telemetry visualization.",
                card2Title: "Fullstack Web Service",
                card2Desc: "SaaS platform featuring user dashboard, billing integration, flexible RESTful API, and third-party analytics.",
                card3Title: "Server Monitor & Task Runner",
                card3Desc: "Cross-platform mobile client for system administrators. Real-time resource telemetry (CPU, RAM, Disk), Incident Center, and terminal Task Runner.",
                card4Title: "Automated Scraping & Analytics Pipeline",
                card4Desc: "Intelligent marketplace parsing system with captcha bypass, anomaly filtering, and automated Telegram reporting."
            },
            contact: {
                tagline: "Get in Touch",
                title: "Let's Discuss Your Project",
                subtitle: "Looking for a reliable engineer to build stable software, web applications, or automate your workflows? Drop me a message and let's engineer the optimal solution.",
                nameLabel: "Your Name",
                namePlaceholder: "John Doe",
                contactLabel: "Contact Email / Telegram",
                contactPlaceholder: "example@mail.com or @username",
                msgLabel: "Project Details",
                msgPlaceholder: "What solution or software do you need built?",
                btnSubmit: "Send Message",
                successMsg: "Thank you, {name}! Your message has been sent successfully. I will get back to you shortly!"
            },
            footer: {
                rights: "© 2026 DevEngine. All rights reserved."
            },
            lightboxCaptions: {
                c1: "Hosts Dashboard (Server Metrics)",
                c2: "Incident Alert Center (Warnings & Actions)",
                c3: "Terminal Task Runner (Console & Logs)"
            }
        },
        ka: {
            nav: {
                home: "მთავარი",
                services: "მიმართულებები",
                projects: "პროექტები",
                contact: "კონტაქტი",
                btnContact: "დაკავშირება"
            },
            hero: {
                badge: "ხელმისაწვდომია ახალი პროექტებისთვის",
                titlePrefix: "Software & Fullstack",
                titleSuffix: "დეველოპერი",
                subtitle: "სრული ციკლის ინჟინერია: Web, Desktop და Mobile აპლიკაციები, API არქიტექტურა და პროცესების ავტომატიზაცია. C#, Python და Node.js ბაზაზე შექმნილი სისტემები.",
                btnDiscuss: "პროექტის განხილვა",
                btnWorks: "ნამუშევრების ნახვა",
                techBarTitle: "ძირითადი სტეკი:"
            },
            services: {
                tagline: "სპეციალიზაცია",
                title: "რას ვქმნი",
                subtitle: "კროსპლატფორმული პროგრამული უზრუნველყოფის, სერვერული არქიტექტურის და ავტომატიზაციის სისტემების პროფესიონალური შემუშავება.",
                card1Title: "Web & Backend დეველოპმენტი",
                card1Desc: "მაღალი დატვირთვის ვებ-სერვისების შექმნა, REST/GraphQL API, მიკროსერვისების, მონაცემთა ბაზების და ადმინ-პანელების პროექტირება.",
                card2Title: "Desktop & Mobile აპლიკაციები",
                card2Desc: "კროსპლატფორმული სამუშაო მაგიდის და მობილური აპლიკაციების შემუშავება ერგონომიული UI/UX-ით და ნატიური ინტეგრაციით.",
                card3Title: "ავტომატიზაცია, სკრიპტები და ინსტრუმენტები",
                card3Desc: "მონაცემთა პარსინგის ავტომატიზაცია, API ინტეგრაციები, Telegram/Discord ბოტები და შიდა ბიზნეს ინსტრუმენტები."
            },
            projects: {
                tagline: "პორტფოლიო",
                title: "შესრულებული პროექტები",
                subtitle: "რეალური პროექტების მაგალითები, შემუშავებული სრული ციკლით — არქიტექტურიდან სერვერულ დეპლოამდე.",
                filterAll: "ყველა პროექტი",
                filterWeb: "Web & Backend",
                filterDesktopMobile: "Desktop & Mobile",
                filterAutomation: "ავტომატიზაცია",
                card1Title: "Cross-Platform Desktop App",
                card1Desc: "აპლიკაცია ლოკალური მონაცემთა უსაფრთხო მართვისთვის, ფაილების დაშიფვრისთვის და რეალური დროის ტელემეტრიისთვის.",
                card2Title: "Fullstack Web Service",
                card2Desc: "SaaS პლატფორმა მომხმარებლის კაბინეტით, ბილინგის სისტემით, მოქნილი RESTful API-ით და ანალიტიკით.",
                card3Title: "Server Monitor & Task Runner",
                card3Desc: "კროსპლატფორმული მობილური კლიენტი სისტემური ადმინისტრატორებისთვის. რესურსების (CPU, RAM, Disk) მონიტორინგი, Incident Center და Task Runner.",
                card4Title: "Automated Scraping & Analytics Pipeline",
                card4Desc: "ინტელექტუალური პარსინგის სისტემა ქაფჩის გვერდის ავლით, ანომალიების ფილტრაციით და ავტომატური რეპორტინგით."
            },
            contact: {
                tagline: "დაკავშირება",
                title: "განვიხილოთ თქვენი პროექტი?",
                subtitle: "ეძებთ საიმედო ინჟინერს პროგრამული უზრუნველყოფის, ვებ-აპლიკაციების ან ავტომატიზაციისთვის? მოგვწერეთ და შევარჩევთ ოპტიმალურ გადაწყვეტას.",
                nameLabel: "თქვენი სახელი",
                namePlaceholder: "გიორგი გიორგაძე",
                contactLabel: "საკონტაქტო Email / Telegram",
                contactPlaceholder: "example@mail.com ან @username",
                msgLabel: "პროექტის აღწერა",
                msgPlaceholder: "რა გადაწყვეტა ან პროდუქტი გჭირდებათ?",
                btnSubmit: "მოთხოვნის გაგზავნა",
                successMsg: "გმადლობთ, {name}! თქვენი შეტყობინება წარმატებით გაიგზავნა. მალე დაგიკავშირდებით!"
            },
            footer: {
                rights: "© 2026 DevEngine. ყველა უფლება დაცულია."
            },
            lightboxCaptions: {
                c1: "Hosts Dashboard (სერვერის მეტრიკები)",
                c2: "Incident Alert Center (ინციდენტების ცენტრი)",
                c3: "Terminal Task Runner (კონსოლი და ლოგები)"
            }
        },
        ru: {
            nav: {
                home: "Главная",
                services: "Направления",
                projects: "Проекты",
                contact: "Контакты",
                btnContact: "Связаться"
            },
            hero: {
                badge: "Доступен для новых проектов",
                titlePrefix: "Software & Fullstack",
                titleSuffix: "Developer",
                subtitle: "Разработка полного цикла: Web, Desktop & Mobile приложения, API и автоматизация бизнес-процессов. Создаю надежные кроссплатформенные системы на базе C#, Python и Node.js.",
                btnDiscuss: "Обсудить проект",
                btnWorks: "Посмотреть работы",
                techBarTitle: "Основной стек:"
            },
            services: {
                tagline: "Направления работы",
                title: "Что я умею создавать",
                subtitle: "Профессиональная разработка кроссплатформенного софта, сложных серверных архитектур и интеллектуальных систем автоматизации.",
                card1Title: "Web & Backend Development",
                card1Desc: "Создание высоконагруженных веб-сервисов, проектирование REST/GraphQL API, микросервисов, баз данных и интерактивных административных панелей.",
                card2Title: "Desktop & Mobile Applications",
                card2Desc: "Разработка кроссплатформенных настольных и мобильных приложений с отзывчивым, эргономичным UI/UX и полноценной нативной интеграцией.",
                card3Title: "Automation, Scripts & Tools",
                card3Desc: "Автоматизация парсинга данных, интеграция со сторонними API, боты для Telegram/Discord, разработка внутренних инструментов для оптимизации бизнеса."
            },
            projects: {
                tagline: "Портфолио",
                title: "Выполненные кейсы",
                subtitle: "Примеры реальных проектов, разработанных под ключ — от проектирования архитектуры до деплоя.",
                filterAll: "Все проекты",
                filterWeb: "Web & Backend",
                filterDesktopMobile: "Desktop & Mobile",
                filterAutomation: "Автоматизация",
                card1Title: "Cross-Platform Desktop App",
                card1Desc: "Приложение для безопасного управления локальными данными, шифрования файлов и визуализации локальных метрик в реальном времени.",
                card2Title: "Fullstack Web Service",
                card2Desc: "SaaS платформа с личным кабинетом пользователя, биллинг-системой, гибким RESTful API и интеграцией внешней аналитики.",
                card3Title: "Server Monitor & Task Runner",
                card3Desc: "Кроссплатформенный мобильный клиент для системных администраторов. Мониторинг ресурсов (CPU, RAM, Disk) в реальном времени, встроенный Incident Center и консольный Task Runner.",
                card4Title: "Automated Scraping & Analytics Pipeline",
                card4Desc: "Система интеллектуального парсинга маркетплейсов с обходом капч, фильтрацией аномалий и автовыгрузкой отчетов в Telegram."
            },
            contact: {
                tagline: "Связь со мной",
                title: "Обсудим ваш проект?",
                subtitle: "Ищете надежного инженера для создания стабильного софта, веб-приложений или автоматизации процессов? Напишите мне, и мы подберем идеальное архитектурное решение.",
                nameLabel: "Ваше имя",
                namePlaceholder: "Иван Иванов",
                contactLabel: "Контактный Email / Telegram",
                contactPlaceholder: "example@mail.ru или @username",
                msgLabel: "Опишите задачу",
                msgPlaceholder: "Какое решение или продукт вам требуются?",
                btnSubmit: "Отправить запрос",
                successMsg: "Спасибо, {name}! Ваша заявка успешно отправлена. Я свяжусь с вами в ближайшее время!"
            },
            footer: {
                rights: "© 2026 DevEngine. Все права защищены."
            },
            lightboxCaptions: {
                c1: "Hosts Dashboard (Метрики серверов)",
                c2: "Incident Alert Center (Центр алертов)",
                c3: "Terminal Task Runner (Консоль логов)"
            }
        }
    };

    let currentLang = localStorage.getItem('portfolio_lang') || 'en';

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        document.documentElement.lang = lang;

        // Update active class on language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Helper to get nested value from object by path string e.g. "hero.badge"
        function getNestedTranslation(path) {
            return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, translations[lang]);
        }

        // Translate text elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update Gallery captions data-attribute dynamically
        const galleryTrigger = document.querySelector('.gallery-trigger');
        if (galleryTrigger) {
            const caps = translations[lang].lightboxCaptions;
            galleryTrigger.setAttribute('data-captions', `${caps.c1},${caps.c2},${caps.c3}`);
        }
    }

    // Language switcher click handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Initialize language
    setLanguage(currentLang);

    // ==========================================
    // THEME SWITCHER (LIGHT <-> DARK MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('portfolio_theme') || 'light';

    function setTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('portfolio_theme', theme);

        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // Initialize Theme
    setTheme(currentTheme);
    
    // ==========================================
    // STICKY HEADER ON SCROLL
    // ==========================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
            
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars.forEach(bar => bar.style.transform = 'none');
                bars[1].style.opacity = '1';
            });
        });
    }

    // ==========================================
    // PORTFOLIO FILTER SYSTEM
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in-item');
                } else {
                    card.classList.remove('fade-in-item');
                    card.classList.add('fade-out');
                }
            });
        });
    });

    // ==========================================
    // ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // SCROLL REVEAL ANIMATION (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Ensure Hero section elements render smoothly without blocking visibility
    const heroElements = document.querySelectorAll('.hero-section .fade-in');
    heroElements.forEach((el, index) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // ==========================================
    // CONTACT FORM SUBMIT HANDLER (Mock Demo)
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status-msg');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                formStatus.className = 'form-status';
                formStatus.classList.add('success');
                
                const template = translations[currentLang].contact.successMsg;
                formStatus.innerText = template.replace('{name}', name);
                
                contactForm.reset();

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 7000);

            }, 1500);
        });
    }

    // ==========================================
    // PORTFOLIO LIGHTBOX / SCREENSHOTS GALLERY
    // ==========================================
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;

    let galleryImages = [];
    let galleryCaptions = [];
    let currentImgIndex = 0;

    if (lightbox && lightboxImg) {
        const triggers = document.querySelectorAll('.gallery-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const imgAttr = trigger.getAttribute('data-images');
                const captionAttr = trigger.getAttribute('data-captions');

                if (imgAttr) {
                    galleryImages = imgAttr.split(',');
                    galleryCaptions = captionAttr ? captionAttr.split(',') : [];
                    currentImgIndex = 0;

                    showImage(currentImgIndex);
                    lightbox.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function showImage(index) {
            lightboxImg.style.transform = 'scale(0.95)';
            lightboxImg.style.opacity = '0.5';

            setTimeout(() => {
                lightboxImg.src = galleryImages[index];
                if (lightboxCaption) {
                    lightboxCaption.innerText = galleryCaptions[index] || `Image ${index + 1}`;
                }
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper') || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        const nextImage = () => {
            currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
            showImage(currentImgIndex);
        };

        const prevImage = () => {
            currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(currentImgIndex);
        };

        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        });
    }
});
